import Shader, { Arguments } from 'ts/webgl/shader'

import vertSource from 'shaders/square.vert?raw'
import fragSource from 'shaders/cubes.frag?raw'

import TextureCube from 'ts/webgl/texture-cube'
import Texture from 'ts/webgl/texture'

import posX01 from 'assets/peppermint_powerplant/posx.png'
import negX01 from 'assets/peppermint_powerplant/negx.png'
import posY01 from 'assets/peppermint_powerplant/posy.png'
import negY01 from 'assets/peppermint_powerplant/negy.png'
import posZ01 from 'assets/peppermint_powerplant/posz.png'
import negZ01 from 'assets/peppermint_powerplant/negz.png'

import texSrc from 'assets/img/colors.png'

export default class Renderer {
  width = 0
  height = 0
  vertexSource = ''
  fragmentSource = ''
  readonly root: HTMLDivElement
  readonly gl: WebGL2RenderingContext
  readonly canvas: HTMLCanvasElement
  proj: number[] = []
  animId = 0
  ready = false
  onLoad = () => {}
  downScaleFactor = 1

  texture: Texture = null
  textureCube: TextureCube = null

  startTime = Date.now()
  time = this.startTime

  fpsHistory: number[] = []
  fps = 0.0
  fpsTime = Date.now()

  mainShader: Shader

  parameters = {}

  constructor(root: HTMLDivElement, onLoad = () => {}) {
    this.root = root
    this.canvas = document.createElement(`canvas`)
    this.root.appendChild(this.canvas)
    this.canvas.id = 'canvas'

    this.gl = this.canvas.getContext('webgl2')!

    this.setCanvasSize()

    window.addEventListener('resize', this.setCanvasSize.bind(this))
    this.onLoad = onLoad
  }

  async init(): Promise<void> {
    this.vertexSource = vertSource
    this.fragmentSource = fragSource

    this.mainShader = new Shader(this.gl)
    this.mainShader.createProgram(this.vertexSource, this.fragmentSource)

    this.createSquarePositions()

    this.mainShader.useProgram()
    this.mainShader.setPositions('aPos')

    this.addUniforms()

    this.texture = new Texture(this.gl)
    await this.texture.fromUrl(texSrc)

    this.textureCube = new TextureCube(this.gl)
    await this.textureCube.fromSources({
      posX: posX01,
      negX: negX01,
      posY: posY01,
      negY: negY01,
      posZ: posZ01,
      negZ: negZ01,
    })
  }

  addUniforms(): void {
    this.mainShader.addUniform('u_MVP', '4fv')
    this.mainShader.addUniform('u_time', '1f')
    this.mainShader.addUniform('u_mouse', '2f')
    this.mainShader.addUniform('u_Sampler', '1i')
    this.mainShader.addUniform('u_Sampler2', '1i')
    this.mainShader.addUniform('u_anim', '1f')
  }

  createSquarePositions(): void {
    const vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)

    // prettier-ignore
    const positions = [
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0,
        -1.0,  1.0
      ];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    )

    const indexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    // prettier-ignore
    const indices = [
        0, 1, 2,
        2, 3, 0
      ];

    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW
    )
  }

  destroy(): void {
    this.root.removeChild(this.canvas)
    window.removeEventListener('resize', this.setCanvasSize.bind(this))
    cancelAnimationFrame(this.animId)
  }

  renderFrame(): void {
    this.proj = this.calculateMVP(this.width, this.height)

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture)
    this.mainShader.setUniform('u_Sampler', 0)

    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textureCube.texture)
    this.mainShader.setUniform('u_Sampler2', 1)

    this.setUniforms()

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
    if (!this.ready) {
      this.onLoad()
      this.ready = true
    }
  }

  setUniforms(): void {
    this.time = (Date.now() - this.startTime) / 1000

    this.mainShader.setUniform('u_MVP', this.proj)
    this.mainShader.setUniform('u_time', this.time)
  }

  setUniform(...args: Arguments): void {
    this.mainShader.setUniform(...args)
  }

  update(): void {
    this.renderFrame()
    this.updateFps()
  }

  setCanvasSize(): void {
    this.width = this.root.clientWidth
    this.height = this.root.clientHeight

    this.canvas.width = this.width / this.downScaleFactor
    this.canvas.height = this.height / this.downScaleFactor
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.gl.viewport(
      0,
      0,
      this.width / this.downScaleFactor,
      this.height / this.downScaleFactor
    )
  }

  calculateMVP(width: number, height: number): number[] {
    const l = -width / height // left
    const r = width / height // right

    const b = -1.0 // bottom
    const t = 1.0 // top

    const n = -1.0 // near
    const f = 1.0 // far

    // prettier-ignore
    return [
      2 / (r - l),            0,            0,  -(r + l) / (r - l),
                0,  2 / (t - b),            0,  -(t + b) / (t - b),
                0,            0,  2 / (f - n),  -(f + n) / (f - n),
                0,            0,            0,                   1,
    ];
  }

  updateFps(): void {
    // TODO dynamic ITERATIONS
    const now = Date.now()
    if (now === this.fpsTime) {
      return
    }
    this.fpsHistory.push(1000.0 / (now - this.fpsTime))
    this.fpsTime = now
    if (this.fpsHistory.length < 10) {
      return
    }
    this.fps =
      Math.floor(
        this.fpsHistory.reduce((acc, cur) => {
          return (acc + cur) / 2
        }) * 100
      ) / 100
    this.fpsHistory.unshift()
  }
}
