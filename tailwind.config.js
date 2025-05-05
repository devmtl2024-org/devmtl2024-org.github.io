/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#01055E",
          dark: "#0b0d32",
          light: "#2f338c",
        },
        secondary: {
          DEFAULT: "#ff9b62",
          dark: "#e87432",
          light: "#f8d5c1",
        },
      },
    },
  },
  plugins: [],
};
