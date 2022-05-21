export type Arguments = [
  name: string,
  value: number | Float32List,
  value2?: number
]

type UniformType = '4fv' | '1f' | '2f' | '1i'

interface Uniform {
  name: string
  type: UniformType
  uniform: WebGLUniformLocation
}

export default class Shader {
  gl: WebGL2RenderingContext
  uniforms: Uniform[]
  positionLocation: number | null
  program: WebGLProgram

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.uniforms = []
    this.positionLocation = null
  }

  createProgram(vertexSource: string, fragmentSource: string): void {
    const gl = this.gl
    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertShader, vertexSource)
    gl.shaderSource(fragShader, fragmentSource)

    gl.compileShader(vertShader)
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      alert('Error compiling vertex shader')
      console.log(gl.getShaderInfoLog(vertShader))
    }

    gl.compileShader(fragShader)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      alert('Error compiling fragment shader')
      console.log(gl.getShaderInfoLog(fragShader))
    }

    const program = gl.createProgram()
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)

    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      console.log('Error validating program ', gl.getProgramInfoLog(program))
      return
    }
    this.program = program
  }

  useProgram(): void {
    this.gl.useProgram(this.program)
  }

  addUniform(name: string, type: UniformType): void {
    const uniform = this.gl.getUniformLocation(this.program, name)
    const u = {
      name,
      type,
      uniform,
    }
    this.uniforms.push(u)
  }

  setUniform(...args: Arguments): void {
    const name = args[0]
    const u = this.uniforms.find((u) => u.name === name)
    if (u) {
      switch (u.type) {
        case '4fv':
          this.gl.uniformMatrix4fv(u.uniform, false, args[1] as Float32List)
          return
        case '1f':
          this.gl.uniform1f(u.uniform, args[1] as number)
          return
        case '2f':
          this.gl.uniform2f(u.uniform, args[1] as number, args[2] as number)
          return
        case '1i':
          this.gl.uniform1i(u.uniform, args[1] as number)
          return
      }
    }
  }

  setPositions(name: string): void {
    this.positionLocation = this.gl.getAttribLocation(this.program, name)
    this.gl.enableVertexAttribArray(this.positionLocation)
    this.gl.vertexAttribPointer(
      this.positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    )
  }
}
