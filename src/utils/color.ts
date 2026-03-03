export default class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;

  constructor(r: number, g: number, b: number) {
    if ([r, g, b].some((v) => v < 0 || v > 255)) {
      throw new RangeError("RGB values must be between 0 and 255");
    }
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toHex(): string {
    const hex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
  }

  toHsl(): string {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const l = (max + min) / 2;

    if (delta === 0) return `hsl(0 0% ${round(l * 100)}%)`;

    const s = delta / (1 - Math.abs(2 * l - 1));

    let h =
      max === r
        ? ((g - b) / delta + (g < b ? 6 : 0)) / 6
        : max === g
          ? ((b - r) / delta + 2) / 6
          : ((r - g) / delta + 4) / 6;

    return `hsl(${round(h * 360)} ${round(s * 100)}% ${round(l * 100)}%)`;
  }

  private toLinear(): [number, number, number] {
    const linearize = (c: number) => {
      const v = c / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return [linearize(this.r), linearize(this.g), linearize(this.b)];
  }

  private toXyz(): [number, number, number] {
    const [lr, lg, lb] = this.toLinear();
    return [
      lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375,
      lr * 0.2126729 + lg * 0.7151522 + lb * 0.072175,
      lr * 0.0193339 + lg * 0.119192 + lb * 0.9503041,
    ];
  }

  toLab(): string {
    const [x, y, z] = this.toXyz();

    const fx = f(x / 0.95047);
    const fy = f(y / 1.0);
    const fz = f(z / 1.08883);

    return `lab(${round(116 * fy - 16)} ${round(500 * (fx - fy))} ${round(200 * (fy - fz))})`;
  }

  toOklch(): string {
    const [lr, lg, lb] = this.toLinear();

    const l = Math.cbrt(
      0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
    );
    const m = Math.cbrt(
      0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
    );
    const s = Math.cbrt(
      0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
    );

    const okL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const okA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const okB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

    const c = Math.sqrt(okA ** 2 + okB ** 2);
    const h =
      c < 1e-4 ? 0 : ((Math.atan2(okB, okA) * 180) / Math.PI + 360) % 360;

    return `oklch(${round(okL, 4)} ${round(c, 4)} ${round(h)})`;
  }

  toString(): string {
    return this.toHex();
  }
}

function f(t: number): number {
  return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
}

function round(n: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}
