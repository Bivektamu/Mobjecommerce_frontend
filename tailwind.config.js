/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
   container: {
    maxWidth: '1280px'
   },
    extend: {
      animation: {
        'toast-bar': 'bar linear 2s'
      },
      keyframes: {
        bar: {
          '0%': {width:'100%'},
          '100%': {width:'0'}
        }
      },
      colors: {
        'black': '#0E1422',
        'cultured': '#F5F5F5',
        'regal-white': '#F6F6F6'
      },
      gridTemplateColumns: {
        'table': '1fr 3.5fr 1.5fr 1.5fr 2fr 1fr 1fr 1fr',
        'table-order': '3fr 1fr 3fr 2fr 2fr  1fr',
        'ui-table-order': '2.5fr 2.5fr 1fr 1fr 2.5fr 2.5fr',
        // 'ui-table-order': '2.5fr 2.5fr 1.5fr 1.5fr 1.5fr 2.5fr',
        'table-users': '1fr 1fr 2.5fr 3.5fr 2fr  1fr  1fr',
        'table-reviews': '1fr 1.5fr 4fr 1fr 1.5fr 2fr  1fr',
        16:'repeat(16, minmax(0, 1fr))'
      },
      aspectRatio: {
        '2/2.3': '2 / 2.3',
      },
     
    },
  },
  // This tells Tailwind: “Keep these classes even if they don’t appear in files.”
   safelist: [
    'refunded',
    'processing',
    'pending',
    'completed',
    'cancelled',
    'failed',
    'shipped',
  ],
  plugins: [],
};
