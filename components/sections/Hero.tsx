import Button from "@/components/common/Button"
import HeroEffects from "@/components/sections/HeroEffects"
import HeroImage from "@/components/sections/HeroImage"
import { FileDown, MessageCircle } from "lucide-react"

export default function Hero() {
	return (
		<section
			className="min-h-screen bg-[radial-gradient(ellipse_at_50%_40%,var(--color-ink)_0%,var(--color-ink-deep)_100%)]"
			id="home"
		>
			<HeroEffects />
			<div className="flex overflow-hidden h-screen">
				<div className="relative flex max-w-[50vw] flex-[1_0_50%] flex-col items-end justify-center p-8 max-md:max-w-none max-md:flex-[1_0_60%] max-md:items-start max-md:p-4">
					<HeroImage />

					<h1 className="mb-9 mt-4 text-right text-5xl font-medium text-rose max-sm:text-left z-2">
						I shape logic and aesthetics in interactive form
					</h1>

					<h2 className="mb-2 text-right text-4xl font-bold text-brand max-sm:text-left z-2">
						Aleksei Aliapkin
					</h2>

					<p className="mb-8 text-right text-2xl text-brand max-sm:text-left z-2">
						{"Frontend & 3D Developer"}
					</p>

					<div className="flex gap-4 max-md:flex-col z-2">
						<Button
							variant="primary"
							type="link"
							href="#contacts"
							className="flex items-center gap-2"
						>
							<MessageCircle />
							Contact me
						</Button>
						<Button
							type="download_link"
							variant="secondary"
							href="/assets/cv.pdf"
							className="flex items-center gap-2"
						>
							<FileDown />
							Download CV
						</Button>
					</div>

					<canvas
						id="hero__canvas"
						className="absolute top-0 right-0 z-1 aspect-1/2 h-full"
					/>
				</div>

				<div className="w-fit max-sm:hidden">
					<img
						src="/assets/images/me.webp"
						alt=""
						className="h-screen object-contain opacity-70"
					/>
				</div>

				<div className="hidden h-full shrink-0 py-32 pr-8 pl-8 min-[1200px]:block">
					<ul className="active" id="hero-menu">
						<li className="mb-8 text-xl [&_a]:text-brand [&_a]:hover:text-paper">
							<a href="#about">About me</a>
						</li>
						<li className="mb-8 text-xl [&_a]:text-brand [&_a]:hover:text-paper">
							<a href="#experience">Work experience</a>
						</li>
						<li className="mb-8 text-xl [&_a]:text-brand [&_a]:hover:text-paper">
							<a href="#works">My works</a>
						</li>
						<li className="text-xl [&_a]:text-brand [&_a]:hover:text-paper">
							<a href="#contacts">Contacts</a>
						</li>
					</ul>
				</div>
			</div>
		</section>
	)
}
