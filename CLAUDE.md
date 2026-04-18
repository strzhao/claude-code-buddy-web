@AGENTS.md

# Design System — Pixel Art × Sage Green

## Color Tokens

All UI must use semantic CSS custom property tokens via Tailwind utility classes. Never use raw Tailwind palette classes (e.g. `bg-gray-50`, `text-blue-600`).

### Core Tokens

| Utility class | Purpose |
|---------------|---------|
| `bg-canvas` | Page background |
| `bg-surface` | Cards, containers |
| `bg-surface-alt` | Code blocks, alternate rows |
| `text-ink` | Primary body text |
| `text-secondary` | Labels, metadata |
| `text-muted` | Descriptions, hints, placeholders |
| `bg-primary` / `text-primary` | Brand Sage green — buttons, CTAs, active tabs |
| `bg-primary-hover` | Hover state for brand elements |
| `bg-primary-mist` | Subtle brand background fill |
| `text-primary-text` | Text on brand-colored backgrounds |

### Semantic Status Tokens

| Prefix | Purpose |
|--------|---------|
| `success` / `success-light` / `success-text` | Approved, upload success |
| `warning` / `warning-light` / `warning-text` | Pending review |
| `error` / `error-light` / `error-text` | Rejected, errors, delete |
| `info` / `info-light` / `info-text` | Links, informational |

### Border & Focus

| Utility | Purpose |
|---------|---------|
| `border-border` | Default subtle border |
| `border-border-strong` | Input borders, emphasized |
| `border-border-pixel` | Pixel-art hard border (used by `.pixel-border`) |
| `ring-focus` / `border-focus` | Focus rings and borders |

## Pixel Art Utility Classes

Defined in `globals.css`, compose with Tailwind utilities:

| Class | Effect |
|-------|--------|
| `.pixel-shadow-sm` | 2px hard-edge box shadow |
| `.pixel-shadow` | 3px hard-edge box shadow |
| `.pixel-shadow-lg` | 4px hard-edge box shadow |
| `.pixel-shadow-layered` | Double-step shadow |
| `.pixel-shadow-primary` | Brand-colored shadow |
| `.pixel-border` | 2px solid pixel border |
| `.pixel-border-primary` | 2px brand-colored border |
| `.pixel-corners` | CSS pseudo-element L-bracket corner decorations |
| `.pixel-render` | `image-rendering: pixelated` for sprites |
| `.pixel-heading` | Geist Mono font, bold, tracked |
| `.pixel-btn-active` | :active press translate + shadow removal |
| `.pixel-divider` | 2px dashed divider |

## Theme System

- Light/dark toggle via `.dark` class on `<html>`
- `ThemeProvider` (client component) manages state via React Context + localStorage
- Inline `<script>` in layout prevents flash of wrong theme (FOWT)
- All semantic tokens have both light and dark values in `globals.css`

## UI Patterns

- **Cards**: `rounded bg-surface pixel-border pixel-shadow-sm`
- **Primary buttons**: `rounded bg-primary text-primary-text pixel-shadow-sm pixel-btn-active hover:bg-primary-hover`
- **Secondary buttons**: `rounded border border-border-strong bg-surface text-secondary pixel-shadow-sm pixel-btn-active`
- **Status badges**: `border-2 font-mono text-[10px] uppercase tracking-wider` + status tokens
- **Sprite images**: Always add `pixel-render` class
- **Headings**: Use `pixel-heading` for page titles
