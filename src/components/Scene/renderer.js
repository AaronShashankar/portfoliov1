import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export function createBackdrop(host, onFailure) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  host.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(43, 1, .1, 80)
  camera.position.z = 9
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, .04)
  scene.environment = environment.texture
  room.dispose()
  pmrem.dispose()

  const sculpture = new THREE.Group()
  scene.add(sculpture)
  const material = new THREE.MeshPhysicalMaterial({ color: '#5489dc', metalness: .9, roughness: .2, clearcoat: 1, clearcoatRoughness: .14, envMapIntensity: 1.8 })
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, .34, 180, 28, 2, 3), material)
  knot.rotation.set(.4, -.6, .1)
  sculpture.add(knot)
  const ringMaterial = new THREE.MeshBasicMaterial({ color: '#7db8ff', transparent: true, opacity: .5 })
  const rings = [0, 1].map(index => {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(2.02 + index * .25, .009, 8, 160), ringMaterial)
    mesh.rotation.set(1.1 + index * .5, .3, index * .8)
    sculpture.add(mesh)
    return mesh
  })
  const satellite = new THREE.Mesh(new THREE.IcosahedronGeometry(.14, 1), new THREE.MeshStandardMaterial({ color: '#ffac6b', metalness: .55, roughness: .25 }))
  sculpture.add(satellite)
  scene.add(new THREE.HemisphereLight('#dbeaff', '#263758', 2.4))
  const key = new THREE.DirectionalLight('#d8e8ff', 5)
  key.position.set(3, 5, 5); scene.add(key)
  const rim = new THREE.PointLight('#5c78ff', 40, 20)
  rim.position.set(-4, 0, 3); scene.add(rim)
  const warm = new THREE.PointLight('#ff9455', 25, 15)
  warm.position.set(4, -3, 2); scene.add(warm)

  const count = 130
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - .5) * 16
    positions[i * 3 + 1] = (Math.random() - .5) * 14
    positions[i * 3 + 2] = -2 - Math.random() * 8
  }
  const particlesGeometry = new THREE.BufferGeometry()
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particlesMaterial = new THREE.PointsMaterial({ color: '#85baff', size: .025, transparent: true, opacity: .65, depthWrite: false })
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  let width = 1, height = 1, frame = 0, last = 0, elapsed = 0
  let motion = true, disposed = false, failed = false, theme = 'dark'
  let anchorX = .5, anchorY = 0, anchorHeight = 0, scroll = window.scrollY
  const mouse = { x: 0, y: 0 }
  const target = new THREE.Vector3()
  const measure = () => {
    if (disposed || failed) return
    width = window.innerWidth; height = window.innerHeight
    camera.aspect = width / height; camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 760 ? 1 : 1.5))
    renderer.setSize(width, height)
    const anchor = document.getElementById('scene-anchor')?.getBoundingClientRect()
    if (anchor) {
      anchorX = (anchor.left + anchor.width / 2) / width * 2 - 1
      anchorY = anchor.top + window.scrollY + anchor.height / 2
      anchorHeight = anchor.height
    }
    if (!motion) draw(0)
  }
  const draw = delta => {
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
    const beyondHero = Math.max(0, scroll - anchorY - anchorHeight * .3)
    const progress = Math.min(beyondHero / Math.max(height, 1), 1)
    const x = THREE.MathUtils.lerp(anchorX, Math.sin(scroll * .0005) * .5, progress)
    const anchoredY = 1 - (anchorY - scroll) / height * 2
    const y = THREE.MathUtils.lerp(anchoredY, .1, progress)
    target.set(x * viewHeight * camera.aspect / 2 + mouse.x * .16, y * viewHeight / 2 + mouse.y * .12, -progress * 1.5)
    const smoothing = delta ? 1 - Math.exp(-delta * 5) : 1
    sculpture.position.lerp(target, smoothing)
    const size = width < 760 ? .72 : 1
    sculpture.scale.setScalar(size * (1 - progress * .12))
    host.style.opacity = String(1 - progress * (theme === 'dark' ? .62 : .76))
    if (motion) {
      knot.rotation.y = elapsed * .2 + mouse.x * .16
      knot.rotation.x = .4 + Math.sin(elapsed * .3) * .23 + mouse.y * .12
      rings[0].rotation.z = elapsed * .12
      rings[1].rotation.y = elapsed * -.16
      particles.rotation.y = elapsed * .018
    }
    satellite.position.set(Math.cos(elapsed * .55) * 2.05, Math.sin(elapsed * .55) * .85, Math.sin(elapsed * .55) * 1.6)
    renderer.render(scene, camera)
  }
  const tick = now => {
    if (disposed || failed || !motion || document.hidden) { frame = 0; return }
    frame = requestAnimationFrame(tick)
    if (width < 760 && now - last < 32) return
    const delta = Math.min((now - last) / 1000 || 0, .05)
    last = now; elapsed += delta
    draw(delta)
  }
  const sync = () => {
    cancelAnimationFrame(frame); frame = 0; last = performance.now()
    if (disposed || failed || document.hidden) return
    draw(0)
    if (motion) frame = requestAnimationFrame(tick)
  }
  const onScroll = () => { scroll = window.scrollY; if (!motion) draw(0) }
  const onPointer = event => {
    if (!motion || event.pointerType === 'touch') return
    mouse.x = event.clientX / width * 2 - 1
    mouse.y = -(event.clientY / height * 2 - 1)
  }
  const lost = event => { event.preventDefault(); failed = true; cancelAnimationFrame(frame); onFailure() }
  renderer.domElement.addEventListener('webglcontextlost', lost)
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('visibilitychange', sync)
  measure()
  document.fonts?.ready.then(() => { if (!disposed && !failed) measure() })
  return {
    update(nextTheme, enabled) {
      theme = nextTheme; motion = enabled
      material.color.set(theme === 'dark' ? '#5489dc' : '#2762c5')
      material.roughness = theme === 'dark' ? .2 : .27
      ringMaterial.color.set(theme === 'dark' ? '#8cc6ff' : '#235abb')
      particlesMaterial.color.set(theme === 'dark' ? '#85baff' : '#3764b0')
      sync()
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure); window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer); document.removeEventListener('visibilitychange', sync)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      const geometries = new Set(), materials = new Set()
      scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material) })
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(item => item.dispose())
      environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove()
    },
  }
}
