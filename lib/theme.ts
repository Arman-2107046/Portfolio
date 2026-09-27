export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "arr-theme";

export const DEFAULT_THEME: Theme = "light";

/**
 * Runs blocking in <head>, before the first paint, so a returning visitor who
 * chose dark never sees a white frame first.
 *
 * It deliberately does not consult prefers-color-scheme. The site's designed
 * default is the white canvas — that is the ground the type scale was drawn
 * against — so dark is something a visitor opts into and keeps, not something
 * their OS decides for them on arrival. See DESIGN.md section 1.
 *
 * Kept as a string because it must be inlined; it is small enough to read, and
 * every branch is wrapped so a browser with storage blocked still paints.
 */
export const THEME_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "dark" || stored === "light" ? stored : "${DEFAULT_THEME}";
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME}");
  }
})();
`.trim();
