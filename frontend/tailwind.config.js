/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        lora: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        accent: {
          50: 'var(--palette-accent-50, #e8f4ff)',
          100: 'var(--palette-accent-100, #c0deff)',
          200: 'var(--palette-accent-200, #8ac2ff)',
          300: 'var(--palette-accent-300, #55a6ff)',
          400: 'var(--palette-accent-400, #2090ff)',
          500: 'var(--palette-accent-500, #0073e6)',
          600: 'var(--palette-accent-600, #005bcc)',
          700: 'var(--palette-accent-700, #0044a3)',
          800: 'var(--palette-accent-800, #002e7a)',
          900: 'var(--palette-accent-900, #001852)',
        },
        brand: {
          50: '#e8f4ff',
          100: '#c0deff',
          500: '#0073e6',
          600: '#005bcc',
          700: '#0044a3',
        }
      }
    },
  },
  plugins: [],
}
