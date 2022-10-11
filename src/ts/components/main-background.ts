import scroller2 from 'ts/animation/scroller'
import Renderer from 'ts/renderers/renderer'

let renderer: Renderer
let mouseX = 0
let mouseY = 0

const update = function () {
  if (!renderer) {
    return
  }

  const scrollValue = scroller2.getScrollValue()
  renderer.setUniform('u_anim', scrollValue / 1800)
  renderer.setUniform(
    'u_mouse',
    ((mouseX - window.innerWidth / 2) / window.innerHeight) * 2,
    ((window.innerHeight / 2 - mouseY) / window.innerHeight) * 2
  )
  renderer.update()

  setTimeout(() => {
    requestAnimationFrame(update)
  }, 5)
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.x
  mouseY = e.y
}

const init = async function (canvasContainer: HTMLDivElement): Promise<void> {
  return new Promise((resolve) => {
    renderer = new Renderer(canvasContainer, resolve)
    renderer
      .init()
      .then(update)
      .then(() => {
        window.addEventListener('mousemove', handleMouseMove)
      })
  })
}

export default {
  init,
}
