import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#152345',  // Foreground for cards, inputs
        cta: '#2563eb',      // Call to action buttons
        'main-bg': '#111827', // Main background
      },
    },
  },
  plugins: [],
};
export default config;
