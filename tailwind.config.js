/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  // No theme/extend needed here anymore, all tokens are in index.css
  theme: {
    extend: {},
  },
  plugins: [],
};