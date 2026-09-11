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
        background: "#F8FAFC",
        foreground: "#0F172A",
        // Clean Professional Light Palette
        cyber: {
          950: "#FFFFFF",
          900: "#F8FAFC",
          850: "#F1F5F9",
          800: "#E2E8F0",
          700: "#CBD5E1",
          600: "#94A3B8",
          500: "#64748B",
          400: "#475569",
          300: "#334155",
          100: "#1E293B",
          50: "#0F172A",
        },
        electric: {
          blue: "#3B82F6",
          cyan: "#0284C7",
          teal: "#0D9488",
        },
        threat: {
          red: "#EF4444",
          amber: "#F59E0B",
          green: "#10B981",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#EFF6FF",
          foreground: "#1D4ED8",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#ffffff",
        },
        border: "#E2E8F0",
        input: "#FFFFFF",
        ring: "#3B82F6",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1rem",
        "2xl": "1rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        glass: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        glowBlue: "0 2px 10px rgba(59, 130, 246, 0.15)",
        glowCyan: "0 2px 10px rgba(2, 132, 199, 0.15)",
        glowRed: "0 2px 10px rgba(239, 68, 68, 0.15)",
        glowGreen: "0 2px 10px rgba(16, 185, 129, 0.15)",
        glowAmber: "0 2px 10px rgba(245, 158, 11, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

