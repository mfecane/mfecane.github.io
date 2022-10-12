import { easeOutCubic } from 'ts/lib/easing-functions'

const fadeScaleIn = (el: HTMLElement, value: number) => {
  const val = (0.9 + value * 0.1) * 100
  el.style.transform = `scaleY(${val}%)`
  const val1 = easeOutCubic(value)
  el.style.opacity = `${val1}`
}

const fadeIn = (el: HTMLElement, value: number) => {
  const val1 = easeOutCubic(value)
  el.style.opacity = `${val1}`
}

const fadeSlideIn = (el: HTMLElement, value: number) => {
  const val1 = easeOutCubic(value)
  const val = (1 - val1) * 20
  el.style.transform = `translateX(${val}%)`
  el.style.opacity = `${val1}`
}

export default {
  fadeScaleIn,
  fadeIn,
  fadeSlideIn,
}
