"use client"

import { useEffect, useState } from 'react'
import { ThemeSelector } from '@/components/layout/theme-selector'
import { StatCard } from '@/components/ui/stat-card'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  TrendingUp,
  Zap,
  Palette,
  Check,
  AlertCircle,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { applyThemeToDOM } from '@/lib/themes/apply-theme'
import { toast } from 'sonner'

const THEMES = [
  {
    id: 'minimal-light',
    name: '极简白',
    description: '简洁明快的极简风格',
  },
  {
    id: 'soft-blue',
    name: '柔和蓝',
    description: '舒适专业的蓝色系',
  },
  {
    id: 'fresh-green',
    name: '清新绿',
    description: '生机活力的绿色系',
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    description: '高端典雅的紫色系',
  },
  {
    id: 'warm-beige',
    name: '温暖米',
    description: '温馨舒适的米色系',
  },
  {
    id: 'deep-dark',
    name: '深邃黑',
    description: '沉浸体验的深色系',
  },
] as const

type ThemeName = (typeof THEMES)[number]['id']

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('minimal-light')

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    const saved = (localStorage.getItem('app-theme') as ThemeName) || 'minimal-light'
    setSelectedTheme(saved)
  }, [])

  const handleThemeChange = (themeId: ThemeName) => {
    setSelectedTheme(themeId)
    localStorage.setItem('app-theme', themeId)
    applyThemeToDOM(themeId)
    const label = THEMES.find((theme) => theme.id === themeId)?.name
    toast.success(`主题已切换为 ${label}`)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="主题系统"
        description="多套素雅主题可即时切换，所有组件基于 CSS 变量保持一致。"
        accent="mint"
        actions={<ThemeSelector />}
      />

      <PageSection title="主题选择" description="点击即可实时预览，右上角也可随时切换">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                selectedTheme === theme.id ? 'theme-bg-tertiary shadow-lg' : 'theme-bg-secondary hover:shadow-md'
              }`}
              style={{ borderWidth: '1px' }}
            >
              <p className="font-semibold theme-text-primary text-sm flex items-center gap-2">
                <Palette className="h-4 w-4 theme-color-primary" />
                {theme.name}
              </p>
              <p className="text-xs theme-text-secondary mt-1">{theme.description}</p>
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection title="组件预览" description="不同主题下所有基础组件自动继承色板">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="总收入"
            value="¥12,450"
            change={{ value: 12, label: '较上月' }}
            icon={TrendingUp}
            iconColor="theme-color-primary"
            trend="up"
          />
          <StatCard
            title="活跃用户"
            value="2,847"
            change={{ value: 8, label: '较上月' }}
            icon={Heart}
            iconColor="theme-color-success"
            trend="up"
          />
          <StatCard
            title="系统状态"
            value="99.9%"
            change={{ value: 0.1, label: '可用性' }}
            icon={Zap}
            iconColor="theme-color-warning"
            trend="neutral"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold theme-text-primary mb-4">玻璃态卡片</h3>
              <p className="theme-text-secondary mb-4">
                所有玻璃卡片会自动读取主题变量，包括背景、阴影与文本颜色。
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="theme-bg-tertiary theme-text-primary theme-border" style={{ borderWidth: '1px' }}>
                  主题系统
                </Badge>
                <Badge className="theme-bg-tertiary theme-text-primary theme-border" style={{ borderWidth: '1px' }}>
                  实时切换
                </Badge>
              </div>
            </div>
          </GlassCard>

          <Card>
            <CardHeader>
              <CardTitle className="theme-text-primary">标准卡片</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="theme-text-secondary mb-4">
                即使是基础 Card 组件，也会随着主题切换更新边框与文本色。
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 theme-color-success">
                  <Check className="h-4 w-4" />
                  <span>完全支持主题切换</span>
                </div>
                <div className="flex items-center gap-2 theme-color-success">
                  <Check className="h-4 w-4" />
                  <span>平滑的过渡动画</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <GlassCard>
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold theme-text-primary">按钮 & 提示</h3>
            <div className="flex flex-wrap gap-3">
              <Button className="theme-btn-primary">主要按钮</Button>
              <Button className="theme-btn-success">成功按钮</Button>
              <Button className="theme-btn-warning">警告按钮</Button>
              <Button className="theme-btn-danger">危险按钮</Button>
              <Button variant="outline" className="theme-border theme-text-primary">
                次要按钮
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl theme-bg-tertiary p-3">
                <div className="p-2 rounded-lg bg-white/40">
                  <Check className="h-4 w-4 theme-color-success" />
                </div>
                <div>
                  <p className="font-medium theme-text-primary">操作成功</p>
                  <p className="text-sm theme-text-secondary">
                    所有提示、警告、错误信息都继承主题色彩。
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl theme-bg-tertiary p-3">
                <div className="p-2 rounded-lg bg-white/40">
                  <AlertCircle className="h-4 w-4 theme-color-warning" />
                </div>
                <div>
                  <p className="font-medium theme-text-primary">风险提示</p>
                  <p className="text-sm theme-text-secondary">
                    警告态颜色会随着主题自动调整。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </PageSection>
    </div>
  )
}
