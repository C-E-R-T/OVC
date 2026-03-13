/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2FA36B",
        "primary-light": "#5BC58C",
        "primary-soft": "#EAF6EF",
        "section-gray": "#F5F6F7",
        "text-main": "#1A1A1A",
        "text-sub": "#6B7280",
      },
    },
  },
  plugins: [],
}