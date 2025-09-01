/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neumorphism background colors
        neu: {
          light: '#f0f0f3',
          base: '#e0e5ec',
          dark: '#a3b1c6',
        },
        // Dark mode neumorphism
        neuDark: {
          light: '#3a3a3c',
          base: '#2c2c2e',
          dark: '#1c1c1e',
        }
      },
      boxShadow: {
        // Light neumorphism shadows
        'neu-flat': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        'neu-pressed': 'inset 20px 20px 60px #bebebe, inset -20px -20px 60px #ffffff',
        'neu-button': '9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff',
        'neu-card': '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
        'neu-input': 'inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff',
        
        // Dark neumorphism shadows
        'neu-dark-flat': '20px 20px 60px #252527, -20px -20px 60px #414145',
        'neu-dark-pressed': 'inset 20px 20px 60px #252527, inset -20px -20px 60px #414145',
        'neu-dark-button': '9px 9px 16px #252527, -9px -9px 16px #414145',
        'neu-dark-card': '20px 20px 40px #252527, -20px -20px 40px #414145',
        'neu-dark-input': 'inset 8px 8px 16px #252527, inset -8px -8px 16px #414145',
      },
      borderRadius: {
        'neu': '50px',
        'neu-sm': '20px',
        'neu-lg': '80px',
      }
    },
  },
  plugins: [],
}
