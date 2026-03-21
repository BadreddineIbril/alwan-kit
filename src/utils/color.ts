export default class Color {
  constructor(
    readonly l: number,
    readonly c: number,
    readonly h: number,
  ) {
    if (l < 0 || l > 1) throw new RangeError("L must be between 0 and 1");
    if (c < 0 || c > 0.4) throw new RangeError("C must be between 0 and 0.4");
    if (h < 0 || h >= 360) throw new RangeError("H must be between 0 and 360");
  }

  private toLinearRgb(): [number, number, number] {
    const rad = (this.h * Math.PI) / 180;
    const a = this.c * Math.cos(rad);
    const b = this.c * Math.sin(rad);

    const l = (this.l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (this.l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (this.l - 0.0894841775 * a - 1.291485548 * b) ** 3;

    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
  }

  private toSrgb(): [number, number, number] {
    return this.toLinearRgb().map((c) =>
      clamp(c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055),
    ) as [number, number, number];
  }

  toRgb(): string {
    const [r, g, b] = this.toSrgb().map((c) => Math.round(c * 255));
    return `rgb(${r} ${g} ${b})`;
  }

  toHex(): string {
    const hex = (c: number) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${this.toSrgb().map(hex).join("")}`;
  }

  toHsl(): string {
    const [r, g, b] = this.toSrgb();
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const d = max - min,
      l = (max + min) / 2;
    if (d === 0) return `hsl(0 0% ${round(l * 100)}%)`;
    const s = d / (1 - Math.abs(2 * l - 1));
    const h =
      (max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4) / 6;
    return `hsl(${round(h * 360)} ${round(s * 100)}% ${round(l * 100)}%)`;
  }

  toLab(): string {
    const [lr, lg, lb] = this.toLinearRgb();
    const fx = f((lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375) / 0.95047);
    const fy = f(lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175);
    const fz = f((lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041) / 1.08883);
    return `lab(${round(116 * fy - 16)} ${round(500 * (fx - fy))} ${round(200 * (fy - fz))})`;
  }

  toOklch(): string {
    return `oklch(${+this.l.toFixed(3)} ${+this.c.toFixed(3)} ${+this.h.toFixed(3)})`;
  }
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
