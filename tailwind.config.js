/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bubblegum: "#ff6fae",
        skyplay: "#6bcaf3",
        sunshine: "#fde047"
      },
      boxShadow: {
        playful: "0 14px 30px -12px rgba(17, 24, 39, 0.28)"
      }
    }
  },
  plugins: []
};
