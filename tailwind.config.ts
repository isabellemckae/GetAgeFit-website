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
        // ⚠️ Demo #1 palette — NOT the approved Get Age Fit brand colors.
        // The governing New Website Master Reference calls for Get Age
        // Fit's established blue + lime/green + purple accent, but does
        // not supply hex values. Do not treat sand/ink/sage/plum below as
        // final; they remain in place only so the existing app keeps
        // rendering while the redesign proceeds incrementally. See
        // docs/CONTENT-STATUS.md for status. Real values, once supplied,
        // should land in the `brand` group below rather than by editing
        // these in place, so call sites can migrate deliberately.

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

        // Placeholder brand-color architecture — PROMPT (New Website
        // Master Reference §16, §22) requires Get Age Fit's established
        // blue + lime/green + purple accent, values not yet supplied.
        // Every slot below intentionally reuses the same generic,
        // undesigned gray scale — not a color choice, a filing cabinet.
        // Nothing in the app consumes `brand.*` yet; components adopt it
        // deliberately, section by section, once real hex values arrive.
        // Do NOT assign a "nice" color here — that would be inventing a
        // palette, which is explicitly out of scope until the real brand
        // values are supplied. See docs/CONTENT-STATUS.md.
        brand: {
          blue: {
            100: "#E5E7EB",
            300: "#9CA3AF",
            500: "#6B7280",
            700: "#374151",
            900: "#111827",
          },
          lime: {
            100: "#E5E7EB",
            300: "#9CA3AF",
            500: "#6B7280",
            700: "#374151",
            900: "#111827",
          },
          purple: {
            100: "#E5E7EB",
            300: "#9CA3AF",
            500: "#6B7280",
            700: "#374151",
            900: "#111827",
          },
        },
      },
      fontFamily: {
        // Values resolve via CSS custom properties defined in
        // globals.css (--font-display / --font-sans), currently pointing
        // at system font stacks. This indirection is the "clean
        // insertion" seam for Demo #2 decision #4: once a real typeface
        // is approved, it's wired in globals.css (e.g. a next/font
        // variable) in one place — nothing here or at any component call
        // site needs to change. No font is installed yet.
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
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
