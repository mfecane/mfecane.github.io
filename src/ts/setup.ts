import ScrollTimeline from 'ts/animation/scroll-timeline'
import MainBgAnimation from 'ts/components/main-background'
import SvgPathAnimation from 'ts/components/svg-path-animation'
import SvgPathAnimation2 from 'ts/components/svg-path-animation2'

import mainLogo from 'assets/svg/svg-low.inline.svg'
import shapesconfig from 'ts/svg/shapes-config'

import floralPage2Svg from 'assets/svg/second-page-floral2.inline.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'

let logoContainer: HTMLDivElement
let scrolltimeline: ScrollTimeline
let mouseContainer: HTMLDivElement
let logo: SvgPathAnimation
let pagerIndicator: HTMLDivElement
let mainBgAnimation: MainBgAnimation
let scrollContainer: HTMLDivElement
let mainBgCanvasContainer: HTMLDivElement
let experienceWrapper: HTMLDivElement
let page2Scroller: HTMLDivElement

const handleFirstPageScroll = function (value) {
  const scrollvalue = -value * window.innerWidth
  scrollContainer.style.transform = `translateX(${scrollvalue}px)`
  if (value > 0.1) {
    mouseContainer.classList.add('fade-out')
  } else {
    mouseContainer.classList.remove('fade-out')
  }
}

const handleOtherPagesScroll = (value) => {
  const fullWidth = scrollContainer.offsetWidth
  const scrollvalue =
    -window.innerWidth - (fullWidth - window.innerWidth) * value
  scrollContainer.style.transform = `translateX(${scrollvalue}px)`
}

const animateMainLogo = (value) => {
  logo.setFrame(1 - value)
}

const setUpMouseAnimation = () => {
  scrolltimeline.addCallback(animateMainLogo, {
    from: 0,
    to: 330,
  })
}

const handleScroll = () => {
  // check overflow
}

const setUpMainLogoAnimation = () => {
  const config = {
    shapesconfig: shapesconfig2,
    scale: 0.5,
  }

  logo = new SvgPathAnimation(logoContainer, floralPage2Svg, config)
  logo.start().then(setUpMouseAnimation)
}

window.onload = () => {
  scrollContainer = document.querySelector('.scroll-container')
  mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container')
  logoContainer = document.querySelector('#logo-container')
  mouseContainer = document.querySelector('.mouse__container')
  pagerIndicator = document.querySelector('.pager__indicator')
  experienceWrapper = document.querySelector('.experience__wrapper');
  page2Scroller = document.querySelector('.page2-scroller');

  window.setTimeout(() => {
    setUpMainLogoAnimation()
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

  scrolltimeline.addCallback(handleFirstPageScroll, {
    from: 0,
    to: 900,
  })

  scrolltimeline.addCallback(handleOtherPagesScroll, {
    from: 900,
    to: 1800,
  })

  scrolltimeline.addCallback(
    (value) => {
      mainBgCanvasContainer.style.transform = `translateX(${
        (-value / 2) * 100
      }vw)`
    },
    {
      from: 0,
      to: 900,
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

  page2Scroller.addEventListener('scroll', (e)=>{
    experienceWrapper.dispatchEvent(e)
  })

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(900)
  })

  scrolltimeline.start()
}
