import { broadcastThemeChange, getThemeTokens, resolveThemeName } from './registry'

export function applyThemeToDOM(themeName: string) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  const resolvedName = resolveThemeName(themeName)
  const theme = getThemeTokens(resolvedName)

  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  root.dataset.theme = resolvedName
  broadcastThemeChange(resolvedName)
}
