/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                main: '#00C853', // Vibrant Green
                'main-dark': '#00C853',
                accent: '#FF7F11', // Orange accent
                surface: '#F3F4F6', // Light gray surface
            },
            fontFamily: {
                sans: ['Archivo', 'sans-serif'],
                display: ['Archivo', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
