import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import styles from './Scene.module.css'
import SceneFallback from './SceneFallback'

// Check WebGL support safely
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

// Custom Vertex Shader for the Displaced Icosahedron
const vertexShader = `
  uniform float uTime;
  uniform float uStrength;
  uniform float uPulse;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vDisplacement;

  // Layered sine wave noise
  float getNoise(vec3 p, float t) {
    float n = 0.0;
    n += sin(p.x * 2.2 + t * 1.1) * cos(p.y * 2.4 + t * 0.9) * sin(p.z * 1.9 + t * 1.2);
    n += 0.5 * sin(p.x * 4.4 - t * 1.6) * cos(p.z * 3.7 + t * 1.4);
    n += 0.25 * sin(p.y * 7.8 + t * 2.2) * cos(p.x * 7.2 - t * 1.9);
    return n;
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);

    float noise = getNoise(position, uTime * 0.85);
    float totalStrength = uStrength + (uPulse * 0.45);
    vDisplacement = noise;

    vec3 displacedPosition = position + (normal * (noise * totalStrength));
    vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

// Custom Fragment Shader with flat normals (dFdx/dFdy), lighting, rim and hue shifting
const fragmentShader = `
  #extension GL_OES_standard_derivatives : enable

  uniform float uHue;
  uniform vec3 uColorPink;
  uniform vec3 uColorCyan;
  uniform vec3 uColorViolet;
  uniform vec3 uColorYellow;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    // Faceted normals using screen derivatives for crystal/origami look
    vec3 fdx = dFdx(vWorldPosition);
    vec3 fdy = dFdy(vWorldPosition);
    vec3 flatNormal = normalize(cross(fdx, fdy));

    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 lightDir1 = normalize(vec3(1.2, 1.8, 1.5));
    vec3 lightDir2 = normalize(vec3(-1.2, -1.0, -0.6));

    float diff1 = max(dot(flatNormal, lightDir1), 0.0);
    float diff2 = max(dot(flatNormal, lightDir2), 0.0) * 0.35;
    float light = clamp(diff1 + diff2 + 0.16, 0.0, 1.0);

    // Rim / Fresnel term
    float rim = 1.0 - max(dot(viewDir, flatNormal), 0.0);
    rim = pow(rim, 2.6);

    // Color mixing across hue cycle
    float t = fract(vDisplacement * 0.45 + 0.5 + uHue);
    vec3 baseColor;
    if (t < 0.333) {
      baseColor = mix(uColorPink, uColorCyan, t * 3.0);
    } else if (t < 0.666) {
      baseColor = mix(uColorCyan, uColorViolet, (t - 0.333) * 3.0);
    } else {
      baseColor = mix(uColorViolet, uColorPink, (t - 0.666) * 3.0);
    }

    vec3 color = baseColor * light;
    color += uColorCyan * (rim * 0.65);
    
    // Subtle specular flash
    vec3 halfVec = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(flatNormal, halfVec), 0.0), 32.0);
    color += uColorYellow * (spec * 0.45);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Wireframe fragment shader
const wireframeFragmentShader = `
  uniform vec3 uColorCyan;
  uniform vec3 uColorPink;
  uniform float uHue;
  varying float vDisplacement;

  void main() {
    vec3 c = mix(uColorCyan, uColorPink, fract(vDisplacement + uHue));
    gl_FragColor = vec4(c, 0.18);
  }
`

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Main 3D Shape + Torus Rings + Wireframe + Particles
 */
function CentralSculpture({ mouseRef, scrollRef, clickPulseRef }) {
  const meshRef = useRef(null)
  const wireframeRef = useRef(null)
  const torus1Ref = useRef(null)
  const torus2Ref = useRef(null)
  const groupRef = useRef(null)

  // Colors based on design tokens:
  // Pink #FF5C8A -> (1.0, 0.36, 0.54)
  // Cyan #5CE1E6 -> (0.36, 0.88, 0.90)
  // Violet #7B61FF -> (0.48, 0.38, 1.0)
  // Yellow #FFC857 -> (1.0, 0.78, 0.34)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: 0.18 },
      uPulse: { value: 0 },
      uHue: { value: 0 },
      uColorPink: { value: new THREE.Color('#FF5C8A') },
      uColorCyan: { value: new THREE.Color('#5CE1E6') },
      uColorViolet: { value: new THREE.Color('#7B61FF') },
      uColorYellow: { value: new THREE.Color('#FFC857') },
    }),
    []
  )

  const wireframeUniforms = useMemo(
    () => ({
      uTime: uniforms.uTime,
      uStrength: uniforms.uStrength,
      uPulse: uniforms.uPulse,
      uHue: uniforms.uHue,
      uColorCyan: uniforms.uColorCyan,
      uColorPink: uniforms.uColorPink,
    }),
    [uniforms]
  )

  useFrame((state, delta) => {
    // Advance uniform time
    const time = state.clock.getElapsedTime()
    uniforms.uTime.value = time

    // Decay click pulse smoothly
    clickPulseRef.current *= 0.94
    if (clickPulseRef.current < 0.001) clickPulseRef.current = 0
    uniforms.uPulse.value = clickPulseRef.current

    // Determine viewport mode (mobile vs desktop)
    const isMobile = state.size.width < 768

    // Section Keyframes for scroll choreography:
    // [hero: 0.0, work: 0.25, about: 0.5, skills: 0.75, contact: 1.0]
    const keyframes = [
      {
        pos: 0.0,
        x: isMobile ? 0.1 : 1.35,
        y: -0.1,
        z: 0.1,
        scale: isMobile ? 0.95 : 1.35,
        disp: 0.18,
        hue: 0.0,
        spin: 0.22,
      },
      {
        pos: 0.25,
        x: isMobile ? -0.1 : -0.9,
        y: -0.15,
        z: -1.7,
        scale: isMobile ? 0.65 : 0.75,
        disp: 0.12,
        hue: 0.35,
        spin: 0.14,
      },
      {
        pos: 0.5,
        x: isMobile ? 0.1 : 1.25,
        y: 0.05,
        z: -0.4,
        scale: isMobile ? 0.9 : 1.15,
        disp: 0.55, // Very wobbly in About section
        hue: 0.65,
        spin: 0.42,
      },
      {
        pos: 0.75,
        x: 0.0,
        y: 0.0,
        z: -0.9,
        scale: isMobile ? 0.7 : 0.85,
        disp: 0.15,
        hue: 0.85,
        spin: 0.18,
      },
      {
        pos: 1.0,
        x: 0.0,
        y: -0.2,
        z: 0.3,
        scale: isMobile ? 1.0 : 1.45,
        disp: 0.08, // Large and calm in Contact section
        hue: 1.0,
        spin: 0.08,
      },
    ]

    // Read smoothed scroll progress from ref
    const scrollP = scrollRef.current ? scrollRef.current.progress : 0

    // Interpolate keyframes with smoothstep
    let target = keyframes[0]
    for (let i = 0; i < keyframes.length - 1; i++) {
      const k1 = keyframes[i]
      const k2 = keyframes[i + 1]
      if (scrollP >= k1.pos && scrollP <= k2.pos) {
        const factor = smoothstep(k1.pos, k2.pos, scrollP)
        target = {
          x: lerp(k1.x, k2.x, factor),
          y: lerp(k1.y, k2.y, factor),
          z: lerp(k1.z, k2.z, factor),
          scale: lerp(k1.scale, k2.scale, factor),
          disp: lerp(k1.disp, k2.disp, factor),
          hue: lerp(k1.hue, k2.hue, factor),
          spin: lerp(k1.spin, k2.spin, factor),
        }
        break
      }
    }
    if (scrollP > 1.0) target = keyframes[keyframes.length - 1]

    // Apply uniforms
    uniforms.uStrength.value = target.disp
    uniforms.uHue.value = target.hue

    // Pointer Parallax
    const mouse = mouseRef.current || { targetX: 0, targetY: 0 }
    const parallaxX = mouse.targetX * 0.45
    const parallaxY = mouse.targetY * 0.35

    if (groupRef.current) {
      // Smoothly interpolate position and scale
      groupRef.current.position.x += (target.x + parallaxX - groupRef.current.position.x) * 0.08
      groupRef.current.position.y += (target.y + parallaxY - groupRef.current.position.y) * 0.08
      groupRef.current.position.z += (target.z - groupRef.current.position.z) * 0.08

      const currentScale = groupRef.current.scale.x
      const newScale = currentScale + (target.scale - currentScale) * 0.08
      groupRef.current.scale.set(newScale, newScale, newScale)

      // Dynamic rotation with spin speed and mouse tilt
      groupRef.current.rotation.y += delta * target.spin
      groupRef.current.rotation.x = mouse.targetY * 0.25 + Math.sin(time * 0.5) * 0.1
      groupRef.current.rotation.z = mouse.targetX * 0.15
    }

    // Torus Rings Animation
    if (torus1Ref.current) {
      torus1Ref.current.rotation.x = time * 0.45
      torus1Ref.current.rotation.y = time * 0.65
      torus1Ref.current.rotation.z = Math.sin(time * 0.3) * 0.5
    }

    if (torus2Ref.current) {
      torus2Ref.current.rotation.x = -time * 0.55 + 1.2
      torus2Ref.current.rotation.y = time * 0.35
      torus2Ref.current.rotation.z = Math.cos(time * 0.4) * 0.6
    }
  })

  return (
    <group ref={groupRef} position={[1.35, -0.1, 0.1]}>
      {/* Lower detail keeps the optional scene inexpensive on mobile. */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Second Wireframe Mesh sharing vertex displacement: low opacity */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.505, 4]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={wireframeFragmentShader}
          uniforms={wireframeUniforms}
          wireframe={true}
          transparent={true}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting Torus Ring 1 */}
      <mesh ref={torus1Ref}>
        <torusGeometry args={[2.3, 0.012, 16, 100]} />
        <meshBasicMaterial
          color="#5CE1E6"
          transparent={true}
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Torus Ring 2 */}
      <mesh ref={torus2Ref} rotation={[0.8, 0.4, 0]}>
        <torusGeometry args={[2.7, 0.009, 16, 100]} />
        <meshBasicMaterial
          color="#FF5C8A"
          transparent={true}
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/**
 * About 1,400 Floating Particles
 */
function FloatingParticles({ mouseRef }) {
  const pointsRef = useRef(null)
  const particleCount = 1400

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)

    const palette = [
      new THREE.Color('#5CE1E6'),
      new THREE.Color('#FF5C8A'),
      new THREE.Color('#7B61FF'),
      new THREE.Color('#EEEAFF'),
    ]

    for (let i = 0; i < particleCount; i++) {
      // Scatter in a spherical volume
      const radius = 5 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      const color = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }

    return [pos, col]
  }, [particleCount])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const mouse = mouseRef.current || { targetX: 0, targetY: 0 }
    
    // Slow drift rotation
    pointsRef.current.rotation.y += delta * 0.04
    pointsRef.current.rotation.x += delta * 0.02

    // Parallax sway
    pointsRef.current.position.x += (mouse.targetX * 0.3 - pointsRef.current.position.x) * 0.03
    pointsRef.current.position.y += (mouse.targetY * 0.2 - pointsRef.current.position.y) * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors={true}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Camera Parallax Rig
 */
function CameraRig({ mouseRef }) {
  useFrame((state) => {
    const mouse = mouseRef.current || { targetX: 0, targetY: 0 }
    state.camera.position.x += (mouse.targetX * 0.25 - state.camera.position.x) * 0.04
    state.camera.position.y += (mouse.targetY * 0.2 - state.camera.position.y) * 0.04
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

/**
 * Full-screen Background Scene wrapper
 */
export default function Scene({ mouseRef, scrollRef }) {
  const [hasWebGL, setHasWebGL] = useState(() => checkWebGLSupport())
  const [isTabVisible, setIsTabVisible] = useState(() => !document.hidden)
  const clickPulseRef = useRef(0)

  useEffect(() => {

    // Page Visibility API: pause render loop when tab is hidden
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])


  if (!hasWebGL) {
    return <SceneFallback />
  }

  return (
    <div
      id="canvas-container"
      className={styles.canvasContainer}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        fallback={<SceneFallback />}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => setHasWebGL(false), { once: true })
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'default',
        }}
        frameloop={isTabVisible ? 'always' : 'never'}
      >
        <Suspense fallback={null}>
          <CameraRig mouseRef={mouseRef} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <CentralSculpture
            mouseRef={mouseRef}
            scrollRef={scrollRef}
            clickPulseRef={clickPulseRef}
          />
          <FloatingParticles mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
