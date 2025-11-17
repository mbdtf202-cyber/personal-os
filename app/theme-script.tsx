import { DEFAULT_THEME, THEME_CHANGE_EVENT, themeTokens } from '@/lib/themes/registry'

const serializedThemeTokens = JSON.stringify(themeTokens)

export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        var themes = ${serializedThemeTokens};
        var defaultTheme = '${DEFAULT_THEME}';
        var storedTheme = localStorage.getItem('app-theme');
        var activeTheme = storedTheme && themes[storedTheme] ? storedTheme : defaultTheme;
        var themeVars = themes[activeTheme];
        var root = document.documentElement;

        Object.keys(themeVars).forEach(function(key) {
          root.style.setProperty(key, themeVars[key]);
        });
        root.dataset.theme = activeTheme;
        if (window && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('${THEME_CHANGE_EVENT}', { detail: activeTheme }));
        }
      } catch (e) {}
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  )
}
