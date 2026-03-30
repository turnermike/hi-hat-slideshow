/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          'bg': "#0A0A0F",
          'surface': "#1A1A24",
          'border': "#2D2D3A",
        },
        'primary': "#6366F1",
        'secondary': "#8B5CF6",
        'success': "#10B981",
        'error': "#EF4444",
        'text': {
          'primary': "#F9FAFB",
          'secondary': "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
};
