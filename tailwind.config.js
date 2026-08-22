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
          canvas: '#F4F8FC',
          raised: '#FFFFFF',
          sunken: '#F1F5F9',
        },
        ink: {
          900: '#0F172A',
          700: '#334155',
          500: '#64748B',
          300: '#94A3B8',
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        display: ['Lora', 'serif'],
        sans: ['Lora', 'serif'],
        serif: ['Lora', 'serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(15, 23, 42, 0.12), 0 2px 6px -1px rgba(15, 23, 42, 0.06)',
        'popover': '0 12px 32px -4px rgba(15, 23, 42, 0.15), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
