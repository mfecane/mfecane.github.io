import ScrollTimeline from 'ts/animation/scroll-timeline'
import MainBgAnimation from 'ts/components/main-background'
import * as logo from 'ts/components/logo'

window.onload = () => {
  const scrollContainer = document.querySelector(
    '.scroll-container'
  ) as HTMLDivElement

  const mainBgCanvasContainer = document.querySelector(
    '#main-bg-canvas-container'
  ) as HTMLDivElement

  const logoContainer = document.querySelector(
    '#logo-container'
  ) as HTMLDivElement

  window.setTimeout(() => {
    logo.init(logoContainer)
    logo.start(() => {
      debugger
      scrolltimeline.addCallback(
        (value: number) => {
          logo.setFrame(value)
        },
        {
          start: 0,
          end: 300,
          from: 1,
          to: 0,
        }
      )
    })
  }, 400)

  const mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)

  mainBgAnimation.start()

  const options = {
    scrollStep: 80,
    maxScrollValue: 1800,
    snaps: [
      { value: 0, snapOver: 300 },
      { value: 900, snapUnder: 600, snapOver: 200 },
    ],
  }

  const scrolltimeline = new ScrollTimeline(options)

  scrolltimeline.addCallback(
    (value) => {
      scrollContainer.style.transform = `translateX(${value}vw)`
    },
    {
      start: 0,
      end: 1800,
      from: 0,
      to: -200,
    }
  )

  scrolltimeline.addCallback(
    (value) => {
      mainBgCanvasContainer.style.transform = `translateX(${value}vw)`
    },
    {
      start: 0,
      end: 1600,
      from: 0,
      to: -101,
    }
  )

  scrolltimeline.start()
}
