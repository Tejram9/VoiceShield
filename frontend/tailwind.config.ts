import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Enterprise SOC Dark Palette
        soc: {
          950: "#06090F", // Deepest viewport void
          900: "#0B0F19", // Base workspace background
          850: "#0F1624", // Canvas surface
          800: "#151F32", // Primary panel / card surface
          750: "#1B273F", // Elevated card / header
          700: "#22314E", // Borders & subtle dividers
          600: "#324468", // Interactive borders / hover
          500: "#4B618D", // Muted metadata
          400: "#798DB5", // Secondary text
          300: "#A6B7D4", // Subtle text
          200: "#D1DBEC", // High-contrast text
          100: "#EDF2FA", // Pure highlights
          50: "#F8FAFC",
        },
        // 4-Tier Risk Colors
        risk: {
          low: "#10B981",
          "low-glow": "rgba(16, 185, 129, 0.2)",
          medium: "#F59E0B",
          "medium-glow": "rgba(245, 158, 11, 0.2)",
          high: "#F97316",
          "high-glow": "rgba(249, 115, 22, 0.2)",
          critical: "#EF4444",
          "critical-glow": "rgba(239, 68, 68, 0.25)",
        },
        // Signal Category Accents
        signal: {
          voice: "#38BDF8",     // Acoustic / Vocoder / Audio
          speaker: "#A855F7",   // Biometric ECAPA-TDNN Match
          intent: "#F43F5E",    // Conversational Coercion / Urgency
          context: "#EAB308",   // Carrier / Line / Telephony Context
          fusion: "#6366F1",    // Mathematical Risk Fusion
        },
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
          hover: "#1D4ED8",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        panel: "0 2px 8px -1px rgba(0, 0, 0, 0.4), 0 1px 3px -1px rgba(0, 0, 0, 0.3)",
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        elevated: "0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
