import type { AboutItemProps } from "./AboutItem"
import AboutItem from "./AboutItem"

const icons = "/assets/images/icons.svg"

export default function About() {
	const aboutData: {
		experience: AboutItemProps[]
		education: AboutItemProps[]
	} = {
		experience: [
			{
				years: "2023 - NOW",
				title: "Senior frontend developer",
				subtitle: "Planner5d, UAB",
				text: "I developed the user interface for a home renovation platform, including custom controls and editor widgets. I worked on both 2D and 3D viewport renderers, focusing on performance and optimization. Additionally, I contributed to backend development and handled full-stack tasks as needed. I also performed code reviews and helped improve overall development practices within the team.",
			},
			{
				years: "2021 - 2023",
				title: "Team lead",
				subtitle: "ONLINE RESERVATION SYSTEMS",
				text: "Shortly after joining became team lead. Started to manage team's tasks, perform code reviews I take only most complex tasks. I perform different related activities, such as DevOps tasks, deployment, developement of in-house e2e testing helper framework.",
			},
			{
				years: "2020 - 2021",
				title: "Frontend developer",
				subtitle: "GRIDNINE SYSTEMS",
				text: "Finished my tasks timely with good quality. Received positive feedback from client for my work.",
			},
			{
				years: "2008 - 2019",
				title: "Financial analyst",
				text: "Previously I was working in largest Russian banks as financial analyst, such as Rosbank, Societe Generale Group, Open Bank, Russian Standard Bank. I started my career in Russian branch of KPMG as audit associate.",
			},
		],
		education: [
			{
				years: "2002 - 2007",
				title: "Lomonosov Moscow State University",
				subtitle: "Department of mechanics and mathematics",
				text: "Earned a Specialist Degree with honors, specializing in the optimization of control systems within dynamic environments.",
			},
		],
	}

	return (
		<section className="bg-paper py-16" id="about">
			<div className="container max-w-4xl mx-auto">
				<h2 className="mb-8 text-[2.2rem] font-medium text-brand">
					About Me
				</h2>

				<div className="mb-8 text-xl leading-snug text-body [&>p:not(:last-child)]:mb-4">
					<p>Hi, my name is Aliapkin Aleksei.</p>
					<p>
						I am crafting digital experiences at the intersection of
						mathematics and visual design.
					</p>
					<p>
						I specialize in TypeScript, React and Three.js
						technologies. I have knowledge of 3d rendering pipeline,
						mathematical background and strong 3D modeling skills.
					</p>
					<p>
						Based in Belgrade, Serbia — open to relocation and
						available for projects worldwide.
					</p>
					<p>
						Outside of work, I’m into windsurfing, yachting, dancing
						West Coast Swing, and riding enduro bike. I also do
						tattooing, creating designs in my own style and putting
						them on my clients.
					</p>
				</div>

				<h2 className="mb-8 mt-16 text-[2.2rem] font-medium text-brand">
					Key skills
				</h2>

				<div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
					<div className="flex flex-col items-center gap-4 text-brand">
						<svg className="relative inline-block h-9 w-9">
							<use href={`${icons}#icon-vue`} />
						</svg>
						<span className="block text-xl">Vue</span>
					</div>
					<div className="flex flex-col items-center gap-4 text-brand">
						<svg className="relative inline-block h-9 w-9">
							<use href={`${icons}#icon-react`} />
						</svg>
						<span className="block text-xl">React</span>
					</div>
					<div className="flex flex-col items-center gap-4 text-brand">
						<svg className="relative inline-block h-9 w-9">
							<use href={`${icons}#icon-typescript`} />
						</svg>
						<span className="block text-xl">TypeScript</span>
					</div>
					<div className="flex flex-col items-center gap-4 text-brand">
						<svg className="relative inline-block h-9 w-9">
							<use href={`${icons}#icon-webgl`} />
						</svg>
						<span className="block text-xl">WebGL</span>
					</div>
				</div>

				<h2
					className="mb-8 mt-16 text-[2.2rem] font-medium text-brand"
					id="experience"
				>
					Work experience
				</h2>

				{aboutData.experience.map((item, index) => (
					<AboutItem key={index} {...item} />
				))}

				<h2 className="mb-8 mt-16 text-[2.2rem] font-medium text-brand">
					Education
				</h2>

				{aboutData.education.map((item, index) => (
					<AboutItem key={index} {...item} />
				))}
			</div>
		</section>
	)
}
