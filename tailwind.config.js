/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // purple from logo
          light: '#9D68FF',
          dark: '#6025C0',
        },
        secondary: {
          DEFAULT: '#FFD60A', // yellow from logo
          light: '#FFE566',
          dark: '#E6BE00',
        },
        accent: {
          DEFAULT: '#3B82F6', // blue
          light: '#60A5FA',
          dark: '#2563EB',
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        smash: {
          '0%': { transform: 'translateY(-20px) rotate(-20deg)' },
          '30%': { transform: 'translateY(0) rotate(0deg)' },
          '35%': { transform: 'scale(1.1)' },
          '45%': { transform: 'scale(1)' },
          '100%': { transform: 'translateY(-20px) rotate(-20deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        smash: 'smash 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};