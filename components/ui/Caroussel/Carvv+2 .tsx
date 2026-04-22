"use client";

import * as THREE from "three";
import React, { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useTexture, useVideoTexture } from "@react-three/drei";
import { easing } from "maath";

import "./BentPlaneGeometry";
import Fire from "./Fire";
import { collectionScrollStore } from "../../collectionScrollStore";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */

interface Product {
  name: string;
  media: string[];
  link: string;
  price: number;
  description: { short: string };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: any;
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED SCROLL STATE — une seule ref, lue dans chaque useFrame
   Evite les closures multiples sur collectionScrollStore
───────────────────────────────────────────────────────────────────────────── */

const scrollState = {
  current: 0,
  previous: 0,
  velocity: 0,
};

/* ─────────────────────────────────────────────────────────────────────────────
   SHADERS — améliorés
   + grain film procédural (pas de texture externe)
   + vignette douce
   + fresnel edge glow beige sable
   + RGB chromatic aberration améliorée
   + rounded corners avec AA
───────────────────────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;
  uniform float uShift;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Micro-ondulation organique (amplitude très faible = quasi gratuit)
    vec3 pos = position;
    float wave = sin(uv.x * 3.14159) * uShift;
    pos.y += wave * 0.28;

    // Très légère respiration (0.002 = invisible mais vivant)
    pos.z += sin(uTime * 0.6 + uv.x * 2.0) * 0.002;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vViewPos = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  uniform float uRadius;
  uniform float uZoom;
  uniform float uShift;
  uniform float uTime;
  uniform float uHover;
  uniform float uActive;

  /* ── Utilitaires ── */

  vec2 coverUv(vec2 uv, vec2 imgSize, vec2 planeSize) {
    float imgRatio = imgSize.x / imgSize.y;
    float planeRatio = planeSize.x / planeSize.y;
    vec2 newUv = uv;
    if (planeRatio > imgRatio) {
      float scale = imgRatio / planeRatio;
      newUv.y = uv.y * scale + (1.0 - scale) * 0.5;
    } else {
      float scale = planeRatio / imgRatio;
      newUv.x = uv.x * scale + (1.0 - scale) * 0.5;
    }
    return newUv;
  }

  float roundedBox(vec2 uv, float radius) {
    vec2 dist = abs(uv - 0.5) - 0.5 + radius;
    return length(max(dist, 0.0)) - radius;
  }

  // Pseudo-random (hash) pour grain procédural
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float grain(vec2 uv, float time) {
    vec2 p = uv * vec2(1920.0, 1080.0);
    return hash(p + floor(time * 24.0) * 0.5);
  }

  void main() {
    vec2 uv = vUv;

    // Zoom cover
    uv = (uv - 0.5) * uZoom + 0.5;
    uv = coverUv(uv, uImageSize, uPlaneSize);
    uv = clamp(uv, 0.0, 1.0);

    // Chromatic aberration — proportionnelle à la vélocité + légère en idle
    float aberrationBase = 0.003;
    float aberration = aberrationBase + abs(uShift) * 0.022;
    vec2 offsetR = vec2( aberration, 0.0);
    vec2 offsetB = vec2(-aberration, 0.0);

    vec4 colR = texture2D(uTexture, clamp(uv + offsetR, 0.0, 1.0));
    vec4 colG = texture2D(uTexture, uv);
    vec4 colB = texture2D(uTexture, clamp(uv + offsetB, 0.0, 1.0));

    vec4 color = vec4(colR.r, colG.g, colB.b, colG.a);

    // Grain film procédural (très léger, 2% d'opacité)
    float g = grain(vUv, uTime);
    color.rgb += (g - 0.5) * 0.04;

    // Vignette douce
    float vignette = 1.0 - dot(vUv - 0.5, (vUv - 0.5) * 1.8);
    vignette = clamp(vignette, 0.0, 1.0);
    color.rgb *= mix(1.0, vignette, 0.35);

    // Fresnel edge glow — beige sable (#D6C3A3) au hover
    vec3 viewDir = normalize(vViewPos);
    float fresnel = 1.0 - abs(dot(vNormal, viewDir));
    fresnel = pow(fresnel, 2.5);
    vec3 fresnelColor = vec3(0.839, 0.765, 0.639); // #D6C3A3
    color.rgb += fresnelColor * fresnel * uHover * 0.35;

    // Légère saturation boost au hover
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(color.rgb, mix(vec3(luminance), color.rgb, 1.18), uHover * 0.5);

    // Rounded corners avec anti-aliasing
    float dist = roundedBox(vUv, uRadius);
    float aa = fwidth(dist);
    float mask = 1.0 - smoothstep(-aa, aa, dist);
    color.a *= mask;

    if (color.a < 0.01) discard;

    gl_FragColor = color;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLES — 60 points max, geometry statique créée une seule fois
───────────────────────────────────────────────────────────────────────────── */

const PARTICLE_COUNT = 60;

function Particles() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2;
      sizes[i] = Math.random() * 0.012 + 0.004;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xd6c3a3,
        size: 0.008,
        transparent: true,
        opacity: 0.18,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    []
  );

  const ref = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    // Très lente dérive — quasi gratuit
    ref.current.rotation.y += delta * 0.012;
    ref.current.rotation.x += delta * 0.004;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCAN LINE — décor horizontal animé (1 seul mesh)
───────────────────────────────────────────────────────────────────────────── */

function ScanLine() {
  const ref = useRef<THREE.Mesh>(null!);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xd6c3a3,
        transparent: true,
        opacity: 0.04,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.3) * 6;
  });

  return (
    <mesh ref={ref} material={mat}>
      <planeGeometry args={[20, 0.002]} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAMERA RIG — centralisé, un seul useFrame pour toute la caméra
───────────────────────────────────────────────────────────────────────────── */

function Rig({ count, radius, spacing }: { count: number; radius: number; spacing: number }) {
  const smoothT = useRef(0);
  const targetVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    // Mise à jour du scroll state partagé (une seule lecture par frame)
    scrollState.previous = scrollState.current;
    scrollState.current = collectionScrollStore.offset;
    scrollState.velocity = scrollState.current - scrollState.previous;

    // Smooth interpolation
    smoothT.current += (scrollState.current * (count - 1) - smoothT.current) * Math.min(delta * 7, 1);

    const t = smoothT.current;
    const angle = (t / count) * Math.PI * 2;

    const camX = Math.sin(angle) * (radius * 3.2);
    const camZ = Math.cos(angle) * (radius * 3.2);
    const camY = -t * spacing;

    // Micro oscillation caméra — Awwwards signature
    const breathX = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
    const breathY = Math.cos(state.clock.elapsedTime * 0.25) * 0.02;

    easing.damp3(
      state.camera.position,
      [camX + breathX, camY + breathY, camZ],
      0.022,
      delta
    );

    // Smooth lookAt via target vector
    targetVec.set(
      Math.sin(angle) * radius,
      -t * spacing,
      Math.cos(angle) * radius
    );
    state.camera.lookAt(targetVec);
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEDIA — un seul useFrame par card (shader update)
   Les uniforms sont mis à jour via ref → zéro re-render React
───────────────────────────────────────────────────────────────────────────── */

interface MediaProps {
  url: string;
  onHover?: (h: boolean) => void;
}

function MediaMesh({
  url,
  onHover,
  isVideo = false,
}: MediaProps & { isVideo?: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const [hovered, setHovered] = useState(false);
  const hoverSmooth = useRef(0);

  // Texture — hooks séparés selon type
  const imgTexture = isVideo ? null : useTexture(url); // eslint-disable-line
  const vidTexture = isVideo                            // eslint-disable-line
    ? useVideoTexture(url, { muted: true, loop: true, start: true })
    : null;

  const texture = isVideo ? vidTexture! : imgTexture!;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uImageSize: { value: new THREE.Vector2(1, 1) },
      uPlaneSize: { value: new THREE.Vector2(1, 1) },
      uRadius: { value: 0.12 },
      uZoom: { value: 1.18 },
      uShift: { value: 0 },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uActive: { value: 0 },
    }),
    [] // eslint-disable-line
  );

  const handleOver = useCallback(
    (e: THREE.Event) => {
      (e as any).stopPropagation();
      setHovered(true);
      onHover?.(true);
    },
    [onHover]
  );

  const handleOut = useCallback(() => {
    setHovered(false);
    onHover?.(false);
  }, [onHover]);

  useFrame((state, delta) => {
    if (!matRef.current) return;

    // Smooth hover
    hoverSmooth.current += ((hovered ? 1 : 0) - hoverSmooth.current) * Math.min(delta * 5, 1);

    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.getElapsedTime();
    u.uShift.value = scrollState.velocity * 18;
    u.uHover.value = hoverSmooth.current;
    u.uZoom.value = 1.18 - hoverSmooth.current * 0.18;
    u.uRadius.value = 0.12 + hoverSmooth.current * 0.06;

    // Image size (une fois suffit mais coût nul)
    if (!isVideo && (texture as THREE.Texture).image) {
      const img = (texture as THREE.Texture).image as HTMLImageElement;
      if (img.naturalWidth) u.uImageSize.value.set(img.naturalWidth, img.naturalHeight);
    } else if (isVideo && (texture as THREE.VideoTexture).image) {
      const vid = (texture as THREE.VideoTexture).image as HTMLVideoElement;
      if (vid.videoWidth) u.uImageSize.value.set(vid.videoWidth, vid.videoHeight);
    }

    // Scale
    const targetScale = 0.76 + hoverSmooth.current * 0.14;
    easing.damp3(mesh.current.scale, [targetScale, targetScale, targetScale], 0.12, delta);
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      <bentPlaneGeometry args={[0.08, 0.9, 0.9, 16, 16]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HUD OVERLAY — HTML DOM via @react-three/drei Html
   Rendu CSS pur → zéro impact GPU
   Design éditorial premium : pas de boutons ronds génériques
───────────────────────────────────────────────────────────────────────────── */

function ProductHUD({
  item,
  visible,
}: {
  item: Product;
  visible: boolean;
}) {
  return (
    <Html
      center
      position={[0, -0.5262, 0.05]}
      style={{ pointerEvents: visible ? "auto" : "none", userSelect: "none" }}
      distanceFactor={1.8}
      zIndexRange={[10, 20]}
    >
      <div
        style={{
          width: "220px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.4s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        {/* Ligne décorative */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", justifyContent: "center" }}>
          <span style={{ display: "block", flex: 1, height: "1px", background: "rgba(214,195,163,0.35)" }} />
          <span style={{ display: "block", width: "4px", height: "4px", borderRadius: "50%", background: "#D6C3A3", opacity: 0.6 }} />
          <span style={{ display: "block", flex: 1, height: "1px", background: "rgba(214,195,163,0.35)" }} />
        </div>

        {/* Nom produit */}
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "18px",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#FFFFFF",
          letterSpacing: "0.01em",
          lineHeight: 1.1,
          margin: "0 0 4px",
        }}>
          {item.name}
        </p>

        {/* Tagline */}
        <p style={{
          fontSize: "9px",
          fontWeight: 300,
          color: "#6A6A6A",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}>
          {item.description.short}
        </p>

        {/* Prix */}
        {item.price > 0 && (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "22px",
            fontWeight: 200,
            color: "#D6C3A3",
            letterSpacing: "-0.01em",
            margin: "0 0 16px",
          }}>
            {item.price.toLocaleString("fr-MA")} <span style={{ fontSize: "11px", fontFamily: "DM Sans", letterSpacing: "0.1em", opacity: 0.6 }}>MAD</span>
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          <a
            href={item.link}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              background: "#D6C3A3",
              color: "#0B0B0B",
              fontSize: "8px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Voir la pièce
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <button
            onClick={() => console.log("cart:", item.name)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              background: "transparent",
              border: "1px solid rgba(214,195,163,0.3)",
              cursor: "pointer",
              color: "#D6C3A3",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(214,195,163,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(214,195,163,0.3)")}
            aria-label="Ajouter au panier"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </Html>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCT CARD — combine MediaMesh + HUD
───────────────────────────────────────────────────────────────────────────── */

function ProductCard({ item, position, rotation }: {
  item: Product;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const mediaUrl = item.media?.[0] ?? "";
  const isVideo = mediaUrl.endsWith(".mp4");

  return (
    <group position={position} rotation={rotation}>
      <MediaMesh
        url={mediaUrl}
        isVideo={isVideo}
        onHover={setHovered}
      />
      <ProductHUD item={item} visible={true} />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────────────────────────────────────────── */

function Carousel({ list, radius, spacing }: {
  list: Product[];
  radius: number;
  spacing: number;
}) {
  return (
    <>
      {list.map((item, i) => {
        const angle = (i / list.length) * Math.PI * 2;
        return (
          <ProductCard
            key={i}
            item={item}
            position={[
              Math.sin(angle) * radius,
              -i * spacing +0.1,
              Math.cos(angle) * radius,
            ]}
            rotation={[0, Math.PI + angle, 0]}
          />
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AMBIENT RING — anneau géométrique décoratif (1 seul mesh statique)
───────────────────────────────────────────────────────────────────────────── */

function AmbientRing({ radius }: { radius: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xd6c3a3,
        transparent: true,
        opacity: 0.035,
        wireframe: true,
      }),
    []
  );

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.05;
    ref.current.rotation.x += delta * 0.02;
  });

  return (
    <mesh ref={ref} material={mat}>
      <torusGeometry args={[radius * 2.2, 0.003, 4, 80]} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */

export default function Caroussel({ list }: { list: Product[] }) {
  const radius = 1.2;
  const spacing = 0.4;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        style={{ background: "#000" }}
        // Performance: limite le DPR — crucial sur mobile
        dpr={[1, 1.5]}
        // Performance: antialiasing désactivé (shader fait son propre AA)
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        {/* Fog plus profond = meilleur depth cueing */}
        <fog attach="fog" args={["#000000", 8, 35]} />

        {/* Lumière ambiante très douce — sans ombres = coût nul */}
        <ambientLight intensity={0.15} color="#D6C3A3" />

        {/* Fire effect conservé */}
        <Fire scale={[1.1, 8, 1] as any} />

        {/* Décors 3D — tous très légers */}
        <Particles />
        <ScanLine />
        <AmbientRing radius={radius} />

        {/* Rig caméra unique */}
        <Rig count={list.length} radius={radius} spacing={spacing} />

        {/* Cartes produits */}
        <Carousel list={list} radius={radius} spacing={spacing} />
      </Canvas>

      {/* Overlay UI — DOM pur, zéro impact GPU */}
      <div style={{
        position: "absolute",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        pointerEvents: "none",
      }}>
        <span style={{ display: "block", width: "40px", height: "1px", background: "rgba(214,195,163,0.2)" }} />
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: "9px",
          fontWeight: 300,
          color: "rgba(214,195,163,0.35)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          margin: 0,
        }}>
          Faire défiler
        </p>
        <span style={{ display: "block", width: "40px", height: "1px", background: "rgba(214,195,163,0.2)" }} />
      </div>
    </div>
  );
}