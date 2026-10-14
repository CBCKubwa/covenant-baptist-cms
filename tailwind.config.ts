import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0E1A2B",
        midnight: "#09111D",
        gold: "#C9A24E",
        "gold-light": "#E4C87E",
        parchment: "#F5EFE0",
        burgundy: "#6E2430",
        ink: "#212A38",
        "ink-soft": "#56607A",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
