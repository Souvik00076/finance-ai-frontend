# Next.js 15.5.12 Boilerplate

A modern Next.js boilerplate with custom theming, shadcn/ui components, and Tailwind CSS v4.

## Features

- **Next.js 15.5.12** - Latest Next.js with App Router
- **TypeScript** - Full TypeScript support
- **Tailwind CSS v4** - Latest Tailwind with custom configuration
- **shadcn/ui** - Beautiful, accessible component library
- **Custom Theme System** - Separated CSS constants for easy customization
- **Dark Mode** - Built-in dark mode support
- **Custom Fonts** - DM Sans for UI, JetBrains Mono for code
- **Custom Utilities** - Glass morphism, gradients, and glow effects

## Project Structure

```
finance-ai-frontend/
├── app/
│   ├── styles/
│   │   └── theme-constants.css    # All color and theme constants
│   ├── globals.css                 # Global styles and utilities
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   └── ui/                         # shadcn/ui components (add as needed)
├── lib/
│   └── utils.ts                    # Utility functions
├── hooks/                          # Custom React hooks
└── public/                         # Static assets
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Theme Customization

All theme constants are defined in `app/styles/theme-constants.css`. This file contains:

- **Color Variables** - Primary, secondary, accent, destructive, muted colors
- **Sidebar Colors** - Dedicated sidebar theme variables
- **Chart Colors** - 6 chart color variables for data visualization
- **Custom Tokens** - Success, warning, expense colors
- **Gradients** - Pre-defined gradient variables
- **Shadows** - Custom glow effects

### Modifying Colors

Edit `app/styles/theme-constants.css` to customize your theme:

```css
:root {
  --primary: 168 80% 40%;  /* HSL format */
  --primary-foreground: 0 0% 100%;
  /* ... other colors */
}
```

### Dark Mode

Dark mode colors are automatically applied when the `.dark` class is present. Customize dark mode colors in the `.dark` section of `theme-constants.css`.

## Adding shadcn/ui Components

Install individual components as needed:

```bash
# Example: Add a button component
npx shadcn@latest add button

# Example: Add a card component
npx shadcn@latest add card

# Example: Add multiple components
npx shadcn@latest add button card dialog
```

Components will be added to `components/ui/` and are ready to use.

## Custom Utilities

### Glass Card
```tsx
<div className="glass-card">
  Content with glass morphism effect
</div>
```

### Stat Glow
```tsx
<div className="stat-glow">
  Content with subtle glow effect
</div>
```

### Gradient Text
```tsx
<h1 className="gradient-text">
  Beautiful gradient text
</h1>
```

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Typography

- **Body Font:** DM Sans (400, 500, 600, 700)
- **Mono Font:** JetBrains Mono (400, 500)

Fonts are loaded from Google Fonts and configured in `globals.css`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org/docs)

## License

MIT
