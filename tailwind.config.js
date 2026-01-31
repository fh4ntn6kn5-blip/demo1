/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#F7F8FA',
        accent: {
          purple: '#6366F1',
          'purple-light': '#818CF8',
          'purple-dark': '#4F46E5',
        },
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.04)',
        'soft-lg': '0 4px 12px -2px rgb(0 0 0 / 0.06)',
        'glow': '0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 20px -5px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}
