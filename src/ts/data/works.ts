interface WorkItem {
	big?: true
	small?: true
	title: string
	tags?: string[]
	github: string
	link: string
	image?: string
	descr?: string
}

export const works: WorkItem[] = [
	{
		big: true,
		title: "Shadowcrypt",
		tags: ["Vue.js", "Canvas"],
		github: "https://github.com/mfecane/shadowcrypt",
		link: "https://shadowcrypt.web.app",
		image: "assets/images/shadowcrypt.png",
		descr: "An app for collecting, organizing, and viewing reference images, built as a focused personal alternative to PureRef and Pinterest, tailored to suit creative workflows without distractions.",
	},
	{
		big: true,
		title: "Three.js playground",
		tags: ["Three.js"],
		github: "https://github.com/mfecane/thri-playground",
		link: "https://mfecane.github.io/thri-playground/#/",
		image: "assets/images/thri.png",
		descr: "My collection of THREE.js rendering techniques and experiments.",
	},
	{
		big: true,
		title: "Wave function collapse castle",
		tags: ["Three.js", "React"],
		github: "https://github.com/mfecane/wave-function-collapse",
		link: "https://mfecane.github.io/wave-function-collapse/#/",
		image: "assets/images/castle.png",
		descr: "An implementation of the Wave Function Collapse algorithm for generating randomized 3D castles. It analyzes a pre-built castle model and constructs new variations based on its structure.",
	},
	{
		big: true,
		title: "Shadercity",
		tags: ["React", "WebGL", "Firebase", "GLSL"],
		github: "https://github.com/mfecane/shadercity",
		link: "https://shadercity.web.app/",
		image: "assets/images/shadercity.png",
		descr: "An alpha version of online shader playground. Uses firebase backend. Anyone can register and start having fun playing with shaders.",
	},
	{
		big: true,
		title: "Boot store app",
		tags: ["React", "WebGL", "GLSL"],
		github: "https://github.com/mfecane/boot",
		link: "https://mfecane.github.io/boot/",
		image: "assets/images/boot.png",
		descr: "An app for configuring of custom boot for imaginary cobbler shop. Allows selecting different materials and material colors for different parts. All design work, 3d modelling, sculpting and texturing were made by myself, no assets were outsorced. Rendering was done using THREE.JS.",
	},
	{
		big: true,
		title: "Hair generator",
		tags: ["React", "Three.js"],
		github: "https://github.com/mfecane/js-hair",
		link: "https://mfecane.github.io/js-hair/",
		image: "assets/images/js-hair.png",
		descr: 'A tool for generation of hair textures for real time rendering. It is able to generate large amount of hair geometry and bake high resolution information to albedo, normal, ambient occlusion, height, id and alpha cutout maps. Textures are applied to "hair card" meshes to render high quality and high performance believable hair in real time rendering engines, i.e. game engines.',
	},
	{
		big: true,
		title: "Shader gallery",
		tags: ["React", "WebGL"],
		github: "https://github.com/mfecane/nebula",
		link: "https://mfecane.github.io/nebula/",
		image: "assets/images/nebula.png",
		descr: "An exhibition of shaders made by me for fun. Some shaders are customizable. Features simple UI using React.",
	},
	{
		title: "Weather app",
		tags: ["React", "Redux"],
		github: "https://github.com/mfecane/weather-app/",
		link: "https://mfecane.github.io/weather-app/",
		image: "assets/images/weather.png",
		descr: "Application, which displays current weather, 5 day forecast, and hourly weather for the next 24 hours. Using both OpenWeatherMap API and WeatherAPI.com.",
	},
	{
		title: "Todo app",
		tags: ["React", "Bootstrap"],
		github: "https://github.com/mfecane/to-do_app",
		link: "https://mfecane.github.io/to-do_app/",
		image: "assets/images/todo.png",
		descr: "Application frontend for managing tasks. All items can be sorted by dragging, filtered, edited inline.",
	},
	{
		big: true,
		title: "Screen recording app",
		tags: ["C++", "Qt", "FFMPEG"],
		github: "https://github.com/mfecane/rec_app",
		link: "https://github.com/mfecane/rec_app/releases",
		image: "assets/images/rec-app.png",
		descr: "Windows application for easy creating time lapse recordings of user screen. This app was developed for myself for recording of my drawing and sculpting sessions.",
	},
	{
		small: true,
		title: "Rain effect",
		github: "https://github.com/mfecane/rain-effect",
		link: "https://mfecane.github.io/rain-effect/",
	},
	{
		small: true,
		title: "Mandelbruh fractal",
		tags: ["C++", "OpenGL", "WebGL"],
		github: "https://github.com/mfecane/mandelbruh",
		link: "https://mfecane.github.io/web-mandelbrot/",
		image: "assets/images/mandelbrot.png",
		descr: "Several implementations of mandelbrot fractal zooming applications. There are CPU, GPU (OpenGL), and GPU (Web-GL) versions. Due to the limit of precision of floating point numbers in WebGL, zooming in web version is limited.",
	},
	{
		title: "SVG Effect",
		github: "https://github.com/mfecane/effect",
		link: "https://mfecane.github.io/effect/",
	},
]
