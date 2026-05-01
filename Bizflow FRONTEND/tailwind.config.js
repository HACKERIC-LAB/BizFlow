/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  "#F5EFE6",
          100: "#EADBC8",
          200: "#E0D6C8",
          300: "#D2C2AF",
          400: "#C89B73",
          500: "#A97458",
          600: "#8A5A44",
          700: "#6B3E2E",
          800: "#4A2C22",
          900: "#3B231B",
        },
        accent: {
          DEFAULT: "#D6A56F",
          red: "#F43F5E",
          redLight: "#FFF1F2",
        },
        neutral: {
          300: "#CFCFCF",
          400: "#B7B7B7",
          500: "#9E9E9E",
        },
        // Semantic aliases — keep these so residual classes don't break
        primary: {
          DEFAULT: "#6B3E2E",   // coffee-700
          dark:    "#3B231B",   // coffee-900
          light:   "#C89B73",   // coffee-400
          accent:  "#D6A56F",   // accent
          soft:    "#F5EFE6",   // coffee-50
        },
        gold: {
          DEFAULT: "#D6A56F",
          light:   "#EADBC8",
        },
        mpesa: {
          green: "#059669",
          muted: "#D1FAE5",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Poppins", "sans-serif"],
        mono:    ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        card:   "1.5rem",
        button: "1rem",
        input:  "0.875rem",
        badge:  "9999px",
        "2xl":  "2rem",
        "3xl":  "2.5rem",
      },
      boxShadow: {
        subtle:     "0 2px 10px 0 rgb(0 0 0 / 0.05)",
        medium:     "0 10px 30px -5px rgb(0 0 0 / 0.12), 0 8px 15px -6px rgb(0 0 0 / 0.08)",
        large:      "0 25px 60px -12px rgb(0 0 0 / 0.18)",
        futuristic: "0 8px 30px rgba(107, 62, 46, 0.3)",  /* coffee-700 */
      },
      animation: {
        "fade-in":  "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn:  {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
