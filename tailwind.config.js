/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#063312",
        secondary: "#CBFF99",
        secondarySurface: "#F0F0E8",
        info: "#204877",
        success: "#CBFF99",
        warning: "#FFFC83",
        error: "#721426",
        accent: "#D5F3FF",
        neutralText: "#848484",
        neutralBg: "#CCCABC",
        whiteBg: "#ffffff",
        leave:"#ff3131",
        weekOff: "#cb6ce6",
        onLate:"#aa276e",
      },
      fontSize: {
        heading1: ["48px", { lineHeight: "130%", fontWeight: "700" }],
        heading2: ["36px", { lineHeight: "130%", fontWeight: "500" }],
        heading3: ["28px", { lineHeight: "130%", fontWeight: "500" }],
        heading4: ["22px", { lineHeight: "130%", fontWeight: "500" }],
        bodyLarge: ["18px", { lineHeight: "130%", fontWeight: "500" }],
        bodyRegular: ["16px", { lineHeight: "130%", fontWeight: "400" }],
        bodySmall: ["14px", { lineHeight: "130%", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "130%", fontWeight: "400" }],
        btn1: ["16px", { lineHeight: "130%", fontWeight: "400" }],
        btn2: ["14px", { lineHeight: "130%", fontWeight: "400" }],
        btnAction: ["16px", { lineHeight: "130%", fontWeight: "500" }],
      },
      boxShadow: {
        custom: "5px 5px 15px -5px rgba(0, 0, 0, 0.25)",
        inset: "inset 5px 5px 15px -5px rgba(0, 0, 0, 0.25)"
      },
      dropShadow: {
        custom: "0px 1px 4px rgba(0, 0, 0, 0.25)",
        outerCustom: [
          "0 2px 2px rgba(0, 0, 0, 0.25)",
          "0 5px 5px rgba(0, 0, 0, 0.25)"
        ],
      },
      fontFamily: {
        regular: ["fact-regular", "sans-serif"],
        bold: ["fact-bold", "sans-serif"],
        medium: ["fact-medium", "sans-serif"],
      },
      padding: {
        paddingX: "30px",
      },
      borderRadius:{
        primaryRadius:"20px",
        secondaryRadius:"15px",
      }
    },
  },
  plugins: [],
};
