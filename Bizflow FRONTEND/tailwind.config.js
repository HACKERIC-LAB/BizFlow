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
          DEFAULT: "#D6A56F", // Premium Gold
          gold:    "#D6A56F",
          red:     "#F43F5E",
          redLight: "#FFF1F2",
        },
        neutral: {
          300: "#CFCFCF",
          400: "#B7B7B7",
          500: "#9E9E9E",
        },
        // Semantic aliases — Re-mapped back to Coffee
        primary: {
          DEFAULT: "#3B231B",   // coffee-900
          dark:    "#2A1812",   
          light:   "#6B3E2E",   // coffee-700
          accent:  "#D6A56F",   // gold
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
        subtle:     "0 2px 10px 0 rgba(59, 35, 27, 0.03)",
        medium:     "0 10px 30px -5px rgba(59, 35, 27, 0.08), 0 8px 15px -6px rgba(59, 35, 27, 0.04)",
        large:      "0 25px 60px -12px rgba(59, 35, 27, 0.15)",
        premium:    "0 15px 35px -5px rgba(214, 165, 111, 0.25)", /* gold glow */
        futuristic: "0 8px 30px rgba(214, 165, 111, 0.2)",  /* gold-DEFAULT */
      },
      animation: {
        "fade-in":     "fadeIn 0.5s ease-out",
        "slide-up":    "slideUp 0.5s ease-out",
        "slide-in-r":  "slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":    "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-gold":  "pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":       "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        slideInRight: {
          "0%":   { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        scaleIn: {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: ".5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
}
