import Button from "@/components/common/Button"
import { ExternalLink, GitGraph } from "lucide-react"

export type WorkItemSize = "big" | "small"

export interface WorkItem {
	size: WorkItemSize
	title: string
	tags?: string[]
	github: string
	link: string
	image?: string
	descr?: string
}

export type WorkItemProps = Omit<WorkItem, "size">

export default function WorksItem({
	title,
	tags,
	github,
	link,
	image,
	descr,
}: WorkItemProps) {
	return (
		<div className="mb-20">
			<div className="flex gap-8 max-md:block">
				<div className="flex min-w-0 flex-1 flex-col">
					<h3 className="mb-8 text-[2.4rem] font-medium">
						<a
							href={link}
							target="_blank"
							rel="noreferrer"
							className="text-brand transition-colors hover:text-paper"
						>
							{title}
						</a>
					</h3>
					{tags && tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<div
									key={tag}
									className="rounded bg-ink px-3.5 py-1.5 text-[0.8em] text-muted"
								>
									{tag}
								</div>
							))}
						</div>
					)}
					{descr && (
						<p className="mt-4 mb-4 flex-1 text-base leading-relaxed">
							{descr}
						</p>
					)}
					<div className="flex gap-4">
						<Button
							type="link"
							href={github}
							target="_blank"
							rel="noreferrer"
							variant="secondary"
							className="min-w-0 px-3 py-2 text-base flex items-center gap-2"
						>
							<GitGraph />
							GitHub
						</Button>
						<Button
							type="link"
							href={link}
							target="_blank"
							rel="noreferrer"
							variant="secondary"
							className="min-w-0 px-3 py-2 text-base flex items-center gap-2"
						>
							<ExternalLink />
							Live
						</Button>
					</div>
				</div>
				{image && (
					<div className="relative h-full w-full max-w-[320px] shrink-0 cursor-pointer overflow-hidden max-md:mt-8 max-md:max-w-none">
						<a
							href={link}
							target="_blank"
							rel="noreferrer"
							className="block"
						>
							<img
								className="h-full w-full rounded-sm object-cover"
								src={`/${image}`}
								alt={title}
							/>
						</a>
					</div>
				)}
			</div>
		</div>
	)
}
