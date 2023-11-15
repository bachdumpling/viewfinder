/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inconsolata: ["Inconsolata", "ui-sans-serif", "system-ui"],
        // You can also define other font types like 'serif', 'mono' etc.
      },
    },
  },
  plugins: [],
};
