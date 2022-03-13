import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import diffuseTextureSource from 'assets/img/avatar-tx.png'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'

// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
// import { UnrealBloomPass } from 'ts/three/TransparentBackgroundFixedUnrealBloomPass'

// import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass'

import { mapclamp } from 'ts/lib/lib'

let scene
let camera
let glb
let renderer
let domElement
let object
let light
let composer
let glitchPass

const width = 800
const height = 1200
const aspect = width / height

export const initScene = (width) => {
  scene = new THREE.Scene()

  const factor = 3
  const height = width / aspect

  camera = new THREE.OrthographicCamera(
    -factor,
    factor,
    -factor / aspect - 0.6,
    factor / aspect - 0.6,
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
      alphaTest: 0.6,
    })

    material.alphaTest

    object.material = material

    light = new THREE.AmbientLight(0xffffff) // soft white light
    scene.add(light)

    composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const effectFilmBW = new FilmPass(0.3, 1, 2048, false)
    composer.addPass(effectFilmBW)

    animate()

    return domElement
  })
}

export const setCameraOffset = (val1, val2) => {
  object.rotation.y = val1
  object.rotation.x = val2
}

export const setLightColor = (value) => {
  const val = mapclamp(value, 0, 1, 255, 0)
  const color = `rgb(${Math.floor(val)}, ${Math.floor(val)}, ${Math.floor(
    val
  )})`
  light.color = new THREE.Color(color)
}

export const setGlitchPassState = (value) => {
  const randomCheck = Math.random() < 0.3
  if (value && randomCheck) {
    glitchPass = new GlitchPass()
    composer.addPass(glitchPass)
    console.log('pass added')
  } else {
    composer.removePass(glitchPass)
    console.log('pass removed')
  }
}

function animate() {
  composer.render()
  requestAnimationFrame(animate)
}
