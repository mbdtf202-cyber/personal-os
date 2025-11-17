import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
  Layers3,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import {
  ALL_DOMAINS,
  getDomainConfig,
  type TrainingDomainId,
} from "@/lib/training/domains";

const heroStats = [
  {
    title: "累计知识条目",
    value: "284",
    trend: "+18 条 / 30 天",
    caption: "笔记 · 资源 · Bug 复盘",
    icon: BookOpen,
    accent: "from-indigo-500/20 via-indigo-500/5 to-transparent",
  },
  {
    title: "本周深度时长",
    value: "12.5h",
    trend: "3 个番茄冲刺",
    caption: "全部已同步到训练日志",
    icon: Target,
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
  {
    title: "AI 协作率",
    value: "42%",
    trend: "+6pt vs 上周",
    caption: "提示词模板已更新 4 次",
    icon: Sparkles,
    accent: "from-pink-500/20 via-pink-500/5 to-transparent",
  },
  {
    title: "进行中的主题",
    value: "5",
    trend: "2 个跨职能项目",
    caption: "项目管理 · DevOps 占比最高",
    icon: Brain,
    accent: "from-sky-500/20 via-sky-500/5 to-transparent",
  },
];

const domainSnapshots: Record<
  TrainingDomainId,
  { updates: number; hours: string; cadence: string }
> = {
  PRODUCT: { updates: 6, hours: "2.5h", cadence: "体验洞察周报" },
  PROJECT_MGMT: { updates: 4, hours: "1.8h", cadence: "例会模板" },
  FRONTEND: { updates: 9, hours: "3.2h", cadence: "性能复盘" },
  BACKEND: { updates: 7, hours: "2.7h", cadence: "架构演进" },
  TESTING: { updates: 5, hours: "1.9h", cadence: "自动化脚本" },
  DEVOPS: { updates: 3, hours: "1.4h", cadence: "Runbook" },
  AI_COLLAB: { updates: 8, hours: "2.1h", cadence: "提示词共创" },
};

const routines = [
  {
    title: "晨间知识巡检",
    description: "扫描昨夜收藏的资源，挑 1 条补充观点或思考。",
    duration: "20 min",
    icon: Compass,
    steps: ["整理阅读列表", "补充摘要", "标记下一步行动"],
  },
  {
    title: "晚间 Bug 复盘",
    description: "以领域为单位更新缺陷与解决方案，沉淀策略。",
    duration: "30 min",
    icon: Layers3,
    steps: ["回顾 Jira 状态", "记录根因", "同步 Runbook"],
  },
  {
    title: "周五 AI 共创",
    description: "和模型对齐下一周的项目策略，生成提示词草稿。",
    duration: "45 min",
    icon: PlayCircle,
    steps: ["更新上下文", "共创提示词", "输出执行清单"],
  },
];

const aiPlaybooks = [
  {
    title: "提示词迭代",
    description: "根据最新的项目背景生成多轮提示词，锁定最优结构。",
    highlights: ["上下文模板", "评估标准", "落地指令"],
  },
  {
    title: "代码共写",
    description: "以测试场景驱动，自动生成前后端片段并回灌知识库。",
    highlights: ["用例驱动", "对拍脚本", "回写 Snippet"],
  },
  {
    title: "复盘助手",
    description: "将会议纪要与监控日志喂给模型，得到结构化复盘。",
    highlights: ["输入模板", "AI 总结", "行动看板"],
  },
];

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="全栈知识库"
        description="以领域为单位统一管理笔记、代码、资源与 Bug 复盘，搭建可执行的成长操作系统。"
        accent="lavender"
        actions={
          <>
            <Button asChild>
              <Link href="/training/workflows">打开训练计划</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/training/sessions">查看训练日志</Link>
            </Button>
          </>
        }
      />

      <PageSection
        title="学习控制台"
        description="概览当前学习节奏、时长与智能协作占比"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {heroStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="relative overflow-hidden border-white/30 bg-gradient-to-br from-white/70 to-white/20 backdrop-blur"
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-80 bg-gradient-to-br ${stat.accent}`}
                />
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium theme-text-secondary">{stat.title}</p>
                      <p className="mt-1 text-3xl font-semibold tracking-tight theme-text-primary">
                        {stat.value}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-300">{stat.trend}</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-3 shadow-lg dark:bg-white/10">
                      <Icon className="h-5 w-5 text-slate-700 dark:text-white" />
                    </div>
                  </div>
                  <p className="text-sm theme-text-secondary">{stat.caption}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        title="知识领域"
        description="点击任意领域进入沉浸式学习空间，继续完善笔记、资源与复盘"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {ALL_DOMAINS.map((domain) => {
            const config = getDomainConfig(domain)!;
            const Icon = config.icon;
            const snapshot = domainSnapshots[domain] ?? {
              updates: 0,
              hours: "0h",
              cadence: "",
            };

            return (
              <Link key={domain} href={`/training/${domain.toLowerCase()}`}>
                <Card className="relative h-full overflow-hidden border-white/40 transition-all duration-300 hover:translate-y-[-4px]">
                  <div
                    className={`pointer-events-none absolute inset-0 opacity-80 bg-gradient-to-br ${config.accent}`}
                  />
                  <div className="relative flex h-full flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-2xl p-3 ${config.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold theme-text-primary">
                            {config.label}
                          </h3>
                          <p className="text-sm theme-text-secondary">{config.labelEn}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="rounded-full border-white/40 text-xs">
                        {config.focus}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed theme-text-secondary">{config.description}</p>

                    <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/50 bg-white/40 p-4 text-sm dark:border-white/10 dark:bg-white/5">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">近 7 天更新</p>
                        <p className="text-lg font-semibold theme-text-primary">{snapshot.updates}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">深度时长</p>
                        <p className="text-lg font-semibold theme-text-primary">{snapshot.hours}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">例行主题</p>
                        <p className="text-lg font-semibold theme-text-primary">{config.highlight}</p>
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      例行节奏 · {snapshot.cadence}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-slate-600 dark:text-slate-300">
                        {config.resourcesHint}
                      </div>
                      <span className="flex items-center gap-1 text-sky-600">
                        进入领域
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        title="例程 & 节奏"
        description="将训练融入日常节奏，形成可持续的成长系统"
        surface="muted"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {routines.map((routine) => {
            const Icon = routine.icon;
            return (
              <div
                key={routine.title}
                className="rounded-[1.75rem] border border-dashed border-white/50 p-5 dark:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white/80 p-3 shadow dark:bg-white/10">
                    <Icon className="h-5 w-5 text-slate-700 dark:text-white" />
                  </div>
                  <Badge className="bg-slate-900 text-white dark:bg-white/20">
                    {routine.duration}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold theme-text-primary">
                  {routine.title}
                </h3>
                <p className="mt-2 text-sm theme-text-secondary">
                  {routine.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {routine.steps.map((step) => (
                    <li key={step} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        title="AI 协作手册"
        description="复用成熟的智能共创流程，让模型真正融入知识库管理"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {aiPlaybooks.map((playbook) => (
            <Card key={playbook.title} className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Playbook
                  </p>
                  <h3 className="mt-1 text-lg font-semibold theme-text-primary">
                    {playbook.title}
                  </h3>
                </div>
                <Sparkles className="h-5 w-5 text-pink-500" />
              </div>
              <p className="text-sm leading-relaxed theme-text-secondary">
                {playbook.description}
              </p>
              <div className="mt-auto rounded-2xl bg-white/60 p-4 text-sm shadow-inner dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  核心动作
                </p>
                <ul className="mt-3 space-y-2">
                  {playbook.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between text-slate-700 dark:text-slate-200"
                    >
                      <span>{item}</span>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
