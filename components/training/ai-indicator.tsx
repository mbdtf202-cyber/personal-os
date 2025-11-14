"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIIndicatorProps {
  aiTools: string[];
  size?: "sm" | "md";
}

export function AIIndicator({ aiTools, size = "md" }: AIIndicatorProps) {
  if (aiTools.length === 0) return null;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <Badge
      variant="outline"
      className={`${sizeClasses[size]} flex items-center gap-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200`}
    >
      <Sparkles className="w-3 h-3 text-purple-600" />
      <span className="text-purple-700">{aiTools.join(", ")}</span>
    </Badge>
  );
}
