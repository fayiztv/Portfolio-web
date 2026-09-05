import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        secondary: "var(--secondary)",
        border: "var(--border)",
      },
      fontFamily: {
        "clash-display": ["var(--font-clash-display)", "sans-serif"],
        "general-sans": ["var(--font-general-sans)", "sans-serif"],
        "jetbrains-mono": ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
