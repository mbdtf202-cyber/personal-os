import type { LucideIcon } from "lucide-react";
import {
  Lightbulb,
  FolderKanban,
  Code,
  Server,
  Bug,
  Cloud,
  Sparkles,
} from "lucide-react";

export type TrainingDomainId =
  | "PRODUCT"
  | "PROJECT_MGMT"
  | "FRONTEND"
  | "BACKEND"
  | "TESTING"
  | "DEVOPS"
  | "AI_COLLAB";

export interface TrainingDomainConfig {
  id: TrainingDomainId;
  label: string;
  labelEn: string;
  description: string;
  focus: string;
  highlight: string;
  resourcesHint: string;
  color: string;
  accent: string;
  icon: LucideIcon;
}

export const TRAINING_DOMAIN_CONFIG: Record<TrainingDomainId, TrainingDomainConfig> = {
  PRODUCT: {
    id: "PRODUCT",
    label: "产品设计",
    labelEn: "Product",
    description: "围绕用户旅程打造功能蓝图，沉淀需求洞察与策略文档。",
    focus: "体验洞察",
    highlight: "故事版 + PRD + KPI",
    resourcesHint: "最新竞品分析、用户访谈纪要",
    color: "bg-purple-100 text-purple-700",
    accent: "from-purple-100 via-purple-50 to-white",
    icon: Lightbulb,
  },
  PROJECT_MGMT: {
    id: "PROJECT_MGMT",
    label: "项目管理",
    labelEn: "PM",
    description: "聚焦节奏与风险的掌控，记录计划、复盘与沟通模板。",
    focus: "节奏控制",
    highlight: "燃尽图 + 风险库",
    resourcesHint: "高效会议提纲、干系人沟通脚本",
    color: "bg-blue-100 text-blue-700",
    accent: "from-sky-100 via-sky-50 to-white",
    icon: FolderKanban,
  },
  FRONTEND: {
    id: "FRONTEND",
    label: "前端",
    labelEn: "Frontend",
    description: "记录交互设计、性能优化与组件工程化的技巧。",
    focus: "体验性能",
    highlight: "组件库 + 性能剖析",
    resourcesHint: "可视化方案、调试脚本",
    color: "bg-green-100 text-green-700",
    accent: "from-emerald-100 via-emerald-50 to-white",
    icon: Code,
  },
  BACKEND: {
    id: "BACKEND",
    label: "后端",
    labelEn: "Backend",
    description: "沉淀服务拆分、数据建模、可靠性策略。",
    focus: "架构稳健",
    highlight: "服务编排 + 数据设计",
    resourcesHint: "架构读书笔记、脚本片段",
    color: "bg-orange-100 text-orange-700",
    accent: "from-amber-100 via-amber-50 to-white",
    icon: Server,
  },
  TESTING: {
    id: "TESTING",
    label: "测试",
    labelEn: "Testing",
    description: "覆盖自动化策略、测试矩阵与缺陷复盘。",
    focus: "质量护城河",
    highlight: "自动化 + 回归清单",
    resourcesHint: "测试用例库、覆盖率报表",
    color: "bg-red-100 text-red-700",
    accent: "from-rose-100 via-rose-50 to-white",
    icon: Bug,
  },
  DEVOPS: {
    id: "DEVOPS",
    label: "运维",
    labelEn: "DevOps",
    description: "记录流水线、监控、应急手册与 SLO。",
    focus: "可观测性",
    highlight: "CICD + Runbook",
    resourcesHint: "告警模板、基础设施脚本",
    color: "bg-cyan-100 text-cyan-700",
    accent: "from-cyan-100 via-cyan-50 to-white",
    icon: Cloud,
  },
  AI_COLLAB: {
    id: "AI_COLLAB",
    label: "AI协作",
    labelEn: "AI",
    description: "沉淀提示词、共创流程与模型评估。",
    focus: "智能协作",
    highlight: "提示词模板 + 评价框架",
    resourcesHint: "工具栈、自动化脚本",
    color: "bg-pink-100 text-pink-700",
    accent: "from-pink-100 via-pink-50 to-white",
    icon: Sparkles,
  },
};

export const ALL_DOMAINS = Object.keys(
  TRAINING_DOMAIN_CONFIG
) as TrainingDomainId[];

export function getDomainConfig(domain: string) {
  const normalized = domain?.toUpperCase() as TrainingDomainId;
  return TRAINING_DOMAIN_CONFIG[normalized];
}

