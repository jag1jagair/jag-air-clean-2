/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tailN402FB: '#FFA500', // orange
        tailN208CR: '#ADD8E6', // light blue
        tailN727EX: '#8B4513', // brown
        tailN651CC: '#FF0000', // red
        tailN217EC: '#00008B', // dark blue
        tailN132JC: '#FFFF00', // yellow
        brand: { DEFAULT: '#0f172a' }
      }
    },
  },
  plugins: [],
}
