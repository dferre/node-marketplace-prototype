import relumeTailwindPreset from "@relume_io/relume-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [relumeTailwindPreset],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        border: "0 0 0 1px #EAEAEA",
        "border-small": "0 0 0 1px #EAEAEA",
        "border-medium": "0 0 0 1px #EAEAEA",
        "border-large": "0 0 0 1px #EAEAEA",
        menu: "0 0 0 1px #EAEAEA, 0 12px 32px #F2F2F2",
        focus: "0 0 0 2px #FFFFFF, 0 0 0 4px #0072F5",
      },
      colors: {
        background: {
          DEFAULT: "#FAFAFA",
          primary: "#FFFFFF",
          secondary: "#F2F2F2",
          tertiary: "#EBEBEB",
          alternative: "#171717",
          success: "#ECFDF3",
          error: "#FEF3F2",
        },
        border: {
          DEFAULT: "#EAEAEA",
          primary: "#EAEAEA",
          secondary: "#EBEBEB",
          tertiary: "#D4D4D4",
          alternative: "#171717",
          success: "#45A557",
          error: "#E5484D",
        },
        text: {
          DEFAULT: "#171717",
          primary: "#171717",
          secondary: "#666666",
          muted: "#8F8F8F",
          alternative: "#FFFFFF",
          success: "#398E4A",
          error: "#E5484D",
        },
        link: {
          DEFAULT: "#0072F5",
          primary: "#0072F5",
          secondary: "#4D4D4D",
          alternative: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0072F5",
          focus: "#005FCC",
        },
        neutral: {
          DEFAULT: "#666666",
          black: "#171717",
          white: "#FFFFFF",
          lightest: "#FAFAFA",
          lighter: "#F2F2F2",
          light: "#EBEBEB",
          dark: "#4D4D4D",
          darker: "#171717",
          darkest: "#171717",
        },
      },
    },
  },
};
