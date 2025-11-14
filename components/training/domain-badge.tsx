"use client";

import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  FolderKanban,
  Code,
  Server,
  Bug,
  Cloud,
  Sparkles,
} from "lucide-react";

const DOMAIN_CONFIG = {
  PRODUCT: {
    label: "产品设计",
    labelEn: "Product",
    icon: Lightbulb,
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  },
  PROJECT_MGMT: {
    label: "项目管理",
    labelEn: "PM",
    icon: FolderKanban,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  FRONTEND: {
    label: "前端",
    labelEn: "Frontend",
    icon: Code,
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
  BACKEND: {
    label: "后端",
    labelEn: "Backend",
    icon: Server,
    color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  },
  TESTING: {
    label: "测试",
    labelEn: "Testing",
    icon: Bug,
    color: "bg-red-100 text-red-700 hover:bg-red-200",
  },
  DEVOPS: {
    label: "运维",
    labelEn: "DevOps",
    icon: Cloud,
    color: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  },
  AI_COLLAB: {
    label: "AI协作",
    labelEn: "AI",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  },
};

interface DomainBadgeProps {
  domain: keyof typeof DOMAIN_CONFIG;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function DomainBadge({ domain, showIcon = true, size = "md" }: DomainBadgeProps) {
  const config = DOMAIN_CONFIG[domain];
  if (!config) return null;

  const Icon = config.icon;
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} flex items-center gap-1`}>
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </Badge>
  );
}

export function getDomainConfig(domain: keyof typeof DOMAIN_CONFIG) {
  return DOMAIN_CONFIG[domain];
}

export const ALL_DOMAINS = Object.keys(DOMAIN_CONFIG) as Array<keyof typeof DOMAIN_CONFIG>;
