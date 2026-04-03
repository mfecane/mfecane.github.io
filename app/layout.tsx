import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const notoSans = Noto_Sans({
	subsets: ["latin"],
	variable: "--font-noto-sans",
	display: "swap",
})

const siteUrl = "https://mfecane.github.io"
const defaultTitle = "Aleksei Aliapkin - FrontEnd developer"
const defaultDescription =
	"Frontend and 3D developer portfolio — TypeScript, React, Three.js, and interactive experiences."

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: defaultTitle,
		template: "%s · Aleksei Aliapkin",
	},
	description: defaultDescription,
	icons: {
		icon: "/assets/images/favicon.png",
	},
	openGraph: {
		title: defaultTitle,
		description: defaultDescription,
		url: siteUrl,
		siteName: "Aleksei Aliapkin",
		locale: "en",
		type: "website",
		images: [
			{
				url: "/assets/images/me.webp",
				alt: "Aleksei Aliapkin",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: defaultTitle,
		description: defaultDescription,
		images: ["/assets/images/me.webp"],
	},
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={notoSans.variable}>
			<body className={notoSans.className}>{children}</body>
		</html>
	)
}
