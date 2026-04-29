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
          DEFAULT: "#0D9488", // Teal 600
          dark: "#0F766E", // Teal 700
          light: "#2DD4BF", // Teal 400
          soft: "#F0FDFA", // Teal 50
        },
        secondaryTeal: {
          DEFAULT: "#99F6E4", // Teal 200
          light: "#F0FDFA",
        },
        accent: {
          red: "#F43F5E",
          redLight: "#FFF1F2",
        },
        mpesa: {
          green: "#059669",
          muted: "#D1FAE5",
        },
        gold: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        neutral: {
          darkNavy: "#0f172a", // Slate 900
          textMid: "#475569", // Slate 600
          textLight: "#94a3b8", // Slate 400
          border: "#e2e8f0", // Slate 200
          background: "#f8fafc", // Slate 50
          cardBg: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Poppins", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        card: "1.5rem", // Larger rounded corners
        button: "1rem",
        input: "0.875rem",
        badge: "9999px",
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      boxShadow: {
        subtle: "0 2px 10px 0 rgb(0 0 0 / 0.05)",
        medium: "0 10px 30px -5px rgb(0 0 0 / 0.12), 0 8px 15px -6px rgb(0 0 0 / 0.08)",
        large: "0 25px 60px -12px rgb(0 0 0 / 0.18)",
        futuristic: "0 8px 30px rgba(13, 148, 136, 0.3)", // Stronger Teal shadow
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
