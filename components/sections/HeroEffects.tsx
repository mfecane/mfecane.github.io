"use client"
import path from "@/src/path-animation"
import { initTransparentPhoto } from "@/src/transparent-photo"
import { useEffect } from "react"

export default function HeroEffects() {
	useEffect(() => {
		initTransparentPhoto()
		path.init()
		path.run()
	}, [])

	return <></>
}
