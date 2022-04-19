export const init = (): void => {
  const body = document.getElementsByTagName('body')[0]
  body.classList.toggle('static-mode', true)
  body.classList.toggle('dynamic-mode', false)

  const nav = document.querySelector('.nav')
  window.addEventListener('scroll', () => {
    nav.classList.toggle('black', document.documentElement.scrollTop > 5)
  })

  const loadingScreen = document.querySelector('.loading-screen')
  loadingScreen.classList.add('fade-out')
  setTimeout(() => {
    loadingScreen.classList.add('hidden')
  }, 1500)
}
