<img src="./public/favicon.svg" alt="AlwanKit" height="64" width="64">

# AlwanKit

Pick a color, choose a harmony, and [AlwanKit](https://alwankit.com) generates a complete, WCAG accessible color palette for your app or design system, covering every role, every state, light and dark mode. Pure CSS, zero JavaScript.

## What you get

- **Primary, secondary, tertiary** colors with container and on-color variants
- **Surface** colors with five elevation levels
- **Semantic colors:** success, error, warning, info
- **Light & dark mode** both generated from the same base color
- **4 export formats:** CSS, SCSS, Tailwind, JSON

## How it works

1. Open the color picker and set your base color
2. Choose a harmony: `complementary`, `triadic`, `analogous`, or `monochromatic`
3. Preview your palette in light and dark mode
4. Export and drop it into your project

### Under the hood

Everything runs on three CSS custom properties set at the `:root` level:

```css
:root {
  --base-hue: 200;
  --base-saturation: 80%;
  --base-lightness: 50%;
}
```

From these, the entire palette is derived using `hsl()` and `calc()`, no JavaScript touches the colors at any point.

**Harmony** is handled via a `[data-harmony]` attribute on the root element. Each mode applies hue offsets to the secondary and tertiary colors:

```css
:root[data-harmony="complementary"] {
  --secondary-offset: 180;
  --tertiary-offset: 150;
}
```

**Dark mode** is a `[data-theme="dark"]` attribute swap, the same custom properties are redefined with adjusted lightness and saturation values, so the entire theme flips with a single attribute change.

**Accessibility** is enforced through `clamp()`, lightness values are clamped within a safe range so contrast ratios never fall below WCAG minimums, regardless of what base color is picked.

```css
--primary-l-max: clamp(
  20%,
  calc(var(--base-lightness) - var(--primary-s) * 0.2),
  50%
);
```

The result is a self-contained, fully dynamic color system that lives entirely in the CSS cascade.

## Why pure CSS?

No JavaScript means no bundle cost, no layout shift, no hydration issues. The entire system runs on CSS custom properties lightweight, stable, and works in every environment.

## Accessibility

WCAG compliance is built into the generation logic. Every color is auto-adapted to meet contrast standards, you don't run checks, you don't tweak manually.

## Export formats

| Format   | Use case                        |
| -------- | ------------------------------- |
| CSS      | Vanilla CSS or any framework    |
| SCSS     | Sass-based projects             |
| Tailwind | Drop into your Tailwind config  |
| JSON     | Design tokens or custom tooling |

## Get started

Visit **[alwankit.com](https://alwankit.com)**.

Or clone and self-host:

```bash
git clone https://github.com/BadreddineIbril/alwan-kit.git
```

## License

Free to use, fork, and ship in personal and commercial projects.
