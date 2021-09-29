import ScrollTimeline from 'ts/animation/scroll-timeline'
import MainBgAnimation from 'ts/components/main-background'
import SvgPathAnimation from 'ts/components/svg-path-animation'
import SvgPathAnimation2 from 'ts/components/svg-path-animation2'

import mainLogo from 'assets/svg/svg-low.svg'
import shapesconfig from 'ts/svg/shapes-config'

import floralPage2Svg from 'assets/svg/second-page-floral2.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'

let logoContainer: HTMLDivElement
let scrolltimeline: ScrollTimeline
let mouseContainer: HTMLDivElement
let logo: SvgPathAnimation
let floralPage2Container: HTMLDivElement
let pagerIndicator: HTMLDivElement
let mainBgAnimation: MainBgAnimation
let scrollContainer: HTMLDivElement
let mainBgCanvasContainer: HTMLDivElement

const setUpMouseAnimation = () => {
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
}

const setUpMainLogoAnimation = () => {
  const config = {
    shapesconfig: shapesconfig2, 
    scale: .5
  }

  logo = new SvgPathAnimation(logoContainer, floralPage2Svg, config)
  logo.start().then(setUpMouseAnimation)
}

const setUpSecondPageFloralAnimation = () => {
  const floralPage2 = new SvgPathAnimation2(
    floralPage2Container,
    floralPage2Svg,
    { shapesconfig: shapesconfig2 }
  )

  scrolltimeline.addCallback(
    (value, value1) => {
      floralPage2.setFrame(value)
    },
    {
      start: 500,
      end: 900,
      from: 0,
      to: 1,
    }
  )
}

window.onload = () => {
  scrollContainer = document.querySelector('.scroll-container')
  mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container')
  logoContainer = document.querySelector('#logo-container')
  floralPage2Container = document.querySelector('#floralPage2')
  mouseContainer = document.querySelector('.mouse__container')
  pagerIndicator = document.querySelector('.pager__indicator')

  // const topage1 = document.querySelector('#topage1') as HTMLDivElement
  // const topage2 = document.querySelector('#topage2') as HTMLDivElement
  // const topage3 = document.querySelector('#topage3') as HTMLDivElement

  window.setTimeout(() => {
    setUpMainLogoAnimation()
    // setUpSecondPageFloralAnimation()
  }, 400)

  mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)
  mainBgAnimation.start()

  const options = {
    scrollStep: 80,
    maxScrollValue: 1800,
    snaps: [
      { value: 0, snapOver: 300 },
      { value: 900, snapUnder: 600, snapOver: 200 },
    ],
  }

  scrolltimeline = new ScrollTimeline(options)

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
