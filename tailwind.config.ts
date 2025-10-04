import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['apps/web/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#D32F2F',
          'primary-dark': '#B71C1C'
        },
        ink: {
          DEFAULT: '#111111',
          muted: '#565B62'
        },
        bg: {
          DEFAULT: '#FFFFFF',
          alt: '#F7F7F8'
        },
        border: '#E6E7EA',
        accent: '#1E88E5',
        success: '#2E7D32',
        warning: '#ED6C02',
        danger: '#C62828'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        pill: '999px'
      },
      boxShadow: {
        card: '0 6px 20px rgba(0,0,0,0.08)',
        elevated: '0 12px 32px rgba(0,0,0,0.12)',
        focus: '0 0 0 3px rgba(211,47,47,0.25)'
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px'
      },
      fontSize: {
        display: '40px',
        h1: '32px',
        h2: '24px',
        h3: '20px',
        body: '16px',
        caption: '13px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial']
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      letterSpacing: {
        tight: '-0.01em',
        normal: '0',
        wide: '0.01em'
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.12s ease-out',
        'shimmer': 'shimmer 0.8s ease-in-out infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ]
};

export default config;
