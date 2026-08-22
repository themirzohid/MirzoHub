import withMT from '@material-tailwind/react/utils/withMT.js';

// MUHIM: Material Tailwind komponentlari to'g'ri ishlashi uchun
// konfiguratsiya withMT() bilan o'ralishi SHART.
export default withMT({
  darkMode: 'class', // <html class="dark"> qo'shilsa - dark rejim yoqiladi
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/@material-tailwind/react/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ---- MIRZOHUB RANG PALITRASI ----
        // bordo  -> asosiy aksent rang (CTA tugmalar, brend rangi)
        // xaki   -> ikkinchi darajali/urg'u rangi
        // siyoh  -> qorong'i neytral (dark mode fon/matn, navbar)
        bordo: {
          50: '#fdf2f4',
          100: '#fbe4e8',
          200: '#f5c9d1',
          300: '#eb9dac',
          400: '#dc6a80',
          500: '#c53f5b',
          600: '#9f2942',
          700: '#7a1e33',
          800: '#5c1727',
          900: '#3d0f1a',
        },
        xaki: {
          50: '#f8f6ee',
          100: '#efe9d5',
          200: '#e2d7b3',
          300: '#d1bf8a',
          400: '#bda766',
          500: '#a68f4f',
          600: '#8a7540',
          700: '#6c5b33',
          800: '#544726',
        },
        siyoh: {
          50: '#eef0f6',
          100: '#dbdfec',
          200: '#b7bfda',
          300: '#7580a8',
          400: '#535d82',
          500: '#3b4166',
          600: '#2a2f4d',
          700: '#1c2038',
          800: '#141728',
          900: '#0b0d18',
          950: '#06070f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
});
