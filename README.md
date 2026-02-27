<svg width="64" height="64" viewBox="0 0 164 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linejoin="miter" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
    d="M75.1197 125.055C75.8252 123.833 76.4983 122.607 77.139 121.379C77.7797 122.607 78.4528 123.833 79.1582 125.055C94.0699 150.883 117.79 165.105 132.139 156.82C146.488 148.536 146.031 120.883 131.12 95.0549C130.961 94.7806 130.802 94.5076 130.642 94.2359C155.377 79.2814 168.787 56.298 160.688 42.2708C153.656 30.0903 132.666 28.5785 110.683 37.5215C106.764 15.9073 95.4743 0.290039 82.1578 0.290039C68.9957 0.290039 57.8134 15.5473 53.7716 36.7722C31.5689 27.5519 10.2552 28.9782 3.15782 41.2712C-4.22275 54.0547 6.26038 74.2766 26.8993 89.0811C25.602 90.9943 24.3519 92.9874 23.1582 95.0549C8.24651 120.883 7.79019 148.536 22.139 156.82C36.4877 165.105 60.208 150.883 75.1197 125.055Z"></path>
</svg>

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
git clone https://github.com/BadreddineIbril/alwankit.git
```

## License

Free to use, fork, and ship in personal and commercial projects.
