/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./dashboard.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a', /* Added for variety if needed */
          100: '#f4f4f5',
        },
        emerald: {
          400: '#34d399',
        },
        // We can just use default colors, but SRS specified exact codes as "bg-zinc-950". 
        // Tailwind defaults for zinc are correct, so no need to override unless they differ.
        // SRS says "Background: bg-zinc-950". This is standard tailwind.
      }
    },
  },
  plugins: [],
}
