/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // App Router files
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router files
    "./components/**/*.{js,ts,jsx,tsx}", // Component files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
