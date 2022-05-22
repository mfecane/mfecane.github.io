import Shader, { Arguments } from 'ts/webgl/shader'

import vertSource from 'shaders/square.vert'
import fragSource from 'shaders/cubes.frag'

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
  root: HTMLDivElement = null
  gl: WebGL2RenderingContext = null
  canvas: HTMLCanvasElement = null
  proj: number[] = null
  animId: number = null

  texture: Texture = null
  textureCube: TextureCube = null

  startTime = Date.now()
  time = this.startTime

  fpsHistory: number[] = []
  fps = 0.0
  fpsTime = Date.now()

  mainShader: Shader

  parameters = {}

  constructor(root: HTMLDivElement) {
    this.root = root
    this.canvas = document.createElement(`canvas`)
    this.root.appendChild(this.canvas)
    this.canvas.id = 'canvas'

    this.gl = this.canvas.getContext('webgl2')

    this.setCanvasSize()

    window.addEventListener('resize', this.setCanvasSize.bind(this))
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

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.gl.viewport(0, 0, this.width, this.height)
  }

  calculateMVP(width: number, height: number): number[] {
    const left = -width / height
    const right = width / height

    const bottom = -1.0
    const top = 1.0

    const near = -1.0
    const far = 1.0

    // prettier-ignore
    return [
      2 / (right - left),                   0,                 0,  -(right + left) / (right - left),
                       0,  2 / (top - bottom),                 0,  -(top + bottom) / (top - bottom),
                       0,                   0,  2 / (far - near),    -(far + near) /   (far - near),
                       0,                   0,                 0,                                 1,
    ];
  }

  updateFps(): void {
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
