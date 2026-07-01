/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dbe5f0',
          200: '#b8cce4',
          300: '#8aa9d2',
          400: '#5a80bd',
          500: '#3a5f9e',
          600: '#2b4a80',
          700: '#1f3a66',
          800: '#152a4d',
          900: '#0d1b35',
          950: '#081022',
        },
        green: {
          50: '#edfcf3',
          100: '#d2f8e0',
          200: '#a8efc4',
          300: '#72e0a0',
          400: '#3fc878',
          500: '#1aab5a',
          600: '#0f8a45',
          700: '#0a6c37',
          800: '#0a552e',
          900: '#084527',
        },
        amber: {
          50: '#fff8eb',
          100: '#ffedc6',
          200: '#ffd988',
          300: '#ffbf4a',
          400: '#f99b1f',
          500: '#e07a0a',
          600: '#bc5a05',
          700: '#954008',
          800: '#7a330c',
          900: '#66290e',
        },
        red: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fbcccc',
          300: '#f7a8a8',
          400: '#f07474',
          500: '#e04848',
          600: '#c52e2e',
          700: '#a52222',
          800: '#881f1f',
          900: '#721f1f',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(13, 27, 53, 0.06), 0 1px 2px rgba(13, 27, 53, 0.04)',
        'card-hover': '0 8px 24px rgba(13, 27, 53, 0.10), 0 2px 6px rgba(13, 27, 53, 0.06)',
        ring: '0 0 0 1px rgba(13, 27, 53, 0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.4s ease-out both',
        'spin-slow': 'spin-slow 1.2s linear infinite',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
        'shimmer': 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
