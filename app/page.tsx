import About from "@/components/sections/About"
import Contacts from "@/components/sections/Contacts"
import Hero from "@/components/sections/Hero"
import Nav from "@/components/sections/Nav"
import Works from "@/components/sections/Works"

export default function Page() {
	return (
		<>
			<Nav />
			<Hero />
			<About />
			<Works />
			<Contacts />
		</>
	)
}
