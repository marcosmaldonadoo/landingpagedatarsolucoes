import { expect, test } from "bun:test";

const css = await Bun.file(new URL("../styles.css", import.meta.url)).text();
const token = (name) => css.match(new RegExp("--" + name + ": (#[0-9A-Fa-f]{6});"))[1];
const luminance = (color) => {
  const channels = color.slice(1).match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (foreground, background) => {
  const values = [luminance(token(foreground)), luminance(token(background))].sort((first, second) => second - first);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

test("approved text, button and field colors meet WCAG AA contrast", () => {
  for (const [foreground, background] of [["text", "surface"], ["text", "page-bg"], ["text-muted", "page-bg"], ["on-accent", "accent"], ["on-accent", "accent-hover"], ["text", "highlight"], ["error", "error-bg"], ["success", "surface"]]) {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  }
  for (const background of ["surface", "page-bg"]) expect(contrast("field-border", background)).toBeGreaterThanOrEqual(3);
});
