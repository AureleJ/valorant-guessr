/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": '#f3f4f6',
                "secondary": '#FF4655',
                "secondary-hover": '#FF2B3D',
                "background": '#0F1923',
                "shadow": '#0F1923',
                "secondary-background": '#1F2731',
                "card-background": '#1F2731',
                "emerald": {
                    300: '#6ee7b7',
                    500: '#10b981',
                    600: '#059669',
                    800: '#065f46',
                },
                "blue": {
                    500: '#3b82f6',
                    600: '#2563eb',
                },
                "yellow": {
                    500: '#eab308',
                    600: '#ca8a04',
                },
                "red": {
                    500: '#ff6b79',
                    600: '#fd4556',
                    700: '#f03e3e',
                },
            },
            keyframes: {
                notification: {
                    '0%': {transform: 'translateY(20px)', opacity: '0'},
                    '5%': {transform: 'translateY(0)', opacity: '1'},
                    '95%': {transform: 'translateY(0)', opacity: '1'},
                    '100%': {transform: 'translateY(20px)', opacity: '0'},
                },
                shrink: {
                    '0%': {width: '100%'},
                    '100%': {width: '0%'},
                }
            },
            animation: {
                notification: 'notification 2s ease-in-out forwards',
                shrink: 'shrink 1.5s linear forwards',
            },
        },
    },
    plugins: [],
};