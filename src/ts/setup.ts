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

  const topage1 = document.querySelector('#topage1') as HTMLDivElement
  const topage2 = document.querySelector('#topage2') as HTMLDivElement
  const topage3 = document.querySelector('#topage3') as HTMLDivElement

  const mouseContainer = document.querySelector(
    '.mouse__container'
  ) as HTMLDivElement

  const pagerIndicator = document.querySelector(
    '.pager__indicator'
  ) as HTMLDivElement

  window.setTimeout(() => {
    logo.init(logoContainer)
    logo.start(() => {
      scrolltimeline.addCallback(
        (value, value1) => {
          logo.setFrame(value)
          if (value1 > 0.1) {
            mouseContainer.classList.add('fade-out')
          } else {
            mouseContainer.classList.remove('fade-out')
          }
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

  scrolltimeline.addCallback(
    (value) => {
      pagerIndicator.style.left = `${value}px`
    },
    {
      start: 0,
      end: 1800,
      from: 5,
      to: 135,
    }
  )

  // topage1.addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(0)
  // })
  // topage2.addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(900)
  // })
  // topage3.addEventListener('click', () => {
  //   scrolltimeline.setScrollValue(1800)
  // })
  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(900)
  })

  scrolltimeline.start()
}
