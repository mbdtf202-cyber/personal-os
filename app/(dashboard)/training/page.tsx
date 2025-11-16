import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ALL_DOMAINS, getDomainConfig } from "@/components/training/domain-badge";
import { FileText, Code, Link as LinkIcon, Bug } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="全栈知识库"
        description="按职能领域组织笔记、代码片段、资料与 Bug 复盘。"
        accent="lavender"
      />

      <PageSection title="知识领域" description="点击进入各领域的学习空间">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ALL_DOMAINS.map((domain) => {
            const config = getDomainConfig(domain);
            const Icon = config.icon;

            return (
              <Link key={domain} href={`/training/${domain.toLowerCase()}`}>
                <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg theme-text-primary">{config.label}</h3>
                      <p className="text-sm theme-text-secondary mt-1">{config.labelEn}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <FileText className="w-4 h-4" />
                      <span>笔记</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <Code className="w-4 h-4" />
                      <span>代码</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <LinkIcon className="w-4 h-4" />
                      <span>资源</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm theme-text-secondary">
                      <Bug className="w-4 h-4" />
                      <span>Bug</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageSection>
    </div>
  );
}
