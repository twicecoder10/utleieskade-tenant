/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neutral: {
          // DEFAULT: "",
          50: "#F9FAFB",
          100: "#F2F4F7",
          200: "#EAECF0",
          300: "#D0D5DD",
          400: "#98A2B3",
          500: "#667085",
          600: "#475467",
          700: "#344054",
          800: "#1D2939",
          900: "#101828",
        },

        primary: {
          // DEFAULT: "",
          50: "#F1F7FE",
          100: "#E3EEFB",
          200: "#C0DDF7",
          300: "#89C2F0",
          400: "#4AA3E6",
          500: "#2387D4",
          600: "#156AB4",
          700: "#145DA0",
          800: "#134879",
          900: "#153D65",
        },

        success: {
          // DEFAULT: "",
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },

        warning: {
          // DEFAULT: "",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        error: {
          // DEFAULT: "",
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#F87171",
          400: "#EF4444",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
      },
    },
  },
  plugins: [],
};

