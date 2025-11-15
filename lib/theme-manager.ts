// 主题管理器
import { minimalLightTheme } from './themes/minimal-light'
import { softBlueTheme } from './themes/soft-blue'
import { freshGreenTheme } from './themes/fresh-green'
import { elegantPurpleTheme } from './themes/elegant-purple'
import { warmBeigeTheme } from './themes/warm-beige'
import { deepDarkTheme } from './themes/deep-dark'

export type Theme = typeof minimalLightTheme

export const themes: Record<string, Theme> = {
  'minimal-light': minimalLightTheme,
  'soft-blue': softBlueTheme,
  'fresh-green': freshGreenTheme,
  'elegant-purple': elegantPurpleTheme,
  'warm-beige': warmBeigeTheme,
  'deep-dark': deepDarkTheme,
}

export const themeList = Object.values(themes)

export function getTheme(name: string): Theme {
  return themes[name] || minimalLightTheme
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value)
  })
}
