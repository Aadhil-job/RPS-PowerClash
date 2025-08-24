/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: {
          300: '#A7F3D0',
          400: '#6EE7B7',
          500: '#34D399',
          600: '#10B981'
        }
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace']
      }
    },
  },
  plugins: [],
};