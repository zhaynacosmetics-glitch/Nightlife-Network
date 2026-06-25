import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — extracted from the One Night app UI
        lilac: {
          DEFAULT: "#E9DDFB",
          50: "#F6F1FE",
          100: "#ECE2FC",
          200: "#DCC9F8",
        },
        ink: {
          DEFAULT: "#0B0710",
          800: "#141019",
          700: "#1C1622",
          600: "#2A2233",
        },
        neon: {
          DEFAULT: "#FF2E9A", // hot pink
          soft: "#FF6FBE",
          deep: "#E0148C",
        },
        violet: {
          DEFAULT: "#7C3AED", // electric purple
          soft: "#A78BFA",
          deep: "#5B21B6",
        },
        cyan: {
          DEFAULT: "#22D3EE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(255,46,154,0.55)",
        "glow-violet": "0 0 70px -10px rgba(124,58,237,0.6)",
        phone: "0 40px 90px -20px rgba(11,7,16,0.55), 0 0 0 2px rgba(255,255,255,0.04)",
        card: "0 20px 50px -24px rgba(11,7,16,0.45)",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #FF2E9A 0%, #7C3AED 100%)",
        "violet-gradient": "linear-gradient(135deg, #A78BFA 0%, #7C3AED 60%, #E0148C 100%)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 18s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
