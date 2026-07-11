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
        bg: '#ffffff',
        panel: '#fafafa',
        ink: '#0a0a0a',
        cyan: '#00c2d1',
        violet: '#8b6bff',
        magenta: '#ff3d9a',
        green: '#3ef07c',
        muted: '#666666',
        line: '#e8e8e8',
        text: '#0a0a0a',
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
