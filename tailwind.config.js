/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#030303',
        panel: '#0e1424',
        cyan: '#00f0ff',
        violet: '#8b6bff',
        magenta: '#ff3d9a',
        green: '#3ef07c',
        muted: '#8895b0',
        text: '#e8edf8',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        disp: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
