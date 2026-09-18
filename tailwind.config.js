/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro"',
          'system-ui',
          'sans-serif',
        ],
        jost: ['"Jost"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#020712',
          900: '#061124',
          800: '#0b1e3d',
          700: '#102d5c',
        },
        apple: {
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          'blue-active': '#0062c4',
        },
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-subtle': 'subtlePulse 3.5s ease-in-out infinite',
        'spin-slow': 'spin 7s linear infinite',
        'spin-fast': 'spin 3s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 4s ease-in-out infinite',
        'aurora-1': 'aurora1 18s ease-in-out infinite alternate',
        'aurora-2': 'aurora2 24s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
        'scale-spring': 'scaleSpring 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        subtlePulse: {
          '0%, 100%': { opacity: '0.88', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.025)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '35%, 100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
        aurora1: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(70px, -50px, 0) scale(1.18)' },
          '100%': { transform: 'translate3d(-40px, 30px, 0) scale(0.95)' },
        },
        aurora2: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1.1)' },
          '50%': { transform: 'translate3d(-60px, 40px, 0) scale(0.9)' },
          '100%': { transform: 'translate3d(50px, -30px, 0) scale(1.12)' },
        },
        ripple: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.1)', opacity: '0.9' },
          '100%': { transform: 'translate(-50%, -50%) scale(2.8)', opacity: '0' },
        },
        scaleSpring: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}


