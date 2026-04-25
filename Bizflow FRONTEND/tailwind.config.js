/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007a35",
          dark: "#005a27",
          light: "#e6f4ec",
        },
        accent: {
          red: "#BB1E1E",
          redLight: "#fee2e2",
        },
        mpesa: {
          green: "#22c55e",
          muted: "#bbf7d0",
        },
        gold: {
          DEFAULT: "#d48800",
          light: "#fff3e0",
        },
        blue: {
          DEFAULT: "#2563eb",
          light: "#e8f0fe",
        },
        neutral: {
          darkNavy: "#1a2332",
          textMid: "#4a5568",
          textLight: "#718096",
          border: "#d1dbe8",
          background: "#f2f5f9",
          cardBg: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
        input: "0.5rem",
        badge: "9999px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        medium: "0 4px 12px -2px rgb(0 0 0 / 0.08)",
        large: "0 8px 24px -4px rgb(0 0 0 / 0.12)",
      },
    },
  },
  plugins: [],
}
