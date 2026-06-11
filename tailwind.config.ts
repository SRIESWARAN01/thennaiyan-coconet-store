import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // The chekku oil palette — derived from the coconut itself,
        // not from a default tailwind ramp.
        leaf: {
          DEFAULT: "#336633", // coconut palm — primary brand
          deep: "#1F4023",    // shadow under the palm
          mist: "#E8EFE5",    // diluted leaf, for subtle surfaces
        },
        kernel: {
          DEFAULT: "#FAF6EC", // warm coconut flesh — page background
          deeper: "#F1EADA",  // section dividers
        },
        oil: {
          DEFAULT: "#D4A24C", // cold-pressed gold — CTAs, accents
          deep: "#A8762A",    // hover state
        },
        shell: {
          DEFAULT: "#3D2817", // coconut shell brown — secondary text
          husk: "#7A5C42",    // muted text
        },
        ink: "#1F2A1F",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // A deliberate scale, not the default tailwind ramp.
        "display-xl": ["clamp(3rem, 7vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.1", letterSpacing: "0.18em" }],
      },
      borderRadius: {
        // No rounded-3xl. Coconut oil bottles have soft, modest curves.
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "10px",
      },
      boxShadow: {
        // Soft, warm shadows — not the harsh default black.
        bottle: "0 20px 40px -20px rgba(61, 40, 23, 0.25)",
        stamp: "inset 0 0 0 1px rgba(61, 40, 23, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
