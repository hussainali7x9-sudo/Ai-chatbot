/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'liquid': 'liquid 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        liquid: {
          '0%, 100%': { 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          },
          '50%': { 
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}