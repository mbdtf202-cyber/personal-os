import { Badge } from "@/components/ui/badge";
import { TrainingDomainId, getDomainConfig } from "@/lib/training/domains";

interface DomainBadgeProps {
  domain: TrainingDomainId;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function DomainBadge({ domain, showIcon = true, size = "md" }: DomainBadgeProps) {
  const config = getDomainConfig(domain);
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

export { getDomainConfig };
