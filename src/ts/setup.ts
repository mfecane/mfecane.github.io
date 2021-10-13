import ScrollTimeline from 'ts/animation/scroll-pager'
import MainBgAnimation from 'ts/components/main-background'
import SvgPathAnimation from 'ts/components/svg-path-animation'
import SvgPathAnimation2 from 'ts/components/svg-path-animation2'
import { easeOutSquare } from 'ts/lib/easing-functions'

import mainLogo from 'assets/svg/svg-low.inline.svg'
import shapesconfig from 'ts/svg/shapes-config'

import floralPage2Svg from 'assets/svg/second-page-floral2.inline.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'

import { mapclamp, mapplain, map01 } from 'ts/lib/lib'

let logoContainer: HTMLDivElement
let scrolltimeline: ScrollTimeline
let mouseContainer: HTMLDivElement
let logo: SvgPathAnimation
let pagerIndicator: HTMLDivElement
let mainBgAnimation: MainBgAnimation
let scrollContainer: HTMLDivElement
let mainBgCanvasContainer: HTMLDivElement
let experienceWrapper: HTMLDivElement
let page1: HTMLDivElement
let page2: HTMLDivElement
let curtain: HTMLDivElement
let page1Photo: HTMLImageElement
let page2left: HTMLDivElement
let page2right: HTMLDivElement
let page2title: HTMLDivElement

let mainBgAnimatinoCompleteFlag = false

const firstTransition = (value) => {
  value = easeOutSquare(value)

  const val1 = map01(value, 0, (-window.innerWidth / 3) * 2)
  page1.style.transform = `translateX(${val1}px)`
  page1.style.visibility = value === 1 ? 'hidden' : 'visible'

  const val2 = map01(value, 0, -window.innerWidth / 4)
  mainBgCanvasContainer.style.transform = `translateX(${val2}px)`
  mainBgCanvasContainer.style.visibility = value === 1 ? 'hidden' : 'visible'

  // const val3 =  map01(value, window.innerWidth, 0)
  // page2.style.transform = `translateX(${val3}px)`
  page2.style.visibility = value === 0 ? 'hidden' : 'visible'

  // const val4 =  map01(value, 0, -window.innerWidth/2)
  // const val7 =  map01(value, 0, -window.innerWidth/4)
  // const val5 =  map01(value, 0, 720)
  // const val6 =  map01(value, 1, 0)
  // page1Photo.style.transform = `translate(${val4}px, ${val7}px) rotate(${val5}deg) scale(${val6})`

  const val8 = mapclamp(value, 0.5, 0.9, -page2left.offsetWidth, 0)
  page2left.style.transform = `translateX(${val8}px)`

  const val9 = mapplain(value, 0, 1, page2right.offsetWidth, 0)
  page2right.style.transform = `translateX(${val9}px)`

  const val10 = mapplain(value, 0.7, 1, -100, 0)
  page2title.style.transform = `translateY(${val10}px)`
  const val11 = mapplain(value, 0.7, 1, 0, 1)
  page2title.style.opacity = `${val11}`

  // const val5 =  map01(value, 0, window.innerHeight)
  // page1Photo.style.transform = `translateY(${val5}px)`

  // TODO(AAl): this shouldn't happen each frame, check performance
  if (value > 0.1) {
    mouseContainer.classList.add('fade-out')
  } else {
    mouseContainer.classList.remove('fade-out')
  }

  if (mainBgAnimatinoCompleteFlag) {
    const v = mapclamp(value, 0, 0.6, 1, 0)
    logo.setFrame(v)
  }
}

const handleCurtain = (value) => {
  const left = mapclamp(value, 0, 0.5, 100, 0)
  const width = mapclamp(Math.abs(value - 1 / 2), 0, 1 / 2, 100, 0)
  curtain.style.width = `${width}vw`
  curtain.style.left = `${left}vw`
  curtain.style.visibility = 'hidden'
}

const setUpMainLogoAnimation = () => {
  const config = {
    shapesconfig: shapesconfig2,
    scale: 0.5,
  }

  logo = new SvgPathAnimation(logoContainer, floralPage2Svg, config)
  logo.start().then(() => {
    mainBgAnimatinoCompleteFlag = true
  })
}

window.onload = () => {
  scrollContainer = document.querySelector('.scroll-container')
  mainBgCanvasContainer = document.querySelector('#main-bg-canvas-container')
  logoContainer = document.querySelector('#logo-container')
  mouseContainer = document.querySelector('.mouse__container')
  pagerIndicator = document.querySelector('.pager__indicator')
  experienceWrapper = document.querySelector('.experience__wrapper')

  // page1
  page1 = document.querySelector('.page1')
  page1Photo = document.querySelector('.page1__photo')

  page2 = document.querySelector('.page2')
  curtain = document.querySelector('.curtain')
  page2left = document.querySelector('.page2-left')
  page2right = document.querySelector('.page2-right')
  page2title = document.querySelector('.about__title')

  window.setTimeout(() => {
    setUpMainLogoAnimation()
  }, 400)

  mainBgAnimation = new MainBgAnimation(mainBgCanvasContainer)
  mainBgAnimation.start()

  const options = {
    scrollStep: 0.1,
    pageCount: 3,
    pages: [
      {
        step: 0.05,
        snap: true,
      },
      {
        step: 0.02,
        snap: false,
      },
    ],
  }

  scrolltimeline = new ScrollTimeline(options)

  scrolltimeline.addTransition({
    func: handleCurtain,
    page: 0,
  })

  scrolltimeline.addTransition({
    func: firstTransition,
    page: 0,
  })

  scrolltimeline.addTransition({
    func: handleCurtain,
    page: 0,
  })

  // scrolltimeline.addCallback(handleSecondPageScroll, {
  //   segment: 1,
  // })

  // scrolltimeline.addCallback((value) => {
  //   const v = 5 + (130 * value) / 5
  //   pagerIndicator.style.left = `${v}px`
  // }, {})

  mouseContainer.addEventListener('click', () => {
    scrolltimeline.setScrollValue(1)
  })

  scrolltimeline.start()
}
