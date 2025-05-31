import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Trading colors
                'trade-green': '#10b981',
                'trade-red': '#ef4444',
                'trade-blue': '#3b82f6',
                // Custom brand colors
                'primary': {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                'success': {
                    50: '#f0fdf4',
                    500: '#10b981',
                    600: '#059669',
                },
                'danger': {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                'warning': {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                }
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-green': 'pulseGreen 2s infinite',
                'pulse-red': 'pulseRed 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseGreen: {
                    '0%, 100%': { backgroundColor: '#10b981' },
                    '50%': { backgroundColor: '#059669' },
                },
                pulseRed: {
                    '0%, 100%': { backgroundColor: '#ef4444' },
                    '50%': { backgroundColor: '#dc2626' },
                }
            }
        },
    },
    plugins: [],
}
export default config