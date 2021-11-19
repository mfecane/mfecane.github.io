import { floor } from 'lodash'
import {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  rgbToHsl,
  blendHslColors,
  blendHslColorsArr,
} from 'ts/lib/color'

const mapArrValue = function (arr, val, max) {
  const interval = max / (arr.length - 1)
  const i = Math.floor(val / interval)
  const w = (val % interval) / interval
  const smoothstep = 3 * w ** 2 - 2 * w ** 3
  const ret = arr[i] * (1 - smoothstep) + arr[i + 1] * smoothstep
  return ret
}

// rgbToHsl(...hexToRgb('ff0d7b')),
// rgbToHsl(...hexToRgb('ff0000')),
// rgbToHsl(...hexToRgb('ff9d00')),

export default class AnimColor {
  colorsConfig = [
    rgbToHsl(...hexToRgb('ff9d00')),
    rgbToHsl(...hexToRgb('ff0d7b')),
    rgbToHsl(...hexToRgb('ff9d00')),
  ]
  colors = []
  start = Date.now()
  time = 0
  elementsBackgroundColor = null
  elementsColor = null
  elementsBorderColor = null
  elementsHoverColor = null
  duration = 8000

  init(): void {
    this.elementsBackgroundColor = document.querySelectorAll(
      '.anim-background-color'
    )
    this.elementsColor = document.querySelectorAll('.anim-color')
    this.elementsBorderColor = document.querySelectorAll('.anim-border-color')
    this.colors = this.buildColors()
  }

  buildColors() { // TODO make async
    const max = 512
    const arr = []
  
    for (let i = 0; i < max; ++i) {
      const color = blendHslColorsArr(this.colorsConfig, i, max)
      arr.push(hslToRgb(...color))
    }
  
    return arr
  }

  handleTime(): void {
    this.time = Date.now() - this.start
    if (this.time > this.duration) {
      this.time = 0
      this.start = Date.now()
    }
  }

  getColor(shift: number): string {
    const val = (this.duration + this.time + shift) % this.duration
    //  const val = (this.duration + this.time) % this.duration
    const index = Math.floor(val / this.duration * this.colors.length);
    return this.colors[index].join(',')
  }

  setElementColor(el, prop: string): void {
    const offset = -el.offsetLeft * 2 + el.offsetTop * 5
    const color = this.getColor(offset)
    el.style.transition = 'none'
    el.style[prop] = `rgba(${color}, 1)`
    el.style.transition = ''
    el.offsetHeight
  }

  handleLinks(): void {
    this.elementsHoverColor = document.querySelectorAll(
      '.anim-hover-color:hover'
    )
    this.elementsHoverColor.forEach((el) => {
      this.setElementColor(el, 'color')
    })

    this.elementsHoverColor = document.querySelectorAll(
      '.anim-hover-color:not(:hover)'
    )
    this.elementsHoverColor.forEach((el) => {
      el.style.color = ''
    })
  }

  update(): void {
    this.handleTime()

    this.handleLinks()

    this.elementsBackgroundColor.forEach((el) => {
      this.setElementColor(el, 'backgroundColor')
    })

    this.elementsColor.forEach((el) => {
      this.setElementColor(el, 'color')
    })

    this.elementsBorderColor.forEach((el) => {
      this.setElementColor(el, 'borderColor')
    })
  }

  animate(): void {
    this.update();
    
    window.requestAnimationFrame(() => {
      this.animate()
    })
  }
}
