export interface ContactEntry {
	type: string
	link: string
	name: string
}

export default function ContactsItem({ type, link, name }: ContactEntry) {
	const icons = "/assets/images/icons.svg"
	const external = link.startsWith("http")

	return (
		<li className="group mb-6 grid grid-cols-[32px_1fr] gap-x-8 gap-y-1">
			<div className="row-span-2 flex items-start pt-0.5">
				<a
					href={link}
					target={external ? "_blank" : undefined}
					rel={external ? "noreferrer" : undefined}
					className="block"
				>
					<svg className="h-8 w-8 text-ink">
						<use href={`${icons}#icon-${type}`} />
					</svg>
				</a>
			</div>
			<p className="m-0 font-semibold capitalize text-ink">{type}</p>
			<a
				href={link}
				target={external ? "_blank" : undefined}
				rel={external ? "noreferrer" : undefined}
				className="text-brand transition-colors duration-200 group-hover:text-ink"
			>
				{name}
			</a>
		</li>
	)
}
