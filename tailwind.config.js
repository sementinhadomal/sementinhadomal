/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f4f4f5",
        card: {
          DEFAULT: "#121215",
          foreground: "#f4f4f5",
          border: "#27272a"
        },
        popover: {
          DEFAULT: "#18181b",
          foreground: "#f4f4f5",
        },
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#3f3f46",
          foreground: "#f4f4f5",
        },
        muted: {
          DEFAULT: "#18181b",
          foreground: "#a1a1aa",
        },
        emeraldCustom: {
          500: "#10b981",
          400: "#34d399",
          900: "#064e3b"
        },
        roseCustom: {
          500: "#f43f5e",
          400: "#fb7185",
          900: "#881337"
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};
