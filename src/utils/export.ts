import { COLORS } from "./constants";
import Color from "./color";
import { extractRGB } from "./helpers";

function getColors(theme: "light" | "dark" = "light") {
  const element = document.createElement("div");
  if (theme === "dark") element.dataset.theme = "dark";

  const formats = document.querySelectorAll<HTMLInputElement>(
    '[name="color-format"]',
  );
  let format = localStorage.getItem("color-format") ?? "hsl";

  formats.forEach((f) => {
    f.checked = f.value === format;
    f.onchange = (e) => {
      format = (e.target as HTMLInputElement)?.value ?? "hsl";
      localStorage.setItem("color-format", format);
    };
  });

  localStorage.setItem("color-format", format);
  document.querySelector("[data-code]")?.appendChild(element);

  const styles = getComputedStyle(element);

  const colors = Object.fromEntries(
    COLORS.map((name) => {
      element.style.color = `var(--color-${name})`;
      const { r, g, b } = extractRGB(styles.color);
      const color = new Color(r, g, b);

      return [
        name,
        color[
          `to${format[0].toUpperCase()}${format.slice(1)}` as keyof Color
        ]?.() ?? styles.color,
      ];
    }),
  );

  element.remove();
  return colors;
}

const mapToBlock = (
  obj: Record<string, string>,
  format: (k: string, v: string) => string,
) =>
  Object.entries(obj)
    .map(([k, v]) => format(k, v))
    .join("\n");

const highlight = (code: string) =>
  code
    .replace(
      /(:|\(|\)|{|}|\[|\]|,)/g,
      `<span data-highlight='character'>$1</span>`,
    )
    .replace(/"(.*?)"/g, `"<span data-highlight='key'>$1</span>"`)
    .replace(/(hsl\(.*?\))/g, `<span data-highlight='value'>$1</span>`);

function exportRawColors() {
  const light = getColors("light");
  const dark = getColors("dark");

  const css = `:root {
${mapToBlock(light, (k, v) => `  --color-${k}: ${v};`)}
}

[data-theme="dark"] {
${mapToBlock(dark, (k, v) => `  --color-${k}: ${v};`)}
}`;

  const scss = `$colors-light: (
${mapToBlock(light, (k, v) => `  "${k}": ${v},`)}
);

$colors-dark: (
${mapToBlock(dark, (k, v) => `  "${k}": ${v},`)}
);`;

  const json = JSON.stringify({ light, dark }, null, 2);

  const tailwind = `export default {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
  ${mapToBlock(
    light,
    (k) => `      "${k}": "hsl(var(--color-${k}) / &lt;alpha-value&gt;)",`,
  )}
      }
    }
  }
}`;

  return { css, scss, json, tailwind };
}

function exportHighlightedColors() {
  const raw = exportRawColors();

  return {
    css: highlight(raw.css),
    scss: highlight(raw.scss),
    json: highlight(raw.json),
    tailwind: highlight(raw.tailwind),
  };
}

function exportSourceCode() {
  return import.meta.glob<string>("../assets/styles/_base/core.css", {
    query: "?raw",
    import: "default",
    eager: true,
  })["../assets/styles/_base/core.css"];
}

export { exportRawColors, exportHighlightedColors, exportSourceCode };
