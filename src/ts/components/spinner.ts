import 'css/components/spinner.scss'

export class Spinner {
  root: HTMLDivElement | null = null

  constructor(selector: string) {
    this.root = document.querySelector(selector)
    if (!this.root) throw new Error('No root element present')

    for (let i = 0; i < 5; ++i) {
      for (let j = 0; j < 5; ++j) {
        if ((i === 0 || i === 4) && (j === 0 || j === 4)) {
          continue
        }

        if (Math.random() < 0.2) {
          continue
        }

        const div = document.createElement('div')
        div.classList.add('spinner-child')
        div.style.top = `${20 * i}%`
        div.style.left = `${20 * j}%`
        div.style.animationDelay = `${-1600 * Math.random()}ms`
        div.style.animationDuration = `${800 + 800 * Math.random()}ms`
        this.root.appendChild(div)
      }
    }
  }

  destroy(): void {
    if (this.root) this.root.innerHTML = ''
  }
}
