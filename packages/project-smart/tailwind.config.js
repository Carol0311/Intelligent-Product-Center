/** @type {import('tailwindcss').Config} */
import { fileURLToPath, URL } from "node:url";
export default {
  content: [
    "./index.html",
    "./app/**/*.{vue,js,ts,jsx,tsx}",
    fileURLToPath(
      new URL("../shared/src/**/*.{vue,js,ts,jsx,tsx}", import.meta.url),
    ),
  ],
  theme: {
    extend: {
      colors: {
        carol: {
          500: "#ff6573",
        },
      },
    },
  },
  plugins: [],
};
