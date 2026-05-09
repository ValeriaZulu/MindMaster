/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'master-dark': '#080C14',   // Fondo oscuro
                'master-purple': '#9D4EDD', // Morado neón
                'master-gold': '#FFC300',   // Dorado monedas
            },
        },
    },
    plugins: [],
}