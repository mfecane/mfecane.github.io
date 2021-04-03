interface Point {
  x: number
  y: number
}

const mouse: Point = {
  x: null,
  y: null,
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x
  mouse.y = e.y
  // console.log(`mouse: ${mouse.x}, ${mouse.y}`);
})

export default function (): Point {
  return mouse
}
