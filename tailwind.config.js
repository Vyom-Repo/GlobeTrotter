/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#e8f4ff',
          100: '#c0deff',
          200: '#8ac2ff',
          300: '#55a6ff',
          400: '#2090ff',
          500: '#0073e6',
          600: '#005bcc',
          700: '#0044a3',
          800: '#002e7a',
          900: '#001852',
        },
        surface: {
          canvas: '#EAF2FB',
          raised: '#EEF5FC',
          sunken: '#E3ECF7',
        },
        ink: {
          900: '#0B1E3D',
          700: '#3A4C6B',
          500: '#6B7C99',
          300: '#A7B5CC',
        },
        semantic: {
          success: '#1E9E6D',
          warning: '#D98C2B',
          danger: '#D64545',
        }
      },
      fontFamily: {
        display: ['Lora', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '10px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        'neo-raised': '-6px -6px 14px rgba(255, 255, 255, 0.9), 6px 6px 14px rgba(169, 192, 222, 0.55)',
        'neo-pressed': 'inset -4px -4px 8px rgba(255, 255, 255, 0.9), inset 4px 4px 8px rgba(143, 170, 209, 0.65)',
        'neo-floating': '-8px -8px 20px rgba(255, 255, 255, 0.9), 10px 10px 24px rgba(143, 170, 209, 0.65)',
      }
    },
  },
  plugins: [],
}
