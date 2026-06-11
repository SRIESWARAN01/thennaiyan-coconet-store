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
          DEFAULT: "#217743", // Thennaiyan emerald green
          deep: "#1a5e35",    // deeper green for focus and active states
          mist: "#e8f5ec",    // subtle light green for badges/backgrounds
        },
        kernel: {
          DEFAULT: "#ffffff", // page background
          deeper: "#f3f4f6",  // light gray backdrop for pills and containers
        },
        oil: {
          DEFAULT: "#fbbf24", // yellow star rating / golden accent
          deep: "#d97706",    // dark amber
        },
        shell: {
          DEFAULT: "#374151", // text-gray-700
          husk: "#9ca3af",    // text-gray-400
        },
        ink: "#111827",       // text-gray-900
      },
      fontFamily: {
        display: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.1", letterSpacing: "0.18em" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        bottle: "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
        stamp: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
