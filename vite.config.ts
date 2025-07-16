import { defineConfig } from "vite"
import handlebars from "vite-plugin-handlebars"
import path from "path"
import works from "./src/ts/data/works"
import about from "./src/ts/data/about"
import contacts from "./src/ts/data/contacts"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		handlebars({
			partialDirectory: path.resolve(__dirname, "src/partials"),
			context: {
				works,
				about,
				contacts,
			},
		}),
	],
	resolve: {
		alias: {
			css: path.resolve(__dirname, "src/css"),
			ts: path.resolve(__dirname, "src/ts"),
		},
	},
})
