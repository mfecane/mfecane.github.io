import { throttle } from 'lodash'

export class WorksItems {
  root: HTMLDivElement
  items: HTMLDivElement[]
  offset = 400
  activeIndex = 0

  constructor(selector: string) {
    this.root = document.querySelector(selector)
    this.items = Array.from(this.root.children) as HTMLDivElement[]

    this.calculateWidth()
    this.update = throttle(this.update.bind(this), 200)
  }

  calculateWidth(): void {
    let width = this.items.reduce((acc, cur) => {
      return acc + cur.clientWidth
    }, 0)
    width += 650 - 400
    this.root.style.width = `${width}px`
  }

  update(): void {
    this.activeIndex = -1

    const rect = this.root.getBoundingClientRect()
    rect.left // -1000
    const avgWidth = rect.width / this.items.length // 3000 / 5 = 600
    // rect.left + avgWidth * x > window.innerWidth / 2
    this.activeIndex = Math.floor(
      (window.innerWidth / 2 - rect.left) / avgWidth
    )

    // algo one
    // let distance = 400
    // this.items.forEach((el, index) => {
    //   const rect = el.getBoundingClientRect()
    //   const pen = !el.classList.contains('active') ? -80 : 0
    //   const currentDistance =
    //     Math.abs(rect.left + rect.width / 2 - window.innerWidth * 0.5) + pen
    //   console.log('currentDistance', currentDistance)
    //   if (currentDistance < distance) {
    //     distance = currentDistance
    //     this.activeIndex = index
    //   }
    // })

    this.items.forEach((el, index) => {
      el.classList.toggle('active', index === this.activeIndex)
    })
  }
}
