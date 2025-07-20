import "css/styles.scss"

import path from "ts/path-animation"

import "ts/transparent-photo"

window.addEventListener("load", () => {
	path.init()
	path.run()
})

const heroMenu = document.querySelector("#hero-menu")
const nav = document.querySelector("#nav")
const burger = document.querySelector("#burger")

window.addEventListener("scroll", () => {
	const scrolled = document.documentElement.scrollTop > 5

	heroMenu?.classList.toggle("active", !scrolled)
	nav?.classList.toggle("active", scrolled)
})

burger?.addEventListener("click", () => {
	nav?.classList.toggle("open")
})
