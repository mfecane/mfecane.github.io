interface IScrollerElement {
  el: HTMLDivElement
  pos: number
}

export class ScrollerGroup {
  root: HTMLDivElement
  elements: IScrollerElement[]
  maxWidth: number

  constructor(selector: string) {
    this.root = document.querySelector(selector)
    this.maxWidth = this.root.clientWidth - window.innerWidth
    const arr = Array.from(this.root.children) as HTMLDivElement[]
    let pos = 0
    this.elements = arr.map((el) => {
      if (pos > this.maxWidth) pos = this.maxWidth
      const item = {
        el,
        pos,
      }
      pos += el.clientWidth
      return item
    })
  }

  getElementPos(selector: string): number {
    const el = this.elements.find((el) => el.el.classList.contains(selector))
    return el?.pos || 0
  }

  getPoints(): number[] {
    return this.elements.map((el) => el.pos)
  }
}
