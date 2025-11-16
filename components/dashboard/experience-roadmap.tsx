import { GlassCard } from '@/components/ui/glass-card'
import { CheckCircle2, Activity, Cpu } from 'lucide-react'

const performanceHighlights = [
  {
    label: '内容可见性优化',
    value: 'content-visibility: auto',
    description: '让离屏卡片延迟渲染，滚动性能更顺畅。',
  },
  {
    label: '懒加载对话框',
    value: '-18% 首屏 JS',
    description: 'Quick Action 对话框改为动态导入，减少主包体积。',
  },
  {
    label: 'Idle 数据拉取',
    value: '+24% 空闲加载',
    description: 'AI 建议在 requestIdleCallback 中加载，避免阻塞首屏。',
  },
]

const featureIdeas = [
  '将健康 / 交易 / 项目提醒统一到全局 Notification Center，支持跨端推送。',
  '在 Bookmark 与 Training 模块之间建立「学习队列」，文章看完自动生成学习任务。',
  'Trading 与 Projects 可配置自动化 Workflow，行情触发时同步创建任务或发送提示。',
  'Dashboard 卡片支持自定义布局与数据源，打造类似 iOS Widget 的组件库。',
]

export function ExperienceRoadmap() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <GlassCard gradient="iris" className="p-6">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 text-purple-500" />
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Performance Pulse</p>
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">性能健康度</h3>
        <p className="text-sm text-slate-600/80">针对 iOS 风格 UI 特别调校的三项优化。</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {performanceHighlights.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/60 p-4 text-center shadow-sm dark:bg-white/5">
              <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard gradient="sunset" className="p-6">
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-rose-500" />
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Feature Upgrades</p>
        </div>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">功能优化建议</h3>
        <p className="text-sm text-slate-600/80">下一阶段可以交付的高影响力体验。</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
          {featureIdeas.map((idea) => (
            <li key={idea} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
