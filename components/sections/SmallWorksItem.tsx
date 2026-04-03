import Button from "@/components/common/Button"
import { ExternalLink, GitGraph } from "lucide-react"
import type { WorkItemProps } from "./WorksItem"

export default function SmallWorksItem({
	title,
	github,
	link,
}: Pick<WorkItemProps, "title" | "github" | "link">) {
	return (
		<div className="mb-8 flex gap-4 max-md:flex-col">
			<h3 className="min-w-0 flex-1 text-xl font-medium">
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					className="text-brand transition-colors hover:text-paper"
				>
					{title}
				</a>
			</h3>
			<div className="flex gap-4">
				<Button
					type="link"
					href={github}
					target="_blank"
					rel="noreferrer"
					variant="secondary"
					className="min-w-0 text-sm flex items-center gap-2"
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
					className="min-w-0 text-sm flex items-center gap-2"
				>
					<ExternalLink />
					Live
				</Button>
			</div>
		</div>
	)
}
