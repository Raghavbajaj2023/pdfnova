# PDFNOVA - Online PDF Platform

## Overview
PDFNOVA is a browser-based PDF tools platform with 28+ tools for editing, converting, compressing, and managing PDF files. All processing happens locally in the user's browser - no server uploads. Completely free with no limits.

## Architecture
- **Frontend**: React + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Express.js (minimal - serves static files)
- **PDF Processing**: pdf-lib (manipulation), pdfjs-dist (rendering)
- **Routing**: wouter
- **Styling**: Dark/light mode, violet-cyan dual-color scheme, glassmorphism, floating animations

## Key Pages
- `/` - Premium landing page with floating animations, parallax scroll, stats, features, testimonials, FAQ, CTA
- `/tools` - Tools directory with search, categories, animated grid pattern
- `/edit-pdf` - Full PDF editor with text, draw, highlight tools
- `/merge-pdf` - Merge multiple PDFs
- `/split-pdf` - Split PDF by page ranges
- `/compress-pdf` - Compress PDF files
- `/rotate-pdf` - Rotate PDF pages
- `/delete-pages` - Delete specific pages
- `/extract-pages` - Extract specific pages
- `/organize-pages` - Reorder pages
- `/pdf-to-jpg` - Convert PDF to JPG images
- `/jpg-to-pdf` - Convert images to PDF
- `/pdf-to-png` - Convert PDF to PNG images
- `/add-watermark` - Add text watermarks
- `/number-pages` - Add page numbers
- Plus 12+ additional tool pages using generic tool template

## File Structure
- `client/src/pages/` - Page components
- `client/src/components/` - Shared components
  - `navbar.tsx` - Navbar with scroll detection, animated active indicator, theme toggle, command palette trigger
  - `footer.tsx` - Footer with social links, animated hover effects
  - `file-upload.tsx` - Drag-and-drop upload with spring animations
  - `tool-page-layout.tsx` - Shared tool page wrapper with animated background
  - `upgrade-modal.tsx` - Stubbed out (no-op, app is completely free)
  - `animated-background.tsx` - Floating gradient orbs with morphing shapes, grid pattern, floating shapes, particles
  - `command-palette.tsx` - Cmd+K command palette for quick tool search
  - `cursor-effects.tsx` - Global mouse-following radial gradient spotlight
  - `page-transition.tsx` - AnimatePresence route transitions with fade/slide
  - `marquee.tsx` - Infinite scrolling tool showcase (two rows, opposite directions, CSS-based seamless loop)
  - `confetti.tsx` - Particle explosion hook (useConfetti) fired on CTA clicks, with proper cleanup
  - `feature-showcase.tsx` - Interactive tabbed feature section (Privacy, Speed, Power) with animated panel switching
  - `text-rotator.tsx` - Cycling hero words with 3D flip animation ("Instantly", "Securely", "For Free", "With Ease", "Offline")
  - `floating-pdf.tsx` - Animated 3D floating PDF document mockup in hero section (desktop only)
  - `how-it-works.tsx` - 4-step animated timeline with connecting gradient lines and parallax background
  - `comparison-slider.tsx` - Draggable before/after PDF compression comparison with accessible slider (keyboard + pointer)
  - `scroll-reveal-section.tsx` - Scroll-linked platform compatibility cards with animated progress line
  - `horizontal-scroll.tsx` - Scroll-driven horizontal tool card gallery with spring physics
  - `trust-badges.tsx` - 6 animated trust/security badges with hover effects
  - `animated-stats-bar.tsx` - Scroll-triggered progress bars with one-shot shimmer effect
  - `ripple-button.tsx` - Material-style ripple effect button with proper cleanup
  - `animated-logo.tsx` - SVG draw-on animation for PDFNOVA brand mark
- `client/src/lib/tools-data.ts` - Tool definitions and categories
- `client/src/lib/usage-tracker.ts` - Stubbed out (always allows actions, app is completely free)
- `client/src/lib/theme.tsx` - Dark/light mode ThemeProvider with localStorage persistence

## Pricing
- Completely free with no limits. No pricing page, no Pro plan, no upgrade prompts.

## Theme & Design System
- Dark/light mode toggle in navbar (persisted to localStorage)
- Dark mode default, flash-free via inline script in index.html
- Violet primary (#8b5cf6), cyan accent (#06b6d4), pink highlight (#ec4899)
- Premium glassmorphism cards (`.glass-card-premium`) with theme-aware backgrounds
- Animated gradient text (`.gradient-text-hero`) with violet-to-cyan gradient
- Shimmer border animations (`.shimmer-border`)
- Button glow effects (`.btn-glow`)
- Apple-style floating animations: morphing gradient orbs, floating geometric shapes, levitating elements
- Noise texture overlay (`.noise-bg`)
- Inter + Plus Jakarta Sans fonts
- All components use `text-foreground`, `text-muted-foreground`, `bg-background` for theme compatibility
- CSS: `dark:` prefix classes throughout for proper dark/light support

## Animation System (Apple-style)
- `client/src/hooks/use-animations.ts` - Reusable animation hooks:
  - `useScrollReveal` - Intersection Observer-based scroll-triggered reveals
  - `useParallax` - Parallax scrolling with spring physics
  - `useSectionScale` - Section scale-on-scroll effect
  - `useCountUp` - Animated number counter with RAF cleanup
  - `useMagneticHover` - Magnetic cursor-following on buttons
  - `use3DTilt` - 3D perspective tilt on card hover
  - `useTextReveal` - Text visibility trigger
  - Pre-built variants: heroVariants, heroChildVariants, sectionReveal, cardReveal, slideFromLeft/Right, scaleUp, rotateIn
- Word-by-word text reveal (`AnimatedText` component) on scroll
- 3D card tilt on hover for all tool cards, highlight cards, testimonial cards
- Magnetic button effects on all CTA buttons
- Scroll progress bar (gradient line at top of every page)
- Parallax hero with smooth spring-based scroll tracking
- Staggered card reveals with custom delay per card
- Animated star ratings that spin in one by one
- Rotating sparkles icon in badges
- FAQ expand animation
- Footer links stagger in from left on scroll
- Particle positions use deterministic seeds (not Math.random) for stable rerenders

## Features
- Dark/Light mode toggle (accessible from navbar at all times)
- Command Palette (Cmd+K) for quick tool navigation
- Scroll-responsive navbar with transparency and saturated backdrop blur
- Animated active nav indicator with layout animations
- Parallax hero section with scroll-linked opacity, scale, and Y movement
- Apple-style floating morphing gradient orbs (4 orbs, different colors)
- HeroGlow component with pulsing radial + rotating conic gradient
- Floating geometric shapes with rotation and scale animations
- 12 floating particles with deterministic positions
- Stats counter section with count-up animation and hover interactions
- Premium testimonial cards with 3D tilt and animated star ratings
- FAQ accordion with expand animations
- Grid pattern overlays
- ScrollProgress bar on every page
- All PDF tools with real processing (client-side)
- No usage limits, no file size limits
- Cursor spotlight effect following mouse globally (desktop only)
- Page transitions (fade/slide) between all routes via AnimatePresence
- Tool marquee (two rows scrolling in opposite directions) on landing page
- Confetti particle burst on CTA button clicks
- Feature showcase with interactive tabs and animated panel switching
- Text rotator cycling through words with 3D flip animation in hero
- Floating 3D PDF mockup in hero section (desktop only)
- CSS marquee uses seamless -50% translateX loop with duplicated items
- All animations respect prefers-reduced-motion media query
- "How It Works" animated 4-step timeline with connecting gradient lines
- Comparison slider (draggable before/after) for PDF compression showcase
- Scroll-linked platform compatibility section
- Horizontal scroll tool gallery driven by page scroll
- Trust badges section with 6 animated badges
- Animated progress bars that fill on scroll with one-shot shimmer
- Landing page section order: Hero > Stats > TrustBadges > Marquee > Highlights > FeatureShowcase > HowItWorks > ToolsGrid > HorizontalScroll > ComparisonSlider > ScrollReveal > StatsBars > Testimonials > FAQ > CTA > Footer
