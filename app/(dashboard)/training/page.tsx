"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DomainBadge, ALL_DOMAINS, getDomainConfig } from "@/components/training/domain-badge";
import { FileText, Code, Link as LinkIcon, Bug } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">全栈知识库</h1>
        <p className="text-gray-600 mt-1">按职能领域组织你的学习笔记、代码片段、资源和 Bug 记录</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_DOMAINS.map((domain) => {
          const config = getDomainConfig(domain);
          const Icon = config.icon;

          return (
            <Link key={domain} href={`/training/${domain.toLowerCase()}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${config.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{config.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{config.labelEn}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>笔记</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Code className="w-4 h-4" />
                    <span>代码</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LinkIcon className="w-4 h-4" />
                    <span>资源</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bug className="w-4 h-4" />
                    <span>Bug</span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
