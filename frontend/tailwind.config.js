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
        'primary-bg':    '#06080F',
        'secondary-bg':  '#0D1117',
        'card-bg':       '#111827',
        'border-dim':    '#1F2937',
        'accent-green':  '#00FFA3',
        'accent-cyan':   '#00D4FF',
        'accent-red':    '#FF4560',
        'accent-orange': '#FF8C00',
        'accent-yellow': '#FFD60A',
        'text-light':    '#E2E8F0',
        'text-muted':    '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(0,255,163,0.2), 0 0 60px rgba(0,255,163,0.1)',
        'glow-cyan':  '0 0 30px rgba(0,212,255,0.2), 0 0 60px rgba(0,212,255,0.1)',
        'glow-red':   '0 0 30px rgba(255,69,96,0.25), 0 0 60px rgba(255,69,96,0.1)',
      },
    },
  },
  plugins: [],
}