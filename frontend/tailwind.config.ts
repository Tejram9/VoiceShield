import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#090d16",
        surface: {
          base: "#0e1420",
          1: "#131b2b",
          2: "#182235",
          elevated: "#1e2a40",
          overlay: "rgba(14, 20, 32, 0.88)",
        },
        border: {
          subtle: "#1c2536",
          DEFAULT: "#263347",
          strong: "#37465e",
          focus: "#3b82f6",
        },
        content: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
          subtle: "#475569",
        },
        // Semantic risk tokens - calibrated, non-neon, WCAG AA compliant
        risk: {
          safe: "#10b981",
          "safe-subtle": "rgba(16, 185, 129, 0.12)",
          "safe-border": "rgba(16, 185, 129, 0.28)",

          caution: "#f59e0b",
          "caution-subtle": "rgba(245, 158, 11, 0.12)",
          "caution-border": "rgba(245, 158, 11, 0.28)",

          threat: "#ea580c",
          "threat-subtle": "rgba(234, 88, 12, 0.12)",
          "threat-border": "rgba(234, 88, 12, 0.28)",

          critical: "#dc2626",
          "critical-subtle": "rgba(220, 38, 38, 0.14)",
          "critical-border": "rgba(220, 38, 38, 0.32)",

          contained: "#6366f1",
          "contained-subtle": "rgba(99, 102, 241, 0.12)",
          "contained-border": "rgba(99, 102, 241, 0.28)",

          info: "#0284c7",
          "info-subtle": "rgba(2, 132, 199, 0.12)",
          "info-border": "rgba(2, 132, 199, 0.28)",
        },
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "0.9375rem", letterSpacing: "0.02em" }],
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.8125rem", { lineHeight: "1.1875rem" }],
        base: ["0.875rem", { lineHeight: "1.375rem" }],
        md: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.35)",
        raised: "0 2px 6px -1px rgba(0, 0, 0, 0.4), 0 1px 4px -1px rgba(0, 0, 0, 0.3)",
        overlay: "0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 8px -2px rgba(0, 0, 0, 0.4)",
      },
      transitionDuration: {
        DEFAULT: "150ms",
        fast: "100ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
