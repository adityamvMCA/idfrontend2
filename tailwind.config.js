/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Scan all JS/TS/JSX/TSX files in src
    "./public/index.html"           // Optional: scan your main HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
