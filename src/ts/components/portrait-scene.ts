import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import diffuseTextureSource from 'assets/img/avatar-tx.png'

let scene
let camera
let glb
let renderer
let domElement
let object

const width = 800
const height = 1200

let cameraShift = 0

export const initScene = () => {
  scene = new THREE.Scene()

  const factor = 3

  camera = new THREE.OrthographicCamera(
    -factor,
    factor,
    (-factor / width) * height,
    (factor / width) * height,
    -factor,
    factor
  )

  // camera.position.x = cameraShift
  // camera.position.y = 0
  // camera.position.z = 22

  // camera.lookAt(0.0, 0.0, 0.0)

  const loader = new GLTFLoader()

  const draco = new DRACOLoader()
  draco.setDecoderConfig({ type: 'js' })
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  loader.setDRACOLoader(draco)
  var t = 0

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  domElement = renderer.domElement

  return new Promise((resolve, reject) => {
    loader.load(
      // resource URL
      'assets/scenes/scene.glb',
      // called when the resource is loaded
      (glb) => {
        resolve(glb)
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      // called when loading has errors
      function (error) {
        console.log('An error happened')
      }
    )
  }).then((res) => {
    glb = res.scene
    object = glb.children[0]
    scene.add(object)

    const diffuseTexture = new THREE.TextureLoader().load(diffuseTextureSource)
    const material = new THREE.MeshStandardMaterial({
      map: diffuseTexture,
      color: 0xffffff,
      flatShading: true,
      "alphaTest": 0.6,
    })

    material.alphaTest

    object.material = material

    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );

    animate()

    return domElement
  })
}

export const setCameraOffset = (value) => {
  cameraShift = value
  object.rotation.y = value
}

function animate() {
  renderer.render(scene, camera)
  // camera.position.x = cameraShift
  // camera.lookAt(0.0, 0.0, 0.0)
  requestAnimationFrame(animate)
}
