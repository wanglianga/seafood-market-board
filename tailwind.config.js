/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ocean: {
          950: "#040E1A",
          900: "#0A2540",
          800: "#0F3460",
          700: "#1A4B8C",
          600: "#2563A8",
          500: "#3B82C4",
        },
        coral: {
          500: "#FF6B35",
          600: "#E85A28",
          700: "#CC4A1C",
        },
        jade: {
          400: "#34D399",
          500: "#00C48C",
          600: "#00A376",
        },
        amber: {
          500: "#FF3B30",
          600: "#E0332A",
        },
        foam: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
        },
      },
      fontFamily: {
        price: ['"JetBrains Mono"', "monospace"],
        body: ['"Noto Sans SC"', "sans-serif"],
      },
      animation: {
        "breathe": "breathe 2s ease-in-out infinite",
        "breathe-red": "breathe-red 1s ease-in-out infinite",
        "float-up": "float-up 6s ease-in infinite",
        "wave": "wave 8s ease-in-out infinite",
        "slide-in": "slide-in 0.4s ease-out",
        "flip-in": "flip-in 0.5s ease-out",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.85)" },
        },
        "breathe-red": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "float-up": {
          "0%": { transform: "translateY(100%) scale(0.5)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.1" },
          "100%": { transform: "translateY(-100vh) scale(1)", opacity: "0" },
        },
        wave: {
          "0%, 100%": { transform: "translateX(0) scaleY(1)" },
          "50%": { transform: "translateX(-25%) scaleY(1.1)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "flip-in": {
          "0%": { opacity: "0", transform: "rotateX(90deg)" },
          "100%": { opacity: "1", transform: "rotateX(0deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
