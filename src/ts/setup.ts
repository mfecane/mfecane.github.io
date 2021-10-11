import ScrollTimeline from 'ts/animation/scroll-pager'
import MainBgAnimation from 'ts/components/main-background'
import SvgPathAnimation from 'ts/components/svg-path-animation'
import SvgPathAnimation2 from 'ts/components/svg-path-animation2'

import mainLogo from 'assets/svg/svg-low.inline.svg'
import shapesconfig from 'ts/svg/shapes-config'

import floralPage2Svg from 'assets/svg/second-page-floral2.inline.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'
import { easeInCubic } from 'ts/lib/easing-functions'

import { mapclamp } from 'ts/lib/lib'

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
let page1: HTMLDivElement
let page2: HTMLDivElement
let curtain: HTMLDivElement

const handleFirstPageScroll = (value) => {
  const val = (window.innerWidth * -value) / 2
  page1.style.transform = `translateX(${val}px)`
  page1.style.visibility = value > 0.5 ? 'hidden' : 'visible'
}

const handleMainBg = (value) => {
  const val = (window.innerWidth * -value) / 4
  mainBgCanvasContainer.style.transform = `translateX(${val}px)`
  mainBgCanvasContainer.style.visibility = value > 0.5 ? 'hidden' : 'visible'
}

const handleCurtain = (value) => {
  const left = mapclamp(value, 0, 0.5, 100, 0)
  const width = mapclamp(Math.abs(value - 1 / 2), 0, 1 / 2, 100, 0)
  curtain.style.width = `${width}vw`
  curtain.style.left = `${left}vw`
}

const handleMouseWidget = (value) => {
  if (value > 0.1) {
    mouseContainer.classList.add('fade-out')
  } else {
    mouseContainer.classList.remove('fade-out')
  }
}

const handleSecondPageScroll = (value) => {
  const scrollvalue = -value * window.innerWidth
  page2.style.transform = `translateX(${scrollvalue}px)`
}

const animateMainLogo = (value) => {
  const v = mapclamp(value, 0, 0.6, 1, 0)
  logo.setFrame(v)
}

const setUpMouseAnimation = () => {
  scrolltimeline.addState({
    setter: animateMainLogo,
    page: 0,
    from: 0,
    val: 0,
    to: 1,
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
  experienceWrapper = document.querySelector('.experience__wrapper')
  page2Scroller = document.querySelector('.page2-scroller')
  page1 = document.querySelector('.page1')
  page2 = document.querySelector('.page2')
  curtain = document.querySelector('.curtain')

  window.setTimeout(() => {
    setUpMainLogoAnimation()
  }, 400)

  mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)
  mainBgAnimation.start()

  const options = {
    scrollStep: 0.1,
    pageCount: 3,
  }

  scrolltimeline = new ScrollTimeline(options)

  scrolltimeline.addTransition({
    func: handleCurtain,
    page: 0,
  })

  scrolltimeline.addState({
    setter: handleFirstPageScroll,
    page: 0,
    from: 0,
    val: 0,
    to: 1,
  })

  scrolltimeline.addState({
    setter: handleFirstPageScroll,
    page: 0,
    from: 0,
    val: 0,
    to: 1,
  })

  scrolltimeline.addState({
    setter: handleMainBg,
    page: 0,
    from: 0,
    val: 0,
    to: 1,
  })

  // scrolltimeline.addCallback(handleMouseWidget, {
  //   segment: 0,
  // })

  // scrolltimeline.addCallback(handleSecondPageScroll, {
  //   segment: 1,
  // })

  // scrolltimeline.addCallback((value) => {
  //   const v = 5 + (130 * value) / 5
  //   pagerIndicator.style.left = `${v}px`
  // }, {})

  page2Scroller.addEventListener('scroll', (e) => {
    experienceWrapper.dispatchEvent(e)
  })

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(1)
  })

  scrolltimeline.start()
}
