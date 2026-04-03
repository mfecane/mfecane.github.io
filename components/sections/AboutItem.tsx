export interface AboutItemProps {
	years: string
	title: string
	subtitle?: string
	text: string
}

export default function AboutItem({
	years,
	title,
	subtitle,
	text,
}: AboutItemProps) {
	return (
		<div className="mb-10 flex items-stretch max-md:flex-col">
			<div className="flex-[0_0_240px] border-r-4 border-brand max-md:flex-none max-md:border-r-0 max-md:border-b-4 max-md:border-brand">
				<div className="mb-4 text-xs text-ink max-md:text-xl max-md:font-semibold">
					{years}
				</div>
				<h3 className="text-xl leading-snug font-medium text-brand">
					{title}
				</h3>
			</div>
			<div className="pl-4 max-md:pl-0 max-md:pt-4">
				{subtitle && (
					<h4 className="mb-4 text-sm font-bold text-ink">
						{subtitle}
					</h4>
				)}
				<div className="leading-snug">{text}</div>
			</div>
		</div>
	)
}
