export interface ThemeMeta {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

export type ThemeTokens = Record<string, string>

interface ThemeDefinition {
  meta: ThemeMeta
  tokens: ThemeTokens
}

export const themeRegistry = {
  'minimal-light': {
    meta: {
      name: '极简白',
      description: '简洁干净，适合全天候使用的中性色界面。',
      colors: { primary: '#2563EB', secondary: '#F5F5F5', accent: '#16A34A' },
    },
    tokens: {
      '--bg-primary': '#FAFAFA',
      '--bg-secondary': '#FFFFFF',
      '--bg-tertiary': '#F5F5F5',
      '--text-primary': '#111827',
      '--text-secondary': '#4B5563',
      '--text-tertiary': '#94A3B8',
      '--border-color': '#E2E8F0',
      '--border-light': '#EEF2FF',
      '--color-primary': '#2563EB',
      '--color-success': '#16A34A',
      '--color-warning': '#EA580C',
      '--color-danger': '#DC2626',
      '--shadow-sm': '0 6px 18px rgba(15, 23, 42, 0.08)',
      '--shadow-md': '0 16px 30px rgba(15, 23, 42, 0.12)',
      '--shadow-lg': '0 32px 60px rgba(15, 23, 42, 0.16)',
      '--glass-surface': 'rgba(255, 255, 255, 0.75)',
      '--glass-border': 'rgba(238, 242, 255, 0.8)',
      '--glass-shadow': '0 25px 60px rgba(15, 23, 42, 0.12)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.92)',
      '--surface-1': '#FDFCF8',
      '--surface-2': '#F4F7FF',
      '--surface-3': '#FFF7F0',
      '--glow-1': 'rgba(175, 201, 255, 0.55)',
      '--glow-2': 'rgba(255, 205, 196, 0.45)',
      '--gradient-iris-start': 'rgba(248, 247, 255, 0.95)',
      '--gradient-iris-end': 'rgba(222, 213, 255, 0.95)',
      '--gradient-lavender-start': 'rgba(244, 230, 255, 0.9)',
      '--gradient-lavender-end': 'rgba(210, 210, 255, 0.95)',
      '--gradient-sunset-start': 'rgba(255, 234, 211, 0.95)',
      '--gradient-sunset-end': 'rgba(255, 214, 236, 0.9)',
      '--gradient-mint-start': 'rgba(219, 248, 255, 0.9)',
      '--gradient-mint-end': 'rgba(217, 255, 230, 0.9)',
      '--gradient-aqua-start': 'rgba(226, 240, 255, 0.95)',
      '--gradient-aqua-end': 'rgba(206, 220, 255, 0.85)',
    },
  },
  'soft-blue': {
    meta: {
      name: '柔和蓝',
      description: '科技感但不过度饱和的蓝色系主题。',
      colors: { primary: '#0EA5E9', secondary: '#E2E8F0', accent: '#10B981' },
    },
    tokens: {
      '--bg-primary': '#F7FAFF',
      '--bg-secondary': '#FFFFFF',
      '--bg-tertiary': '#ECF4FF',
      '--text-primary': '#0F172A',
      '--text-secondary': '#4C5972',
      '--text-tertiary': '#94A3B8',
      '--border-color': '#D7E3FC',
      '--border-light': '#E8F0FF',
      '--color-primary': '#0EA5E9',
      '--color-success': '#10B981',
      '--color-warning': '#FBBF24',
      '--color-danger': '#F87171',
      '--shadow-sm': '0 6px 18px rgba(15, 23, 42, 0.07)',
      '--shadow-md': '0 16px 32px rgba(15, 23, 42, 0.12)',
      '--shadow-lg': '0 40px 70px rgba(15, 23, 42, 0.16)',
      '--glass-surface': 'rgba(255, 255, 255, 0.78)',
      '--glass-border': 'rgba(210, 226, 255, 0.8)',
      '--glass-shadow': '0 30px 60px rgba(14, 165, 233, 0.15)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.9)',
      '--surface-1': '#F2F6FF',
      '--surface-2': '#E5F2FF',
      '--surface-3': '#F6FBFF',
      '--glow-1': 'rgba(14, 165, 233, 0.35)',
      '--glow-2': 'rgba(94, 234, 212, 0.25)',
      '--gradient-iris-start': 'rgba(226, 240, 255, 0.95)',
      '--gradient-iris-end': 'rgba(194, 224, 255, 0.95)',
      '--gradient-lavender-start': 'rgba(221, 232, 255, 0.9)',
      '--gradient-lavender-end': 'rgba(190, 207, 255, 0.95)',
      '--gradient-sunset-start': 'rgba(240, 252, 255, 0.95)',
      '--gradient-sunset-end': 'rgba(214, 242, 255, 0.9)',
      '--gradient-mint-start': 'rgba(216, 254, 252, 0.9)',
      '--gradient-mint-end': 'rgba(214, 249, 255, 0.9)',
      '--gradient-aqua-start': 'rgba(220, 241, 255, 0.95)',
      '--gradient-aqua-end': 'rgba(193, 227, 255, 0.85)',
    },
  },
  'fresh-green': {
    meta: {
      name: '清新绿',
      description: '偏自然的绿色系，适合健康与效率场景。',
      colors: { primary: '#16A34A', secondary: '#E8F5E8', accent: '#22C55E' },
    },
    tokens: {
      '--bg-primary': '#F1FCF4',
      '--bg-secondary': '#FFFFFF',
      '--bg-tertiary': '#E8F5E8',
      '--text-primary': '#064E3B',
      '--text-secondary': '#1F7A56',
      '--text-tertiary': '#6B8F7E',
      '--border-color': '#CFE7D6',
      '--border-light': '#E9F6EC',
      '--color-primary': '#16A34A',
      '--color-success': '#22C55E',
      '--color-warning': '#FACC15',
      '--color-danger': '#F97316',
      '--shadow-sm': '0 6px 16px rgba(4, 120, 87, 0.08)',
      '--shadow-md': '0 18px 36px rgba(4, 120, 87, 0.12)',
      '--shadow-lg': '0 36px 60px rgba(4, 120, 87, 0.14)',
      '--glass-surface': 'rgba(255, 255, 255, 0.8)',
      '--glass-border': 'rgba(215, 238, 224, 0.85)',
      '--glass-shadow': '0 30px 55px rgba(16, 163, 74, 0.15)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.88)',
      '--surface-1': '#F6FFF8',
      '--surface-2': '#ECFDF3',
      '--surface-3': '#FFFDF5',
      '--glow-1': 'rgba(52, 211, 153, 0.35)',
      '--glow-2': 'rgba(250, 204, 21, 0.25)',
      '--gradient-iris-start': 'rgba(240, 255, 247, 0.95)',
      '--gradient-iris-end': 'rgba(211, 249, 228, 0.9)',
      '--gradient-lavender-start': 'rgba(237, 255, 242, 0.9)',
      '--gradient-lavender-end': 'rgba(202, 241, 214, 0.9)',
      '--gradient-sunset-start': 'rgba(255, 249, 226, 0.95)',
      '--gradient-sunset-end': 'rgba(255, 237, 205, 0.9)',
      '--gradient-mint-start': 'rgba(217, 255, 233, 0.95)',
      '--gradient-mint-end': 'rgba(206, 255, 242, 0.9)',
      '--gradient-aqua-start': 'rgba(223, 255, 240, 0.95)',
      '--gradient-aqua-end': 'rgba(198, 245, 220, 0.85)',
    },
  },
  'elegant-purple': {
    meta: {
      name: '优雅紫',
      description: '带高级灰的紫粉色调，适合内容与创意页面。',
      colors: { primary: '#A855F7', secondary: '#F5F3FF', accent: '#EC4899' },
    },
    tokens: {
      '--bg-primary': '#FAF7FF',
      '--bg-secondary': '#FFFFFF',
      '--bg-tertiary': '#F4EDFF',
      '--text-primary': '#3B1A5A',
      '--text-secondary': '#5B3D73',
      '--text-tertiary': '#9F8CB7',
      '--border-color': '#E5D7FF',
      '--border-light': '#F5ECFF',
      '--color-primary': '#A855F7',
      '--color-success': '#8B5CF6',
      '--color-warning': '#EC4899',
      '--color-danger': '#F97316',
      '--shadow-sm': '0 8px 20px rgba(88, 28, 135, 0.12)',
      '--shadow-md': '0 18px 40px rgba(88, 28, 135, 0.16)',
      '--shadow-lg': '0 36px 65px rgba(88, 28, 135, 0.18)',
      '--glass-surface': 'rgba(255, 255, 255, 0.78)',
      '--glass-border': 'rgba(243, 232, 255, 0.85)',
      '--glass-shadow': '0 30px 55px rgba(168, 85, 247, 0.18)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.9)',
      '--surface-1': '#FBF7FF',
      '--surface-2': '#F8EDFF',
      '--surface-3': '#FFF3FB',
      '--glow-1': 'rgba(224, 153, 255, 0.35)',
      '--glow-2': 'rgba(244, 114, 182, 0.3)',
      '--gradient-iris-start': 'rgba(247, 236, 255, 0.95)',
      '--gradient-iris-end': 'rgba(228, 206, 255, 0.95)',
      '--gradient-lavender-start': 'rgba(242, 226, 255, 0.92)',
      '--gradient-lavender-end': 'rgba(224, 201, 255, 0.92)',
      '--gradient-sunset-start': 'rgba(255, 229, 244, 0.95)',
      '--gradient-sunset-end': 'rgba(255, 213, 233, 0.9)',
      '--gradient-mint-start': 'rgba(233, 255, 253, 0.9)',
      '--gradient-mint-end': 'rgba(225, 247, 255, 0.88)',
      '--gradient-aqua-start': 'rgba(236, 241, 255, 0.95)',
      '--gradient-aqua-end': 'rgba(215, 227, 255, 0.85)',
    },
  },
  'warm-beige': {
    meta: {
      name: '温暖米',
      description: '更生活化的杏色与米色搭配，沉稳舒适。',
      colors: { primary: '#D97706', secondary: '#FFF4EC', accent: '#EA580C' },
    },
    tokens: {
      '--bg-primary': '#FFFBF6',
      '--bg-secondary': '#FFFFFF',
      '--bg-tertiary': '#FFF4EC',
      '--text-primary': '#4A2F1B',
      '--text-secondary': '#735339',
      '--text-tertiary': '#B99E8F',
      '--border-color': '#F0E1D2',
      '--border-light': '#FAF1E6',
      '--color-primary': '#D97706',
      '--color-success': '#B45309',
      '--color-warning': '#EA580C',
      '--color-danger': '#DC2626',
      '--shadow-sm': '0 8px 20px rgba(209, 119, 6, 0.12)',
      '--shadow-md': '0 20px 40px rgba(209, 119, 6, 0.16)',
      '--shadow-lg': '0 36px 65px rgba(209, 119, 6, 0.18)',
      '--glass-surface': 'rgba(255, 255, 255, 0.78)',
      '--glass-border': 'rgba(250, 232, 222, 0.85)',
      '--glass-shadow': '0 28px 60px rgba(234, 88, 12, 0.15)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.92)',
      '--surface-1': '#FFF9F2',
      '--surface-2': '#FFF1E3',
      '--surface-3': '#FFF7E8',
      '--glow-1': 'rgba(255, 213, 170, 0.4)',
      '--glow-2': 'rgba(255, 179, 171, 0.35)',
      '--gradient-iris-start': 'rgba(255, 246, 235, 0.95)',
      '--gradient-iris-end': 'rgba(255, 226, 201, 0.9)',
      '--gradient-lavender-start': 'rgba(255, 238, 220, 0.9)',
      '--gradient-lavender-end': 'rgba(255, 223, 210, 0.9)',
      '--gradient-sunset-start': 'rgba(255, 236, 209, 0.95)',
      '--gradient-sunset-end': 'rgba(255, 214, 205, 0.9)',
      '--gradient-mint-start': 'rgba(247, 255, 234, 0.9)',
      '--gradient-mint-end': 'rgba(255, 244, 230, 0.9)',
      '--gradient-aqua-start': 'rgba(245, 243, 255, 0.95)',
      '--gradient-aqua-end': 'rgba(227, 228, 255, 0.85)',
    },
  },
  'deep-dark': {
    meta: {
      name: '深邃黑',
      description: '真正沉浸的深色主题，依旧保持优雅。',
      colors: { primary: '#38BDF8', secondary: '#1E293B', accent: '#F472B6' },
    },
    tokens: {
      '--bg-primary': '#050915',
      '--bg-secondary': '#0F1628',
      '--bg-tertiary': '#1E2540',
      '--text-primary': '#F8FAFC',
      '--text-secondary': '#CBD5F5',
      '--text-tertiary': '#94A3B8',
      '--border-color': '#2C3553',
      '--border-light': '#1B2238',
      '--color-primary': '#38BDF8',
      '--color-success': '#4ADE80',
      '--color-warning': '#FBBF24',
      '--color-danger': '#F472B6',
      '--shadow-sm': '0 8px 24px rgba(0, 0, 0, 0.45)',
      '--shadow-md': '0 18px 45px rgba(0, 0, 0, 0.55)',
      '--shadow-lg': '0 36px 70px rgba(0, 0, 0, 0.65)',
      '--glass-surface': 'rgba(18, 23, 38, 0.82)',
      '--glass-border': 'rgba(255, 255, 255, 0.08)',
      '--glass-shadow': '0 35px 70px rgba(3, 7, 18, 0.85)',
      '--glass-highlight': 'rgba(255, 255, 255, 0.08)',
      '--surface-1': '#050915',
      '--surface-2': '#0F1628',
      '--surface-3': '#1B2340',
      '--glow-1': 'rgba(56, 189, 248, 0.22)',
      '--glow-2': 'rgba(244, 114, 182, 0.18)',
      '--gradient-iris-start': 'rgba(37, 0, 68, 0.8)',
      '--gradient-iris-end': 'rgba(88, 28, 135, 0.65)',
      '--gradient-lavender-start': 'rgba(57, 18, 94, 0.75)',
      '--gradient-lavender-end': 'rgba(88, 40, 123, 0.65)',
      '--gradient-sunset-start': 'rgba(64, 28, 98, 0.75)',
      '--gradient-sunset-end': 'rgba(102, 44, 89, 0.65)',
      '--gradient-mint-start': 'rgba(16, 94, 98, 0.65)',
      '--gradient-mint-end': 'rgba(18, 64, 100, 0.65)',
      '--gradient-aqua-start': 'rgba(19, 44, 80, 0.7)',
      '--gradient-aqua-end': 'rgba(9, 24, 52, 0.75)',
    },
  },
} as const satisfies Record<string, ThemeDefinition>

export type ThemeName = keyof typeof themeRegistry
export type ThemeTokenMap = (typeof themeRegistry)[ThemeName]['tokens']

export const DEFAULT_THEME: ThemeName = 'minimal-light'

const tokenEntries = Object.entries(themeRegistry).map(([id, value]) => [id, value.tokens])
export const themeTokens = Object.fromEntries(tokenEntries) as Record<ThemeName, ThemeTokenMap>

export const themeOptions = Object.entries(themeRegistry).map(([id, value]) => ({
  id: id as ThemeName,
  ...value.meta,
}))

export const THEME_CHANGE_EVENT = 'app-theme-change' as const

export function resolveThemeName(themeName?: string | null): ThemeName {
  if (themeName && themeName in themeRegistry) {
    return themeName as ThemeName
  }

  return DEFAULT_THEME
}

export function getThemeTokens(themeName?: string | null): ThemeTokenMap {
  return themeTokens[resolveThemeName(themeName)]
}

export function broadcastThemeChange(themeName: ThemeName) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: themeName }))
}
