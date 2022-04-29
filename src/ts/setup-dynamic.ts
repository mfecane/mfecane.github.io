import transition from 'ts/animation/transition'
import scroller2 from 'ts/animation/scroller'
import { easeOutCubic } from 'ts/lib/easing-functions'
import { mapclamp } from 'ts/lib/lib'
import path from 'ts/components/path-animation'

import mainBackground from 'ts/components/main-background'

let shaderCanvasContainer: HTMLDivElement
let menuHome: HTMLDivElement
let menuAbout: HTMLDivElement
let menuWorks: HTMLDivElement
let menuContacts: HTMLDivElement
let scrollerEl: HTMLDivElement
let mouseEl: HTMLDivElement
let contactButton: HTMLDivElement
let experienceEl: HTMLDivElement
let loadingScreen: HTMLDivElement

let currentMenuItem = -1
let scrollPoints = []

const NOOP = () => {}

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
  // TODO ::: do thiese transitions by adding class

  transition.createScreenTransition({
    selector: '.about-section__text-wrapper',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    offset: 200,
  })

  transition.createScreenTransition({
    selector: '.about-seciton__skills-header',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    offset: 200,
  })

  transition.createFullScreenTransition({
    selector: '.about-section',
    easing: easeOutCubic,
    transition: (el, value) => {
      el.style.transform = `translateX(${-100 + value * 120}px)`
    },
  })

  transition.createScreenTransition({
    selector: '.skills__item',
    transitionIn: transition.fadeSlideIn,
    transitionOut: NOOP,
    margin: 500,
    offset: 50,
  })

  transition.createFullScreenTransition({
    selector: '.experience-section',
    transition: (el, value) => {
      el.style.transform = `translateX(${-20 + value * 50}px)`
    },
  })

  transition.createClassTransition({
    selector: '.experience-item',
    offset: 100,
  })

  transition.createFullScreenTransition({
    selector: '.education',
    transition: (el, value) => {
      el.style.transform = `translateX(${-50 + value * 80}px)`
    },
  })

  transition.createScreenTransition({
    selector: '.education',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    offset: 300,
  })

  transition.createFullScreenTransition({
    selector: '.works-title',
    transition: (el, value) => {
      el.style.transform = `translateX(${-300 + value * 300}px)`
    },
  })

  transition.createFullScreenTransition({
    selector: '.works-item__image',
    transition: (el, value) => {
      el.style.transform = `translateX(${-40 + value * 50}px)`
    },
  })

  // TODO ::: extract common transitions into common classes
  transition.createClassTransition({
    selector: '.works-item__descr-text',
  })

  transition.createAnimation({
    selector: '.contacts__title',
    start: scrollPoints[3] - 500,
    end: scrollPoints[3],
    init: true,
    hide: false,
    fn: (el, value) => {
      el.style.transform = `translateX(${-200 + value * 220}px)`
    },
  })

  transition.createClassTransition({
    selector: '.contact__item',
    offset: 70,
  })
}

const initMenu = () => {
  menuHome = document.querySelector('#menu_home')
  menuAbout = document.querySelector('#menu_about')
  menuWorks = document.querySelector('#menu_works')
  menuContacts = document.querySelector('#menu_contacts')

  Array.from(document.querySelectorAll('.nav a')).forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
    })
  })

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

const updateMenu = (value: number): void => {
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

const updateScroller = (value: number): void => {
  scrollerEl.style.transform = `translateX(-${value}px)`
}

const updatePath = (value: number): void => {
  if (value > 550) return
  const val = mapclamp(value, 30, 500, 1, 0)
  path.update(val)
}

const updateMouse = (value: number): void => {
  if (value < 5) {
    mouseEl.classList.toggle('fade-out', false)
    return
  }
  mouseEl.classList.toggle('fade-out', true)
}

const update = (): void => {
  scroller2.update()
  requestAnimationFrame(update)
}

const hideLoadingScreen = () => {
  loadingScreen.classList.add('fade-out')
  setTimeout(() => {
    loadingScreen.classList.add('hidden')
  }, 1500)
}

export const init = (): void => {
  const body = document.getElementsByTagName('body')[0]
  body.classList.toggle('static-mode', false)
  body.classList.toggle('dynamic-mode', true)

  // Does this shit even work?
  window.scrollTo(-10000, -10000)

  scrollerEl = document.querySelector('.scroller')
  mouseEl = document.querySelector('.mouse__container')
  contactButton = document.querySelector('#contacts-button')
  experienceEl = document.querySelector('.experience-section-outer')
  loadingScreen = document.querySelector('.loading-screen')

  mouseEl.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[1])
  })

  contactButton.addEventListener('click', () => {
    scroller2.setScrollValue(scrollPoints[3])
  })

  experienceEl.addEventListener('wheel', (e) => e.stopPropagation())

  shaderCanvasContainer = document.querySelector('#shader-canvas-container')
  mainBackground.init(shaderCanvasContainer).then(() => hideLoadingScreen())

  initScroller()
  const shwroller = document.querySelector('.scroller-inner')
  Array.from(shwroller.children).forEach((el) => {
    el.classList.toggle('draggable', true)
  })

  initAnimations()
  initMenu()

  path.init()
  path.run()

  scroller2.addListener(updateScroller)
  scroller2.addListener(updatePath)
  scroller2.addListener(updateMenu)
  scroller2.addListener(updateMouse)
  scroller2.addListener(transition.update)

  hideLoadingScreen()

  update()
}
