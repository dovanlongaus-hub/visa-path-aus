/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// UI/UX Pro Max Design System - Trust & Authority Theme
  			// Primary: Navy Blue - Trust, Professionalism
  			primary: {
  				50: '#f0f4f8',
  				100: '#d9e2ec',
  				200: '#bcccdc',
  				300: '#9fb3c8',
  				400: '#829ab1',
  				500: '#1E3A5F', // Navy Blue - Main brand color
  				600: '#102a43',
  				700: '#0a1c2d',
  				800: '#06121d',
  				900: '#030a13',
  				DEFAULT: '#1E3A5F',
  				foreground: '#ffffff'
  			},
  			
  			// Secondary: Gold - Success, Premium, Achievement
  			secondary: {
  				50: '#fffdf0',
  				100: '#fef9d9',
  				200: '#fdf4b3',
  				300: '#fcee8d',
  				400: '#fbe967',
  				500: '#F9C74F', // Gold - Success/achievement
  				600: '#d4a742',
  				700: '#af8735',
  				800: '#8a6728',
  				900: '#65471b',
  				DEFAULT: '#F9C74F',
  				foreground: '#000000'
  			},
  			
  			// Success: Green - Positive outcomes
  			success: {
  				500: '#10b981', // Emerald
  				600: '#059669',
  				DEFAULT: '#10b981',
  				foreground: '#ffffff'
  			},
  			
  			// Warning: Amber - Attention needed
  			warning: {
  				500: '#f59e0b', // Amber
  				600: '#d97706',
  				DEFAULT: '#f59e0b',
  				foreground: '#000000'
  			},
  			
  			// Error: Red - Critical issues
  			error: {
  				500: '#ef4444', // Red
  				600: '#dc2626',
  				DEFAULT: '#ef4444',
  				foreground: '#ffffff'
  			},
  			
  			// Neutral: Professional grays
  			neutral: {
  				50: '#f9fafb',
  				100: '#f3f4f6',
  				200: '#e5e7eb',
  				300: '#d1d5db',
  				400: '#9ca3af',
  				500: '#6b7280',
  				600: '#4b5563',
  				700: '#374151',
  				800: '#1f2937',
  				900: '#111827',
  			},
  			
  			// Backgrounds
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}