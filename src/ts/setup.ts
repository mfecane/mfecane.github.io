import transition from 'ts/animation/transition'
import scroller2 from 'ts/animation/scroller'
import { easeOutCubic } from './lib/easing-functions'
import SvgPathAnimation from 'ts/components/svg-path-animation'

import floralPage2Svg from 'assets/svg/second-page-floral2.inline.svg'
import shapesconfig2 from 'ts/svg/shapes-config2'

import mainBackground from 'ts/components/main-background'

let logoContainer: HTMLDivElement
let shaderCanvasContainer: HTMLDivElement
let menuHome: HTMLDivElement
let menuAbout: HTMLDivElement
let menuWorks: HTMLDivElement
let menuContacts: HTMLDivElement
let scrollerEl: HTMLDivElement
let mouseEl: HTMLDivElement
let contactButton: HTMLDivElement

let logo
let logoAnimationFinished = false

let currentMenuItem = -1
let scrollPoints = []

const initScroller = () => {
  const pageElements: Element[] = [
    '.hero-page',
    '.about-page',
    '.works-page',
    '.contacts-page',
  ].map((sel) => document.querySelector(sel))

  let widths = pageElements.map((el) => el.clientWidth)
  widths = widths.reverse().reduce((acc, cur) => {
    acc = acc.map((el) => el + cur)
    acc.push(0)
    return acc
  }, [])

  scrollPoints = [
    widths[3],
    widths[2],
    widths[1],
    Math.min(widths[0], +scrollerEl.clientWidth - window.innerWidth),
  ]

  scroller2.init({
    step: 120,
    points: [
      { value: scrollPoints[0], from: 0, to: scrollPoints[1] * 0.4 },
      {
        value: scrollPoints[1],
        from: scrollPoints[1] * 0.4,
        to: scrollPoints[1] * 1.2,
      },
      { value: scrollPoints[2] },
      {
        value: scrollPoints[3],
      },
    ],
  })
}

const initAnimations = () => {
  transition.createScreenTransition({
    selector: '.about-section',
    transitionIn: transition.fadeScaleIn,
    transitionOut: () => {},
    offset: 300,
  })

  transition.createScreenTransition({
    selector: '.experience-item',
    transitionIn: transition.fadeScaleIn,
    transitionOut: () => {},
    offset: 300,
  })

  transition.createScreenTransition({
    selector: '.education',
    transitionIn: transition.fadeScaleIn,
    transitionOut: () => {},
    offset: 300,
  })

  transition.createScreenTransition({
    selector: '.works-item__image',
    transitionIn: transition.fadeScaleIn,
    transitionOut: () => {},
    offset: 100,
  })

  transition.createAnimation({
    selector: '.works-title',
    start: 2000,
    end: 3500,
    init: true,
    hide: false,
    fn: (el, value) => {
      console.log(el)
      el.style.transform = `translateX(${300 - value * 400}px)`
    },
  })
}

const initMenu = () => {
  menuHome = document.querySelector('#menu_home')
  menuAbout = document.querySelector('#menu_about')
  menuWorks = document.querySelector('#menu_works')
  menuContacts = document.querySelector('#menu_contacts')

  menuHome.addEventListener('click', () => {
    scroller2.setScrollValue(0)
  })

  menuAbout.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[1])
  })

  menuWorks.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[2])
  })

  menuContacts.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[3])
  })
}

const updateMenu = (value) => {
  let index = -1
  value = value + (window.innerWidth * 3) / 4

  if (value < scrollPoints[1]) {
    index = 0
  } else if (scrollPoints[1] <= value && value < scrollPoints[2]) {
    index = 1
  } else if (scrollPoints[2] <= value && value < scrollPoints[3]) {
    index = 2
  } else if (scrollPoints[3] <= value) {
    index = 3
  }

  if (index !== currentMenuItem) {
    menuHome.classList.toggle('active', false)
    menuAbout.classList.toggle('active', false)
    menuWorks.classList.toggle('active', false)
    menuContacts.classList.toggle('active', false)

    switch (index) {
      case 0:
        menuHome.classList.toggle('active', true)
        break
      case 1:
        menuAbout.classList.toggle('active', true)
        break
      case 2:
        menuWorks.classList.toggle('active', true)
        break
      case 3:
        menuContacts.classList.toggle('active', true)
        break
    }
    currentMenuItem = index
  }
}

const updateScroller = (value) => {
  scrollerEl.style.transform = `translateX(-${value}px)`
}

const updateMouse = (value) => {
  if (value < 5) {
    mouseEl.classList.toggle('fade-out', false)
    return
  }
  mouseEl.classList.toggle('fade-out', true)
}

const update = () => {
  scroller2.update()
  transition.update()

  requestAnimationFrame(update)
}

const init = () => {
  logoContainer = document.querySelector('#logo-container')
  scrollerEl = document.querySelector('.scroller')
  mouseEl = document.querySelector('.mouse__container')
  contactButton = document.querySelector('#contacts-button')

  logo = new SvgPathAnimation(logoContainer, floralPage2Svg, {
    shapesconfig: shapesconfig2,
    scale: 0.5,
  })

  logo.start().then(() => {
    logoAnimationFinished = true
  })

  mouseEl.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[1])
  })

  contactButton.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[3])
  })

  shaderCanvasContainer = document.querySelector('#shader-canvas-container')
  mainBackground.init(shaderCanvasContainer)

  initScroller()
  initAnimations()
  initMenu()

  scroller2.addListener(updateScroller)
  scroller2.addListener(updateMenu)
  scroller2.addListener(updateMouse)
  scroller2.addListener(transition.update)

  update()
}

window.onload = init
