export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        peblo: { 50: "#f0f7ff", 500: "#3b82f6", 600: "#2563eb", 900: "#1e3a5f" },
        accent: "#f59e0b",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulse2: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease forwards",
        "pulse2": "pulse2 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
