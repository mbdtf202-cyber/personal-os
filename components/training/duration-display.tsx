"use client";

import { Clock } from "lucide-react";

interface DurationDisplayProps {
  minutes: number;
  showIcon?: boolean;
  className?: string;
}

export function DurationDisplay({ minutes, showIcon = true, className = "" }: DurationDisplayProps) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  let display = "";
  if (hours > 0) {
    display = `${hours}h`;
    if (mins > 0) display += ` ${mins}m`;
  } else {
    display = `${mins}m`;
  }

  return (
    <div className={`flex items-center gap-1 text-sm text-gray-600 ${className}`}>
      {showIcon && <Clock className="w-4 h-4" />}
      <span>{display}</span>
    </div>
  );
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}
