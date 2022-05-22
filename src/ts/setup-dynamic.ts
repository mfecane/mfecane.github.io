import transition from 'ts/animation/transition'
import scroller2 from 'ts/animation/scroller'
import { easeOutCubic } from 'ts/lib/easing-functions'
import { WorksItems } from 'ts/components/works-items'

import mainBackground from 'ts/components/main-background'
import { Spinner } from 'ts/components/spinner'
import { ScrollerGroup } from 'ts/components/scroller-group'

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
let worksItems: WorksItems

let currentMenuItem = -1
let scrollerGroup: ScrollerGroup
let homePos = 0
let aboutPos = 0
let worksPos = 0
let contactsPos = 0

const NOOP = () => {
  /* do nothing */
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
    selector: '.works-title',
    easing: easeOutCubic,
    transition: (el, value) => {
      el.style.transform = `translateX(${-300 + value * 300}px)`
    },
  })

  // transition.createFullScreenTransition({
  //   selector: '.about-section',
  //   easing: easeOutCubic,
  //   transition: (el, value) => {
  //     el.style.transform = `translateX(${-100 + value * 120}px)`
  //   },
  // })

  transition.createScreenTransition({
    selector: '.skills__item',
    transitionIn: transition.fadeSlideIn,
    transitionOut: NOOP,
    margin: 500,
    offset: 50,
  })

  // transition.createFullScreenTransition({
  //   selector: '.experience-section',
  //   transition: (el, value) => {
  //     el.style.transform = `translateX(${-20 + value * 50}px)`
  //   },
  // })

  // transition.createClassTransition({
  //   selector: '.works-item',
  //   offsetIn: 300,
  //   offsetOut: 600,
  // })

  transition.createClassTransition({
    selector: '.experience-item',
    offset: 100,
  })

  transition.createScreenTransition({
    selector: '.education',
    transitionIn: transition.fadeIn,
    transitionOut: NOOP,
    offset: 300,
  })

  // TODO ::: extract common transitions into common classes
  transition.createClassTransition({
    selector: '.works-item__descr-text',
  })

  transition.createAnimation({
    selector: '.contacts__title',
    start: contactsPos - 500,
    end: contactsPos,
    init: true,
    hide: false,
    fn: (el, value) => {
      el.style.transform = `translateX(${-100 + value * 120}px)`
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
  worksItems.update()
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

  scrollerEl = document.querySelector('.scroller')
  mouseEl = document.querySelector('.mouse__container')
  contactButton = document.querySelector('#contacts-button')
  experienceEl = document.querySelector('.experience-section-outer')
  loadingScreen = document.querySelector('.loading-screen')

  mouseEl.addEventListener('click', () => {
    scroller2.setScrollValue(aboutPos)
  })

  contactButton.addEventListener('click', () => {
    scroller2.setScrollValue(contactsPos)
  })

  experienceEl.addEventListener('wheel', (e) => e.stopPropagation())

  shaderCanvasContainer = document.querySelector('#shader-canvas-container')
  mainBackground.init(shaderCanvasContainer).then(() => hideLoadingScreen())

  worksItems = new WorksItems('.works-page')

  initScroller()
  const shwroller = document.querySelector('.scroller')
  Array.from(shwroller.children).forEach((el) => {
    el.classList.toggle('draggable', true)
  })

  initAnimations()
  initMenu()

  // path.init()
  // path.run()

  scroller2.addListener(updateScroller)
  // scroller2.addListener(updatePath)
  scroller2.addListener(updateMenu)
  scroller2.addListener(updateMouse)
  scroller2.addListener(transition.update)

  hideLoadingScreen()

  update()
}
