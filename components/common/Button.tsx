import { cn } from "@/src/lib/utils"
import type { ReactNode } from "react"

interface ButtonProps {
	children: ReactNode
	className?: string
	href?: string
	target?: string
	rel?: string
	type?: "button" | "link" | "download_link"
	variant?: "primary" | "secondary"
}

export default function Button({
	children,
	className,
	variant = "primary",
	type = "button",
	href,
	target,
	rel,
	...props
}: ButtonProps) {
	let buttonClassName: string =
		"py-2 px-6 inline-grid min-w-[150px] place-content-center rounded text-base font-semibold whitespace-nowrap transition-all duration-150 ease-out"

	switch (variant) {
		case "primary":
			buttonClassName = cn(
				buttonClassName,
				"border border-brand bg-brand text-ink hover:border-paper hover:text-paper",
				className
			)
			break
		case "secondary":
			buttonClassName = cn(
				buttonClassName,
				"border border-brand bg-transparent text-brand hover:border-paper hover:text-paper",
				className
			)
			break
	}

	if (type === "button") {
		return (
			<button className={buttonClassName} {...props}>
				{children}
			</button>
		)
	}

	if (type === "download_link") {
		return (
			<a className={buttonClassName} href={href} download {...props}>
				{children}
			</a>
		)
	}

	return (
		<a
			className={buttonClassName}
			href={href}
			target={target}
			rel={rel}
			{...props}
		>
			{children}
		</a>
	)
}
