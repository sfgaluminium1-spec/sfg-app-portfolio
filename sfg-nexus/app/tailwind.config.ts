
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Warren Executive Typography
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      letterSpacing: {
        'tight': '-0.025em',
        'wide': '0.025em',
        'wider': '0.05em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-glass': 'var(--gradient-glass)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Warren Executive Industry Colors
        fabrication: {
          DEFAULT: 'hsl(var(--fabrication))',
          light: 'hsl(var(--fabrication-light))',
          dark: 'hsl(var(--fabrication-dark))',
        },
        installation: {
          DEFAULT: 'hsl(var(--installation))',
          light: 'hsl(var(--installation-light))',
          dark: 'hsl(var(--installation-dark))',
        },
        conflict: {
          DEFAULT: 'hsl(var(--conflict))',
          light: 'hsl(var(--conflict-light))',
          dark: 'hsl(var(--conflict-dark))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      // Warren Executive Shadow System
      boxShadow: {
        'warren-sm': 'var(--shadow-sm)',
        'warren-md': 'var(--shadow-md)',
        'warren-lg': 'var(--shadow-lg)',
        'warren-xl': 'var(--shadow-xl)',
        'warren-2xl': 'var(--shadow-2xl)',
      },
      // Warren Executive Animation System
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'warren': 'var(--ease-in-out)',
        'warren-out': 'var(--ease-out)',
        'warren-in': 'var(--ease-in)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fadeInUp': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slideInRight': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.6s var(--ease-out)',
        'slide-in-right': 'slideInRight 0.6s var(--ease-out)',
        'shimmer': 'shimmer 2s infinite',
        'pulse': 'pulse 2s infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      // Warren Executive Spacing Scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Warren Executive Container System
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Custom Warren Executive Plugin
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.warren-glass': {
          background: 'var(--gradient-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.warren-glass-dark': {
          background: 'var(--gradient-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.warren-card': {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.75rem',
          backgroundColor: 'hsl(var(--card) / 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid hsl(var(--border) / 0.5)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.warren-card:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-xl)',
          borderColor: 'hsl(var(--primary) / 0.3)',
        },
        '.warren-btn': {
          position: 'relative',
          overflow: 'hidden',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.warren-btn:hover': {
          transform: 'translateY(-1px)',
        },
        '.warren-input': {
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          border: '1px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.warren-input:focus': {
          outline: 'none',
          boxShadow: '0 0 0 2px hsl(var(--primary) / 0.2), var(--shadow-md)',
          borderColor: 'hsl(var(--primary))',
        },
        '.status-indicator': {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: '50%',
        },
        '.status-indicator::before': {
          content: '""',
          position: 'absolute',
          inset: '0',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          opacity: '0.4',
          animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
