/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					dark: "",
					main: "#01055E",
					light: "#FF9B62"
				},
			}
		},
	},
	plugins: [],
}

