import { throttle } from 'lodash'
import { init as initDynamic } from 'ts/setup-dynamic'
import { init as setUpStatic } from 'ts/setup-static'

enum DISPLAY_MODE {
  DYNAMIC,
  STATIC,
}

let currentMode: DISPLAY_MODE | null = null

const checkBrowser = (): DISPLAY_MODE => {
  const width = window.innerWidth
  const height = window.innerHeight

  if (1200 < width && 600 < height && height < width) {
    return DISPLAY_MODE.DYNAMIC
  }

  return DISPLAY_MODE.STATIC
}

const selectMode = (): void => {
  const mode = checkBrowser()
  if (mode === currentMode) {
    return
  }

  if (currentMode !== null) {
    location.reload()
  }

  currentMode = mode

  switch (currentMode) {
    case DISPLAY_MODE.DYNAMIC:
      return initDynamic()
    default:
    case DISPLAY_MODE.STATIC:
      setUpStatic()
      return
  }
}

const setUpWebSite = (): void => {
  window.addEventListener('resize', throttle(selectMode, 500))
  selectMode()
}

window.onload = setUpWebSite
