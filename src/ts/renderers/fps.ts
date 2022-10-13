let fps = 0.0
let lastTime = Date.now()

const update = () => {
  const now = Date.now()
  fps = 1000 / (now - lastTime)
  lastTime = now
  console.log(fps)
  requestAnimationFrame(update)
}

export const getFps = () => {
  return fps
}

update()
