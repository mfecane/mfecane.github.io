let wrapper
let ticks = []
let cachedPage = -1
let initialized = false

let options = {
  callback: () => {},
}

export const initScroller = (opts: any): void => {
  options = { ...options, ...opts }
  wrapper = document.querySelector('.scroller__container')
  const arr = document.querySelectorAll('.scroller__tick')
  ticks = Array.from(arr)

  ticks.forEach((tick, index) => {
    tick.addEventListener('click', options.callback.bind(null, index))
  })

  initialized = true
}

export const update = (page: number): void => {
  if (!initialized) {
    return
  }

  if (cachedPage === page) {
    return
  }

  cachedPage = page
  ticks.forEach((t) => t.classList.remove('scroller__tick--active'))
  ticks[page].classList.add('scroller__tick--active')
}

export const setScrollerOpacity = (val: number): void => {
  if (!initialized) {
    return
  }
  wrapper.style.opacity = val
}
