import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Fonts ──
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans:  ["var(--font-sans)",  "DM Sans",            "system-ui", "sans-serif"],
      },

      // ── Colors ──
      colors: {
        bg: {
          primary:   "#0B0B0B",
          secondary: "#111111",
          card:      "#161616",
          offwhite:  "#F5F5F5",
        },
        text: {
          primary:   "#FFFFFF",
          secondary: "#A0A0A0",
          muted:     "#5A5A5A",
          dark:      "#0B0B0B",
        },
        accent: {
          DEFAULT: "#D6C3A3",
          dim:     "#B5A485",
        },
      },

      // ── Spacing ──
      spacing: {
        section: "8rem",
        "section-sm": "5rem",
      },

      // ── Max widths ──
      maxWidth: {
        klin: "1400px",
      },

      // ── Letter spacing ──
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },

      // ── Animations ──
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":  "fade-up 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
        "fade-in":  "fade-in 1s ease forwards",
        shimmer:    "shimmer 2s infinite linear",
        "slide-up": "slide-up 0.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
      },

      // ── Transition timing ──
      transitionTimingFunction: {
        premium: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;