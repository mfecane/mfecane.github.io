"use client"

import { cn } from "@/src/lib/utils"
import { useEffect, useRef, useState } from "react"

const links = [
	{ href: "#home", label: "Home" },
	{ href: "#about", label: "About me" },
	{ href: "#experience", label: "Work experience" },
	{ href: "#works", label: "My works" },
	{ href: "#contacts", label: "Contacts" },
]

function getMobileMenuFocusables(
	container: Element,
	burger: HTMLButtonElement
): HTMLElement[] {
	const links = Array.from(
		container.querySelectorAll<HTMLElement>("a[href]")
	).filter((el) => el.offsetParent !== null)
	return [...links, burger]
}

export default function Nav() {
	const navRef = useRef<HTMLElement>(null)
	const burgerRef = useRef<HTMLButtonElement>(null)
	const [menuOpen, setMenuOpen] = useState(false)

	useEffect(() => {
		const heroMenu = document.querySelector("#hero-menu")
		const nav = navRef.current
		if (!nav) return

		const onScroll = () => {
			const scrolled = document.documentElement.scrollTop > 5
			heroMenu?.classList.toggle("active", !scrolled)
			nav.classList.toggle("active", scrolled)
		}

		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	useEffect(() => {
		if (!menuOpen) return

		const nav = navRef.current
		const burger = burgerRef.current
		const container = nav?.querySelector("#nav-items")
		if (!nav || !container || !burger) return

		const onPointerDown = (e: PointerEvent) => {
			if (!nav.contains(e.target as Node)) setMenuOpen(false)
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault()
				setMenuOpen(false)
				burgerRef.current?.focus()
				return
			}
			if (e.key !== "Tab") return

			const focusables = getMobileMenuFocusables(container, burger)
			if (focusables.length <= 1) return

			const first = focusables[0]
			const last = focusables[focusables.length - 1]
			const active = document.activeElement as HTMLElement | null

			if (e.shiftKey) {
				if (active === first) {
					e.preventDefault()
					last.focus()
				}
			} else if (active === last) {
				e.preventDefault()
				first.focus()
			}
		}

		document.addEventListener("pointerdown", onPointerDown)
		document.addEventListener("keydown", onKeyDown)

		const focusables = getMobileMenuFocusables(container, burger)
		if (focusables.length > 0) {
			window.requestAnimationFrame(() => focusables[0].focus())
		}

		return () => {
			document.removeEventListener("pointerdown", onPointerDown)
			document.removeEventListener("keydown", onKeyDown)
		}
	}, [menuOpen])

	return (
		<nav
			ref={navRef}
			className={cn(
				"fixed top-0 z-100 w-full bg-[rgba(28,33,36,0.9)] py-4 text-paper transition-opacity duration-200",
				menuOpen && "open"
			)}
			id="nav"
		>
			<div className="container max-w-4xl mx-auto flex items-center justify-between max-md:justify-end">
				<div className="nav-reveal text-xl font-bold max-md:hidden">
					Aleksei Aliapkin
				</div>
				<ul
					id="nav-items"
					className="nav-reveal flex list-none gap-8 max-md:gap-8 md:items-center"
				>
					{links.map(({ href, label }) => (
						<li key={href}>
							<a
								href={href}
								className="font-medium text-paper no-underline hover:text-brand"
								onClick={() => setMenuOpen(false)}
							>
								{label}
							</a>
						</li>
					))}
				</ul>
				<button
					ref={burgerRef}
					type="button"
					className="nav-reveal relative z-2 hidden h-[18px] w-6 flex-col justify-between border-0 bg-transparent p-0 max-md:flex"
					aria-label="Toggle menu"
					aria-expanded={menuOpen}
					aria-controls="nav-items"
					onClick={() => setMenuOpen((open) => !open)}
				>
					<span className="block h-0.5 rounded-sm bg-white" />
					<span className="block h-0.5 rounded-sm bg-white" />
					<span className="block h-0.5 rounded-sm bg-white" />
				</button>
			</div>
		</nav>
	)
}
