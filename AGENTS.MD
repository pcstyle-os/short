# Project Identity: short (s.pcstyle.dev)

This project follows the **pcstyle** high-performance stack and aesthetic.

## 🛠 Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Convex (Real-time reactive database)
- **Styling**: Tailwind CSS v4 (CSS-first)
- **Runtime**: Bun
- **Icons**: pixel SVGs in `components/Pix.tsx`

## 🎨 Design System: pcstyle.dev desktop
Matches the home site (pcstyle.dev, repo pc-style/homepage): a pixel desktop on a dithered aurora. Shared with upload.pcstyle.dev; keep `components/{Aurora,Desk,Pix,Clock}.tsx` and `app/globals.css` in sync with that repo.
- **Shell**: `components/Desk.tsx` — aurora wallpaper (`Aurora.tsx`, Bayer 8x8), 30px top bar, one window with a dithered title bar, 26px taskbar with the CET clock
- **Colors**: bg #0a0a0b, fg #e8e6e3, dim #8a8782, faint #4a4845, line #252327, magenta #8c1862 for text accents, violet #9d5cff for anything clickable or focused; dither ink #e45aa3, tint #9d5cff, dim #2a1a4d
- **Typography**: Departure Mono (`app/fonts`), lowercase copy, font sizes in multiples of 11px
- **Motifs**: `$ ` fact labels, `##` section labels over a dither rule, square corners everywhere, 1px dithered edge as the only shadow
- **No**: rounded corners, gradients, blur/glow, smooth-scaled pixel art, Lucide-style line icons

## 📁 File Structure
```
short/
├── app/
│   ├── [shortCode]/
│   │   ├── page.tsx         # Redirect handler
│   │   └── not-found.tsx    # 404 for invalid links
│   ├── globals.css          # pcstyle.dev theme tokens
│   ├── layout.tsx           # Root layout with Convex
│   └── page.tsx             # Main shortener page
├── components/
│   ├── ConvexClientProvider.tsx
│   └── LinkShortener.tsx    # Main component
└── convex/
    ├── schema.ts            # Database schema
    └── links.ts             # Mutations & queries
```

## 🔧 Configuration Required

1. Initialize Convex:
```bash
bunx convex dev
```

2. Add environment variables to `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

## 🌐 Domain Setup
Configure `s.pcstyle.dev` to point to your Vercel deployment.

## 🚀 Commands
```bash
bun install          # Install dependencies
bunx convex dev      # Start Convex in dev mode
bun dev              # Start Next.js development server
bun build            # Build for production
```

## 📊 Features
- URL shortening with auto-generated codes
- Custom alias support
- Real-time click tracking
- Recent links display
- Copy-to-clipboard functionality
