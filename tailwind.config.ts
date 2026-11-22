import type { Config } from "tailwindcss";

// Foodsy palette: "Saffron & Chilli"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        foodsy: {
          yellow: "#FFC928", // brand yellow
          "yellow-soft": "#FFEFB8", // highlights and washes
          red: "#E63932", // chilli red: buttons, stars, accents
          "red-deep": "#C42A24", // hover / pressed
          "red-soft": "#FDE7E5", // error backgrounds
          cream: "#FFF9E9", // page background
          line: "#EFE3C4", // warm borders
          ink: "#292421", // warm charcoal text
          muted: "#7A6E64", // secondary text
          paper: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "panel-in": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.4) rotate(-20deg)" },
          "70%": { opacity: "1", transform: "scale(1.15) rotate(6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0)" },
        },
      },
      animation: {
        "panel-in": "panel-in 220ms ease-out",
        "fade-in": "fade-in 180ms ease-out",
        "fade-up": "fade-up 650ms cubic-bezier(0.22, 1, 0.36, 1) both",
        pop: "pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
