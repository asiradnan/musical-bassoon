/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./client/public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
        background: 'var(--background-color)',
        text: 'var(--text-color)',
        'light-text': 'var(--light-text-color)',
        border: 'var(--border-color)',
        error: 'var(--error-color)',
        success: 'var(--success-color)',
      },
    },
  },
  plugins: [],
}