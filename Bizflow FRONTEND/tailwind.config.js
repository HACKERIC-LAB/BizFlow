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
          DEFAULT: "#3B7597", // Medium Blue
          dark: "#093C5D", // Dark Blue
          light: "#6FD1D7", // Light Blue/Cyan
          accent: "#5DF8D8", // Bright Aqua/Mint
          soft: "#EAF6F6", // Soft Cyan/Blue for backgrounds
        },
        secondaryTeal: {
          DEFAULT: "#6FD1D7",
          light: "#EAF6F6",
        },
        accent: {
          red: "#F43F5E",
          redLight: "#FFF1F2",
          mint: "#5DF8D8", // Also adding mint here
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
          darkNavy: "#093C5D", // Using the dark blue as dark navy
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
