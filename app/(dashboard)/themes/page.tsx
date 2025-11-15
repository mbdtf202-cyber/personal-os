'use client'

import { useState } from 'react'
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
]

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState('minimal-light')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold theme-text-primary mb-2">
          主题系统
        </h1>
        <p className="theme-text-secondary">
          选择适合你的主题风格，实时预览效果
        </p>
      </div>

      {/* Theme Selector */}
      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold theme-text-primary flex items-center gap-2">
              <Palette className="h-5 w-5 theme-color-primary" />
              选择主题
            </h2>
            <ThemeSelector />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme.id)
                  localStorage.setItem('app-theme', theme.id)
                  window.location.reload()
                }}
                className="p-4 rounded-lg theme-bg-tertiary theme-border transition-all hover:shadow-md text-left"
                style={{ borderWidth: '1px' }}
              >
                <p className="font-medium theme-text-primary text-sm">
                  {theme.name}
                </p>
                <p className="text-xs theme-text-tertiary mt-1">
                  {theme.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Component Showcase */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold theme-text-primary">
          组件预览
        </h2>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold theme-text-primary mb-4">
                玻璃态卡片
              </h3>
              <p className="theme-text-secondary mb-4">
                这是一个使用主题系统的玻璃态卡片组件，会根据选择的主题自动调整颜色。
              </p>
              <div className="flex gap-2">
                <Badge className="theme-bg-tertiary theme-text-primary theme-border" style={{ borderWidth: '1px' }}>
                  主题系统
                </Badge>
                <Badge className="theme-bg-tertiary theme-text-primary theme-border" style={{ borderWidth: '1px' }}>
                  实时切换
                </Badge>
              </div>
            </div>
          </GlassCard>

          <Card className="theme-bg-secondary theme-border" style={{ borderWidth: '1px' }}>
            <CardHeader>
              <CardTitle className="theme-text-primary">标准卡片</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="theme-text-secondary mb-4">
                标准卡片组件也支持主题系统，提供一致的视觉体验。
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 theme-text-success">
                  <Check className="h-4 w-4" />
                  <span>完全支持主题切换</span>
                </div>
                <div className="flex items-center gap-2 theme-text-success">
                  <Check className="h-4 w-4" />
                  <span>平滑的过渡动画</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buttons */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold theme-text-primary mb-4">
              按钮样式
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button className="theme-btn-primary">
                主要按钮
              </Button>
              <Button className="theme-btn-success">
                成功按钮
              </Button>
              <Button className="theme-btn-warning">
                警告按钮
              </Button>
              <Button className="theme-btn-danger">
                危险按钮
              </Button>
              <Button variant="outline" className="theme-border theme-text-primary">
                次要按钮
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Color Palette */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold theme-text-primary mb-4">
              颜色系统
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div
                  className="h-20 rounded-lg mb-2 theme-shadow-md"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                />
                <p className="text-xs font-medium theme-text-primary">
                  主背景
                </p>
              </div>
              <div>
                <div
                  className="h-20 rounded-lg mb-2 theme-shadow-md"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                />
                <p className="text-xs font-medium theme-text-primary">
                  次背景
                </p>
              </div>
              <div>
                <div
                  className="h-20 rounded-lg mb-2 theme-shadow-md"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <p className="text-xs font-medium text-white">
                  主色
                </p>
              </div>
              <div>
                <div
                  className="h-20 rounded-lg mb-2 theme-shadow-md"
                  style={{ backgroundColor: 'var(--color-success)' }}
                />
                <p className="text-xs font-medium text-white">
                  成功色
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Typography */}
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-semibold theme-text-primary mb-4">
              文字样式
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium theme-text-tertiary mb-1">
                  主文本
                </p>
                <p className="text-lg theme-text-primary">
                  这是主文本颜色，用于标题和重要内容
                </p>
              </div>
              <div>
                <p className="text-sm font-medium theme-text-tertiary mb-1">
                  次文本
                </p>
                <p className="theme-text-secondary">
                  这是次文本颜色，用于描述和辅助信息
                </p>
              </div>
              <div>
                <p className="text-sm font-medium theme-text-tertiary mb-1">
                  弱文本
                </p>
                <p className="text-sm theme-text-tertiary">
                  这是弱文本颜色，用于提示和占位符
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Info */}
      <GlassCard>
        <div className="p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 theme-color-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold theme-text-primary mb-1">
              主题系统说明
            </h4>
            <p className="text-sm theme-text-secondary">
              所有组件都使用 CSS 变量实现主题切换，选择不同主题后会立即生效。主题数据保存在本地存储中，下次访问时会自动应用。
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
