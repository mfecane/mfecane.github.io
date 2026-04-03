import type { ContactEntry } from "./ContactsItem"
import ContactsItem from "./ContactsItem"

export default function Contacts() {
	const contacts: ContactEntry[] = [
		{
			type: "mail",
			link: "mailto:aaliapkin@gmail.com",
			name: "aaliapkin@gmail.com",
		},
		{
			type: "phone",
			link: "tel:+79164265709",
			name: "+7 (916) 426-5709",
		},
		{
			type: "linkedin",
			link: "https://www.linkedin.com/in/mfecane/",
			name: "mfecane",
		},
		{
			type: "github",
			link: "https://github.com/mfecane",
			name: "mfecane",
		},
		{
			type: "telegram",
			link: "https://t.me/mfecane",
			name: "mfecane",
		},
		{
			type: "instagram",
			link: "https://www.instagram.com/mfecanics",
			name: "mfecanics",
		},
		{
			type: "artstation",
			link: "https://www.artstation.com/mfecane",
			name: "mfecane",
		},
	]

	return (
		<section className="bg-paper py-16" id="contacts">
			<div className="container max-w-4xl mx-auto">
				<h2 className="mb-12 text-3xl font-medium text-brand">
					Contact me
				</h2>
				<ul>
					{contacts.map((contact) => (
						<ContactsItem key={contact.type} {...contact} />
					))}
				</ul>
			</div>
		</section>
	)
}
