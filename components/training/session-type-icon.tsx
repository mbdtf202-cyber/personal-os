"use client";

import {
  Palette,
  Code,
  Eye,
  Bug,
  Wrench,
  BookOpen,
  Rocket,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";

const SESSION_TYPE_CONFIG = {
  DESIGN: { label: "设计", icon: Palette, color: "text-purple-600" },
  CODING: { label: "编码", icon: Code, color: "text-green-600" },
  CODE_REVIEW: { label: "代码审查", icon: Eye, color: "text-blue-600" },
  DEBUGGING: { label: "调试", icon: Bug, color: "text-red-600" },
  REFACTOR: { label: "重构", icon: Wrench, color: "text-orange-600" },
  READING: { label: "阅读学习", icon: BookOpen, color: "text-indigo-600" },
  DEPLOYMENT: { label: "部署", icon: Rocket, color: "text-cyan-600" },
  REFLECTION: { label: "复盘", icon: MessageSquare, color: "text-pink-600" },
  OTHER: { label: "其他", icon: MoreHorizontal, color: "text-gray-600" },
};

interface SessionTypeIconProps {
  type: keyof typeof SESSION_TYPE_CONFIG;
  size?: number;
  showLabel?: boolean;
}

export function SessionTypeIcon({ type, size = 16, showLabel = false }: SessionTypeIconProps) {
  const config = SESSION_TYPE_CONFIG[type];
  if (!config) return null;

  const Icon = config.icon;

  if (showLabel) {
    return (
      <div className="flex items-center gap-2">
        <Icon className={`${config.color}`} size={size} />
        <span className="text-sm">{config.label}</span>
      </div>
    );
  }

  return <Icon className={`${config.color}`} size={size} title={config.label} />;
}

export function getSessionTypeConfig(type: keyof typeof SESSION_TYPE_CONFIG) {
  return SESSION_TYPE_CONFIG[type];
}

export const ALL_SESSION_TYPES = Object.keys(SESSION_TYPE_CONFIG) as Array<
  keyof typeof SESSION_TYPE_CONFIG
>;
