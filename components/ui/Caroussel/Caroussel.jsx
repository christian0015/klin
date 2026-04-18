"use client";
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, useTexture, useVideoTexture, Text } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import { easing } from 'maath'
import "./BentPlaneGeometry"
import Fire from "./Fire"
import { collectionScrollStore } from "../../collectionScrollStore"

/* =========================
   APP
========================= */

export default function Caroussel({ list = [] }) {
  const radius = 1.2
  const spacing = 0.4

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 35 }}
      style={{ height: '100vh', background: "black" }}
    >
      <fog attach="fog" args={['#000', 10, 40]} />

      {/* Plus de ScrollControls — on gère le scroll via le store GSAP */}
      <Fire scale={[1.2, 8.5, 1]} />
      <Rig count={list.length} radius={radius} spacing={spacing} />
      <Carousel list={list} radius={radius} spacing={spacing} />

    </Canvas>
  )
}

/* =========================
   CAROUSEL
========================= */

function Carousel({ list, radius, spacing }) {
  return list.map((item, i) => {
    const angle = (i / list.length) * Math.PI * 2

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
    )
  })
}

/* =========================
   CAMERA RIG — lit collectionScrollStore directement dans useFrame
========================= */

function Rig({ count, radius, spacing }) {
  // On smooth le progress côté R3F pour que l'élan du scroll GSAP
  // soit encore affiné par une interpolation locale (double smoothing = ultra fluide)
  const smoothOffset = useRef(0)

  useFrame((state, delta) => {
    // Interpolation locale pour adoucir encore plus
    smoothOffset.current += (collectionScrollStore.offset - smoothOffset.current) * Math.min(delta * 8, 1)

    const t = smoothOffset.current * (count - 1)
    const angle = (t / count) * Math.PI * 2

    const camX = Math.sin(angle) * (radius * 3)
    const camZ = Math.cos(angle) * (radius * 3)
    const camY = -t * spacing

    easing.damp3(state.camera.position, [camX, camY, camZ], 0.018, delta)

    const lookX = Math.sin(angle) * radius
    const lookZ = Math.cos(angle) * radius
    const lookY = -t * spacing

    state.camera.lookAt(lookX, lookY, lookZ)
  })

  return null
}

/* =========================
   FACE CAMERA
========================= */

function FaceCamera({ children, ...props }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.lookAt(state.camera.position)
  })

  return <group ref={ref} {...props}>{children}</group>
}

/* =========================
   PRODUCT CARD
========================= */

function ProductCard({ item, ...props }) {
  const mediaUrl = item.media?.[0]
  const isVideo = mediaUrl?.endsWith(".mp4")

  return (
    <group {...props}>
      {isVideo ? (
        <SmartVideo url={mediaUrl} />
      ) : (
        <SmartImage url={mediaUrl} />
      )}

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
            position={[-0.053, 0, 0]}
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
  )
}

/* =========================
   BUTTON
========================= */

function Button({ text, onClick, ...props }) {
  const ref = useRef()

  return (
    <group {...props} onClick={onClick}>
      <mesh ref={ref}>
        <planeGeometry args={[0.46, 0.082]} />
        <meshBasicMaterial color="red" />
        <bentPlaneGeometry args={[0.1, 0.49, 0.0829, 20, 20]} />
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
  )
}

/* =========================
   CART BUTTON
========================= */

function CartButton({ onClick, ...props }) {
  return (
    <group {...props} onClick={onClick}>
      <mesh>
        <circleGeometry args={[0.0512, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.051} color="black">
        🛒
      </Text>
    </group>
  )
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
    pos.y += wave * 0.832;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

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

    vec2 offset = vec2(uShift * 0.513, 0.0);
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
`

/* =========================
   SMART IMAGE — shift calculé depuis le store (pas useScroll)
========================= */

function SmartImage({ url, scale = [1, 1, 1], radius = 0.13, zoom = 1.2, ...props }) {
  const mesh = useRef()
  const material = useRef()
  const texture = useTexture(url)
  const [hovered, hover] = useState(false)
  const lastOffset = useRef(0)

  useFrame((state, delta) => {
    const current = collectionScrollStore.offset
    const diff = current - lastOffset.current
    lastOffset.current = current

    const intensity = THREE.MathUtils.clamp(diff * 20, -1, 1)

    if (material.current) {
      if (texture.image) {
        material.current.uniforms.uImageSize.value.set(
          texture.image.width,
          texture.image.height
        )
      }
      material.current.uniforms.uShift.value = intensity
      material.current.uniforms.uZoom.value = hovered ? 1.0 : zoom
      material.current.uniforms.uRadius.value = hovered ? radius * 1.5 : radius
    }

    easing.damp3(mesh.current.scale, hovered ? 0.9 : 0.75, 0.15, delta)
  })

  return (
    <mesh
      ref={mesh}
      {...props}
      scale={scale}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}
    >
      <bentPlaneGeometry args={[0.1, 0.9, 0.9, 20, 20]} />
      <shaderMaterial
        ref={material}
        uniforms={{
          uTexture: { value: texture },
          uImageSize: {
            value: new THREE.Vector2(
              texture.image?.width || 1,
              texture.image?.height || 1
            ),
          },
          uPlaneSize: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: radius },
          uZoom: { value: zoom },
          uShift: { value: 0 },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* =========================
   SMART VIDEO
========================= */

function SmartVideo({ url, scale = [1, 1, 1], radius = 0.13, zoom = 1.2, ...props }) {
  const mesh = useRef()
  const material = useRef()
  const [hovered, hover] = useState(false)
  const lastOffset = useRef(0)

  const texture = useVideoTexture(url, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "Anonymous"
  })

  useMemo(() => {
    if (!texture) return
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
  }, [texture])

  useFrame((state, delta) => {
    const current = collectionScrollStore.offset
    const diff = current - lastOffset.current
    lastOffset.current = current

    const intensity = THREE.MathUtils.clamp(diff * 20, -1, 1)

    if (material.current) {
      if (texture.image) {
        material.current.uniforms.uImageSize.value.set(
          texture.image.videoWidth || 1,
          texture.image.videoHeight || 1
        )
      }
      material.current.uniforms.uShift.value = intensity
      material.current.uniforms.uZoom.value = hovered ? 1.0 : zoom
      material.current.uniforms.uRadius.value = hovered ? radius * 1.5 : radius
    }

    easing.damp3(mesh.current.scale, hovered ? 0.9 : 0.75, 0.15, delta)
  })

  return (
    <mesh
      ref={mesh}
      {...props}
      scale={scale}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}
    >
      <bentPlaneGeometry args={[0.1, 0.9, 0.9, 20, 20]} />
      <shaderMaterial
        ref={material}
        transparent
        side={THREE.DoubleSide}
        uniforms={{
          uTexture: { value: texture },
          uImageSize: { value: new THREE.Vector2(1, 1) },
          uPlaneSize: { value: new THREE.Vector2(1, 1) },
          uRadius: { value: radius },
          uZoom: { value: zoom },
          uShift: { value: 0 },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}