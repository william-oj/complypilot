/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        slate: "#1f2937",
        mint: "#b6f3d3",
        sky: "#d8f1ff",
        clay: "#f7e6d0",
        amber: "#fbbf24",
        coral: "#fb7185",
        moss: "#166534"
      },
      boxShadow: {
        glow: "0 12px 30px rgba(15, 23, 42, 0.18)"
      }
    }
  },
  plugins: []
};
