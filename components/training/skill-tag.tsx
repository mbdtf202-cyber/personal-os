"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
  onClick?: () => void;
  size?: "sm" | "md";
}

export function SkillTag({ skill, onRemove, onClick, size = "md" }: SkillTagProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <Badge
      variant="outline"
      className={`${sizeClasses[size]} flex items-center gap-1 ${
        onClick ? "cursor-pointer hover:bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
}
