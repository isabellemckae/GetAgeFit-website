import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutral foundation — the "spa lobby" backdrop
        sand: {
          50: "#FDFBF8",
          100: "#FAF6EF",
          200: "#F3EBDD",
          300: "#E9DCC6",
          400: "#D9C6A3",
          500: "#C2A87C",
        },
        ink: {
          50: "#F4F5F3",
          100: "#E4E6E1",
          300: "#9CA39A",
          500: "#5C6459",
          700: "#3A3F37",
          800: "#292D26",
          900: "#1C1F1A",
        },
        // Deep sage green — strength, growth, calm
        sage: {
          50: "#F2F5F1",
          100: "#E1E9DE",
          200: "#C3D3BD",
          300: "#9DB596",
          400: "#77996E",
          500: "#587A4F",
          600: "#44623D",
          700: "#374F31",
          800: "#2C3F28",
          900: "#233220",
        },
        // Dusty plum — warmth, sophistication, humanity
        plum: {
          50: "#F6F1F4",
          100: "#EAE0E7",
          200: "#D3BED0",
          300: "#B896B4",
          400: "#9C7098",
          500: "#7F5580",
          600: "#684369",
          700: "#523553",
          800: "#3E2941",
          900: "#2C1D2F",
        },
      },
      fontFamily: {
        display: [
          "ui-serif",
          "Georgia",
          "Iowan Old Style",
          "Palatino Linotype",
          "serif",
        ],
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1200px",
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(41, 45, 38, 0.18)",
        card: "0 4px 24px -8px rgba(41, 45, 38, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
