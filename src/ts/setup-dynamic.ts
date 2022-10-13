import transition from 'ts/animation/transition'
import scroller2 from 'ts/animation/scroller'
import {
  easeInSquare,
  easeOutCubic,
  easeOutSquare,
} from 'ts/lib/easing-functions'

import mainBackground from 'ts/components/main-background'
import { Spinner } from 'ts/components/spinner'
import { ScrollerGroup } from 'ts/components/scroller-group'
import { mapclamp } from './lib/lib'

import animationManager from 'ts/animation/animation-manager'

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
let spinner: Spinner

let currentMenuItem = -1
let scrollerGroup: ScrollerGroup
let homePos = 0
let aboutPos = 0
let worksPos = 0
let contactsPos = 0

const NOOP = () => {
  /* do nothing */
}

const panic = (type: 'element') => {
  switch (type) {
    case 'element':
      throw new Error('Element not found')
  }
}

const initScroller = () => {
  scrollerGroup = new ScrollerGroup('.scroller')
  const points = scrollerGroup.getPoints().map((p: number) => ({
    value: p,
  }))

  points[0] = { value: points[0].value, from: 0, to: points[1].value * 0.4 }
  points[1] = {
    value: points[1].value,
    from: points[1].value * 0.4,
    to: points[1].value * 1.2,
  }

  scroller2.init({
    step: 120,
    points,
  })

  homePos = scrollerGroup.getElementPos('hero-page')
  aboutPos = scrollerGroup.getElementPos('about-page')
  worksPos = scrollerGroup.getElementPos('works__title-container')
  contactsPos = scrollerGroup.getElementPos('contacts-page')
}

const initAnimations = () => {
  // ABOUT

  animationManager.createFullScreenTransition({
    selector: '.experience-section-outer',
    transition: (el: HTMLElement, value: number) => {
      const v1 = value
      el.style.transform = `translateX(${120 - v1 * 200}px)`
    },
  })

  animationManager.createScreenTransition({
    selector: '.about-section__text-wrapper',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    margin: 1000,
  })

  animationManager.createScreenTransition({
    selector: '.about-seciton__skills-header',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    margin: 1000,
  })

  animationManager.createScreenTransition({
    selector: '.education',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    margin: 1000,
  })

  animationManager.createFullScreenTransition({
    selector: '.works-title',
    transition: (el: HTMLElement, value: number) => {
      el.style.transform = `translateX(${-300 + value * 300}px)`
    },
  })

  animationManager.createScreenTransition({
    selector: '.skills__item',
    transitionIn: transition.fadeSlideIn,
    transitionOut: NOOP,
    margin: 500,
    offset: 50,
  })

  animationManager.createFullScreenTransition({
    selector: '.works-item__title',
    transition: (el: HTMLElement, value: number) => {
      const v1 = (0.5 * value + mapclamp(value, 0, 0.7, 0, 1)) / 1.5
      el.style.transform = `translateX(${125 - v1 * 150}px)`
      const v2 = mapclamp(value, 0, 0.5, 0, 1)
      el.style.opacity = v2.toString()
      const v3 = mapclamp(value, 0, 0.5, 0, 1)
      el.style.letterSpacing = `${3 + 30 * (1 - v3)}px`
    },
  })

  animationManager.createFullScreenTransition({
    selector: '.works-item__layout',
    transition: (el: HTMLElement, value: number) => {
      const v1 = (0.5 * value + mapclamp(value, 0, 0.7, 0, 1)) / 1.5
      el.style.transform = `translateX(${125 - v1 * 150}px)`
    },
  })

  animationManager.createFullScreenTransition({
    selector: '.works-item__image',
    easing: easeOutSquare,
    transition: (el: HTMLElement, value: number) => {
      const v1 = (0.5 * value + mapclamp(value, 0, 0.7, 0, 1)) / 1.5
      el.style.transform = `translateX(${200 - v1 * 210}px)`
    },
  })

  animationManager.createFullScreenTransition({
    selector: '.work-item__overlay-inner',
    transition: (el: HTMLElement, value: number) => {
      let v2
      if (value < 0.5) {
        v2 = mapclamp(value, 0.1, 0.3, 1, 0)
      } else {
        v2 = mapclamp(value, 0.7, 0.9, 0, 1)
      }
      el.style.opacity = v2.toString()
    },
  })

  animationManager.createClassTransition({
    selector: '.experience-item',
    offset: 100,
  })
  // TODO ::: extract common transitions into common classes
  // TODO ::: check this, its kinda not working with default offset
  animationManager.createClassTransition({
    selector: '.works-item__descr-text',
    offset: 10,
  })

  animationManager.createAnimation({
    selector: '.contacts__title',
    start: contactsPos - 500,
    end: contactsPos,
    init: true,
    hide: false,
    fn: (el, value: number) => {
      el.style.transform = `translateX(${-100 + value * 120}px)`
    },
  })

  animationManager.createClassTransition({
    selector: '.contact__item',
    offset: 70,
  })
}

const initMenu = () => {
  menuHome = document.querySelector('#menu_home') || panic('element')
  menuAbout = document.querySelector('#menu_about') || panic('element')
  menuWorks = document.querySelector('#menu_works') || panic('element')
  menuContacts = document.querySelector('#menu_contacts') || panic('element')

  Array.from(document.querySelectorAll('.nav a')).forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
    })
  })

  menuHome.addEventListener('click', () => {
    scroller2.setScrollValue(homePos)
  })

  menuAbout.addEventListener('click', () => {
    scroller2.setScrollValue(aboutPos)
  })

  menuWorks.addEventListener('click', () => {
    scroller2.setScrollValue(worksPos)
  })

  menuContacts.addEventListener('click', () => {
    scroller2.setScrollValue(contactsPos)
  })
}

const updateMenu = (value: number): void => {
  let index = -1
  value = value + (window.innerWidth * 3) / 4

  if (value < aboutPos) {
    index = 0
  } else if (aboutPos <= value && value < worksPos) {
    index = 1
  } else if (worksPos <= value && value < contactsPos) {
    index = 2
  } else if (contactsPos <= value) {
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

// const updatePath = (value: number): void => {
//   if (value > 550) return
//   const val = mapclamp(value, 30, 500, 1, 0)
//   path.update(val)
// }

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
    spinner.destroy()
  }, 1500)
}

export const init = (): void => {
  const body = document.getElementsByTagName('body')[0]
  body.classList.toggle('static-mode', false)
  body.classList.toggle('dynamic-mode', true)

  spinner = new Spinner('.loading-screen__spinner')

  // Does this shit even work?
  window.scrollTo(-10000, -10000)

  scrollerEl = document.querySelector('.scroller') || panic('element')
  mouseEl = document.querySelector('.mouse__container') || panic('element')
  contactButton = document.querySelector('#contacts-button') || panic('element')
  experienceEl =
    document.querySelector('.experience-section-outer') || panic('element')
  loadingScreen = document.querySelector('.loading-screen') || panic('element')

  mouseEl.addEventListener('click', () => {
    scroller2.setScrollValue(aboutPos)
  })

  contactButton.addEventListener('click', () => {
    scroller2.setScrollValue(contactsPos)
  })

  experienceEl.addEventListener('wheel', (e) => e.stopPropagation())

  shaderCanvasContainer =
    document.querySelector('#shader-canvas-container') || panic('element')
  mainBackground.init(shaderCanvasContainer).then(() => hideLoadingScreen())

  initScroller()
  const shwroller = document.querySelector('.scroller') || panic('element')
  Array.from(shwroller.children).forEach((el) => {
    el.classList.toggle('draggable', true)
  })

  initAnimations()
  initMenu()

  // path.init()
  // path.run()

  animationManager.init()

  scroller2.addListener(updateScroller)
  // scroller2.addListener(updatePath)
  scroller2.addListener(updateMenu)
  scroller2.addListener(updateMouse)
  // scroller2.addListener(transition.update)
  update()
}
