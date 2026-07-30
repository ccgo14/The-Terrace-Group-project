/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        floodlight: "#f4f4f0",
        "night-pitch": "#0d0f12",
        terracing: "#1a1d24",
        "amber-live": "#FFB100",
        "pitch-green": "#3C5A41",
      },
      fontFamily: {
        display: ["Barlow Condensed", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        cardLg: "16px",
      },
      boxShadow: {
        none: "none",
      },
      backgroundImage: {
        "terracing-steps":
          "repeating-linear-gradient(0deg, transparent 0px, transparent 6px, rgba(244,245,241,0.05) 6px, rgba(244,245,241,0.05) 7px)",
      },
    },
  },
  plugins: [],
};
