"use client";
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Environment, useTexture, useVideoTexture } from '@react-three/drei'
import { useRef, useState, useEffect, useMemo } from 'react'
import { easing } from 'maath'
import  "./BentPlaneGeometry"
import Fire from "./Fire"

/* =========================
   APP
========================= */

export default function App() {
  const count = 8
  const radius = 1.2
  const spacing = 0.4

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 35 }}
    style={{height: '100vh', backgroundColor: 'black'}}>
      {/* 🔥 fog corrigé (on voit derrière maintenant) */}
      <fog attach="fog" args={['#000', 10, 40]} />
      <ScrollControls pages={count} damping={0.312}>
        <Rig count={count} radius={radius} spacing={spacing} />
        <Carousel count={count} radius={radius} spacing={spacing} />
      <Fire scale={[1.2, 8.5,1]} />
      </ScrollControls>

      {/* <Environment preset="dawn" background blur={0.5} /> */}
    </Canvas>
  )
}

/* =========================
   CAROUSEL
========================= */

function Carousel({ radius = 2.2, count = 10, spacing = 1.4 }) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2

    return (
      <SmartVideo
        key={i}
        position={[Math.sin(angle) * radius, -i * spacing, Math.cos(angle) * radius]}
        rotation={[0, Math.PI + angle, 0]}
        // url={`/img${(i % 10) + 1}_.jpg`}
        url={`media/mp4/sample-5s.mp4`}
      />
    )
  })
}

/* =========================
   CAMERA RIG
========================= */

function Rig({ count = 10, radius = 2.2, spacing = 1.4 }) {
  const scroll = useScroll()

  useFrame((state, delta) => {
    const t = scroll.offset * (count - 1)
    const angle = (t / count) * Math.PI * 2

    // 🔥 caméra plus loin → meilleure lecture du cercle
    const camX = Math.sin(angle) * (radius * 3)
    const camZ = Math.cos(angle) * (radius * 3)
    const camY = -t * spacing

    easing.damp3(state.camera.position, [camX, camY, camZ], 0.018, delta)

    // 🔥 centre exact
    const lookX = Math.sin(angle) * radius
    const lookZ = Math.cos(angle) * radius
    const lookY = -t * spacing

    state.camera.lookAt(lookX, lookY, lookZ)
  })

  return null
}

/* =========================
   CARD
========================= */

function CardA({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)

  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)

  useFrame((state, delta) => {
    // 🔥 scale GLOBAL réduit (clé du problème)
    easing.damp3(ref.current.scale, hovered ? 0.9 : 0.75, 0.15, delta)

    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.4, 0.2, delta)
  })

  return (
    <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut} {...props}>
      {/* ❗ ON NE TOUCHE PAS AUX ARGS */}
      <bentPlaneGeometry args={[0.1, .9, .9, 20, 20]} />
    </Image>
  )
}
function CardB({ url, ...props }) {
  const ref = useRef()
  const materialRef = useRef()
  const scroll = useScroll()
  const lastScroll = useRef(0)

  const [hovered, hover] = useState(false)

  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)

  useFrame((state, delta) => {
    if (!ref.current) return

    const current = scroll.offset
    const diff = current - lastScroll.current
    lastScroll.current = current

    const intensity = THREE.MathUtils.clamp(diff * 20, -1, 1)

    // 🔥 shader uniform
    if (materialRef.current) {
      materialRef.current.uniforms.uShift.value = intensity
    }

    easing.damp3(ref.current.scale, hovered ? 0.9 : 0.75, 0.15, delta)

    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.4, 0.2, delta)
  })

  // 🔥 injection SAFE (UNE SEULE FOIS)
  useEffect(() => {
    if (!ref.current) return

    const mat = ref.current.material

    if (mat.userData.shaderInjected) return

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uShift = { value: 0 }

      // ✅ VERTEX
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        vec3 transformed = vec3(position);

        float wave = sin(uv.x * 3.1415926) * uShift;
        transformed.y += wave * 0.92;
        `
      )

      // ✅ FRAGMENT
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        vec2 uv = vUv;

        vec2 offset = vec2(uShift * 0.3, 0.0);

        float r = texture2D(map, uv + offset).r;
        float g = texture2D(map, uv).g;
        float b = texture2D(map, uv - offset).b;

        diffuseColor = vec4(r, g, b, diffuseColor.a);
        `
      )

      materialRef.current = shader
    }

    mat.userData.shaderInjected = true
    mat.needsUpdate = true // 🔥 TRÈS IMPORTANT
  }, [])

  return (
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 0.9, 0.9, 20, 20]} />
    </Image>
  )
}

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
`

const fragmentShader = `
  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;

  uniform float uRadius;
  uniform float uZoom;
  uniform float uShift;

  // ✅ COVER PRO (corrigé)
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

  // ✅ BORDER RADIUS
  float roundedBox(vec2 uv, float radius) {
    vec2 dist = abs(uv - 0.5) - 0.5 + radius;
    return length(max(dist, 0.0)) - radius;
  }

  void main() {
    vec2 uv = vUv;

    // zoom
    uv = (uv - 0.5) * uZoom + 0.5;

    // cover propre
    uv = coverUv(uv, uImageSize, uPlaneSize);
    uv = clamp(uv, 0.0, 1.0);

    // 🔥 chromatic aberration OPTIMISÉ (2 samples)
    vec2 offset = vec2(uShift * 0.13, 0.0);

    vec4 base = texture2D(uTexture, uv);
    vec4 shifted = texture2D(uTexture, uv + offset);

    vec3 colorRGB = vec3(shifted.r, base.g, base.b);
    vec4 color = vec4(colorRGB, base.a);

    // 🔥 BORDER RADIUS PRO (fwidth anti-alias)
    float dist = roundedBox(vUv, uRadius);
    float aa = fwidth(dist);
    float mask = 1.0 - smoothstep(0.0, aa, dist);

    color.a *= mask;

    if (color.a < 0.01) discard;

    gl_FragColor = color;
  }
`

 function SmartImage({
  url,
  scale = [1, 1, 1],
  radius = 0.13,
  zoom = 1.2,
  ...props
}) {
  const mesh = useRef()
  const material = useRef()
  const texture = useTexture(url)
  const scroll = useScroll()

  const [hovered, hover] = useState(false)
  const lastScroll = useRef(0)

  useFrame((state, delta) => {
    const current = scroll.offset
    const diff = current - lastScroll.current
    lastScroll.current = current

    const intensity = THREE.MathUtils.clamp(diff * 20, -1, 1)

    if (material.current) {

      // 🔥 FIX IMPORTANT
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

function SmartVideo({
  url,
  scale = [1, 1, 1],
  radius = 0.13,
  zoom = 1.2,
  ...props
}) {
  const mesh = useRef()
  const material = useRef()
  const scroll = useScroll()
  const [hovered, hover] = useState(false)
  const lastScroll = useRef(0)

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
    const current = scroll.offset
    const diff = current - lastScroll.current
    lastScroll.current = current

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