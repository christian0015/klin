"use client";

import * as THREE from 'three';
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, ThreeElement } from '@react-three/fiber';
import { Image, Text, useTexture, useVideoTexture } from '@react-three/drei';
import { easing } from 'maath';

// On importe les fichiers locaux (assurez-vous que les types existent ou utilisez un d.ts)
import "./BentPlaneGeometry";
import Fire from "./Fire";
import { collectionScrollStore } from "../../collectionScrollStore";

/* =========================
   TYPES & DECLARATIONS
========================= */

// Déclaration pour que TS reconnaisse l'élément personnalisé bentPlaneGeometry
declare global {
  namespace JSX {
    interface IntrinsicElements {
      bentPlaneGeometry: ThreeElement<typeof THREE.BufferGeometry> & {
        args?: [number, number, number, number, number];
      };
    }
  }
}

interface Product {
  name: string;
  media: string[];
  link: string;
  price: number;
  description: {
    short: string;
  };
}

interface CarouselProps {
  list: Product[];
  radius: number;
  spacing: number;
}

interface RigProps {
  count: number;
  radius: number;
  spacing: number;
}

interface SmartMediaProps {
  url: string;
  scale?: [number, number, number] | number;
  radius?: number;
  zoom?: number;
  [key: string]: any;
}

/* =========================
   APP MAIN COMPONENT
========================= */

export default function Caroussel({ list }: { list: Product[] }) {
  const radius = 1.2;
  const spacing = 0.4;

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 35 }}
      style={{ height: '100vh', background: "black" }}
    >
      <fog attach="fog" args={['#000', 10, 40]} />

      <Fire scale={[1.2, 8.5, 1] as any} />
      
      <Rig count={list.length} radius={radius} spacing={spacing} />
      
      <Carousel list={list} radius={radius} spacing={spacing} />
    </Canvas>
  );
}

/* =========================
   CAROUSEL LOGIC
========================= */

function Carousel({ list, radius, spacing }: CarouselProps) {
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
              -i * spacing,
              Math.cos(angle) * radius
            ]}
            rotation={[0, Math.PI + angle, 0]}
          />
        );
      })}
    </>
  );
}

/* =========================
   CAMERA RIG
========================= */

function Rig({ count, radius, spacing }: RigProps) {
  const smoothOffset = useRef<number>(0);

  useFrame((state, delta) => {
    // Interpolation locale
    smoothOffset.current += (collectionScrollStore.offset - smoothOffset.current) * Math.min(delta * 8, 1);

    const t = smoothOffset.current * (count - 1);
    const angle = (t / count) * Math.PI * 2;

    const camX = Math.sin(angle) * (radius * 3);
    const camZ = Math.cos(angle) * (radius * 3);
    const camY = -t * spacing;

    easing.damp3(state.camera.position, [camX, camY, camZ], 0.018, delta);

    const lookX = Math.sin(angle) * radius;
    const lookZ = Math.cos(angle) * radius;
    const lookY = -t * spacing;

    state.camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

/* =========================
   COMPONENTS
========================= */

function FaceCamera({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position);
    }
  });

  return <group ref={ref} {...props}>{children}</group>;
}

function ProductCard({ item, ...props }: { item: Product; [key: string]: any }) {
  const mediaUrl = item.media?.[0];
  const isVideo = mediaUrl?.endsWith(".mp4");

  return (
    <group {...props}>
      {isVideo ? (
        <SmartVideo url={mediaUrl} />
      ) : (
        <SmartImage url={mediaUrl} />
      )}

      {/* PRICE TAG (Design Minimaliste) */}
      <FaceCamera position={[0.293, 0.35, -0.1]}>
        {/* <mesh>
            <planeGeometry args={[0.22, 0.08]} />
            <meshBasicMaterial color="black" transparent opacity={0.17} />
        </mesh> */}
        <Text fontSize={0.0235} color="white" fontWeight="bold">
          {item.price} MAD
        </Text>
      </FaceCamera>

      <FaceCamera position={[0, -0.3, -0.325]}>
        <Text fontSize={0.0512} color="white" anchorX="center">
          {item.name}
        </Text>

        <Text
          position={[0, -0.042, 0]}
          fontSize={0.027}
          color="#aaa"
          maxWidth={1.2}
          textAlign="center"
        >
          {item.description.short}
        </Text>

        <group position={[0, -0.125, 0]}>
          <Button
            position={[0.0, 0, 0]}
            text="Voir détails"
            onClick={() => window.location.href = item.link}
          />
          <CartButton
            position={[0.24, 0, 0]}
            onClick={() => console.log("Add to cart:", item)}
          />
        </group>
      </FaceCamera>
    </group>
  );
}

function Button({ text, onClick, ...props }: { text: string; onClick: () => void; [key: string]: any }) {
  return (
    <group {...props} onClick={onClick}>
      <mesh>
        <meshBasicMaterial color="#927a53" />
        <bentPlaneGeometry args={[0.01, 0.349, 0.06829, 20, 20]} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.027}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

function CartButton({ onClick, ...props }: { onClick: () => void; [key: string]: any }) {
  return (
    <group {...props} onClick={onClick}>
      <mesh>
        <circleGeometry args={[0.0412, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.0351} color="black">
        🛒
      </Text>
    </group>
  );
}

/* =========================
   SHADERS
========================= */

const vertexShader = `
  varying vec2 vUv;
  uniform float uShift;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(uv.x * 3.1415926) * uShift;
    pos.y += wave * 0.32;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  uniform float uRadius;
  uniform float uZoom;
  uniform float uShift;

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

  void main() {
    vec2 uv = vUv;
    uv = (uv - 0.5) * uZoom + 0.5;
    uv = coverUv(uv, uImageSize, uPlaneSize);
    uv = clamp(uv, 0.0, 1.0);
    vec2 offset = vec2(uShift * 0.13, 0.0);
    vec4 base = texture2D(uTexture, uv);
    vec4 shifted = texture2D(uTexture, uv + offset);
    vec3 colorRGB = vec3(shifted.r, base.g, base.b);
    vec4 color = vec4(colorRGB, base.a);
    float dist = roundedBox(vUv, uRadius);
    float aa = fwidth(dist);
    float mask = 1.0 - smoothstep(0.0, aa, dist);
    color.a *= mask;
    if (color.a < 0.01) discard;
    gl_FragColor = color;
  }
`;

/* =========================
   MEDIA COMPONENTS
========================= */

function SmartImage({ url, scale = [1, 1, 1], radius = 0.13, zoom = 1.2, ...props }: SmartMediaProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);
  const texture = useTexture(url);
  const [hovered, hover] = useState(false);
  const lastOffset = useRef(0);

  useFrame((state, delta) => {
    const current = collectionScrollStore.offset;
    const diff = current - lastOffset.current;
    lastOffset.current = current;
    const intensity = THREE.MathUtils.clamp(diff * 20, -1, 1);

    if (material.current) {
      if (texture.image) {
        material.current.uniforms.uImageSize.value.set(texture.image.width, texture.image.height);
      }
      material.current.uniforms.uShift.value = intensity;
      material.current.uniforms.uZoom.value = hovered ? 1.0 : zoom;
      material.current.uniforms.uRadius.value = hovered ? radius * 1.5 : radius;
    }

    const targetScale = hovered ? 0.9 : 0.75;
    easing.damp3(mesh.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);
  });

  return (
    <mesh
      ref={mesh}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}
    >
      <bentPlaneGeometry args={[0.1, 0.9, 0.9, 20, 20]} />
      <shaderMaterial
        ref={material}
        transparent
        side={THREE.DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uImageSize: { value: new THREE.Vector2(1, 1) },
          uPlaneSize: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: radius },
          uZoom: { value: zoom },
          uShift: { value: 0 },
        }}
      />
    </mesh>
  );
}

function SmartVideo({ url, scale = [1, 1, 1], radius = 0.13, zoom = 1.2, ...props }: SmartMediaProps) {
  const mesh = useRef<THREE.Mesh>(null!);
  const material = useRef<THREE.ShaderMaterial>(null!);
  const [hovered, hover] = useState(false);
  const lastOffset = useRef(0);

  const texture = useVideoTexture(url, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "Anonymous"
  });

  useMemo(() => {
    if (!texture) return;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
  }, [texture]);

  useFrame((state, delta) => {
    const current = collectionScrollStore.offset;
    const diff = current - lastOffset.current;
    lastOffset.current = current;
    const intensity = THREE.MathUtils.clamp(diff * 20, -1, 1);

    if (material.current && texture.image) {
      const video = texture.image as HTMLVideoElement;
      material.current.uniforms.uImageSize.value.set(video.videoWidth || 1, video.videoHeight || 1);
      material.current.uniforms.uShift.value = intensity;
      material.current.uniforms.uZoom.value = hovered ? 1.0 : zoom;
      material.current.uniforms.uRadius.value = hovered ? radius * 1.5 : radius;
    }

    const targetScale = hovered ? 0.9 : 0.75;
    easing.damp3(mesh.current.scale, [targetScale, targetScale, targetScale], 0.15, delta);
  });

  return (
    <mesh
      ref={mesh}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}
    >
      <bentPlaneGeometry args={[0.1, 0.9, 0.9, 20, 20]} />
      <shaderMaterial
        ref={material}
        transparent
        side={THREE.DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uImageSize: { value: new THREE.Vector2(1, 1) },
          uPlaneSize: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: radius },
          uZoom: { value: zoom },
          uShift: { value: 0 },
        }}
      />
    </mesh>
  );
}