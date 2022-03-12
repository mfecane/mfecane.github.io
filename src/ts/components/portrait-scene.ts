import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import diffuseTextureSource from 'assets/img/avatar-tx.png'

import { mapclamp } from 'ts/lib/lib'

let scene
let camera
let glb
let renderer
let domElement
let object
let light

const width = 800
const height = 1200

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

  const loader = new GLTFLoader()

  const draco = new DRACOLoader()
  draco.setDecoderConfig({ type: 'js' })
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  loader.setDRACOLoader(draco)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  domElement = renderer.domElement

  return new Promise((resolve, reject) => {
    loader.load(
      'assets/scenes/scene.glb',
      (glb) => {
        resolve(glb)
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      function (error) {
        throw new Error('Asset loading error: ' + error)
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

    light = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( light );

    animate()

    return domElement
  })
}

export const setCameraOffset = (val1, val2) => {
  object.rotation.y = val1
  object.rotation.x = val2
}

export const setLightColor = (value) => {
  const val = mapclamp(value, 0, 1, 255, 0);
  const color = `rgb(${Math.floor(val)}, ${Math.floor(val)}, ${Math.floor(val)})`
  light.color = new THREE.Color(color)
}

function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
