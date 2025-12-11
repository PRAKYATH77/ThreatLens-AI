/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'primary-bg': '#0A0A10', // Dark Mode Background
        'secondary-bg': '#1E293B', // Card background
        'accent-red': '#EF4444', 
        'accent-green': '#10B981', 
        'text-light': '#E2E8F0', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}