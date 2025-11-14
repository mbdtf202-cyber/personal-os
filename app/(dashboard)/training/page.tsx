"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DomainBadge } from "@/components/training/domain-badge";
import { DurationDisplay } from "@/components/training/duration-display";

export default function TrainingPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, sessionsRes, plansRes] = await Promise.all([
          fetch("/api/training/stats/week"),
          fetch("/api/training/sessions/recent?limit=10"),
          fetch("/api/training/plans"),
        ]);

        const statsData = await statsRes.json();
        const sessionsData = await sessionsRes.json();
        const plansData = await plansRes.json();

        setStats(statsData);
        setRecentSessions(sessionsData);
        
        const active = plansData.find((p: any) => p.status === "ACTIVE");
        setActivePlan(active);
      } catch (error) {
        console.error("Failed to fetch training data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">超级全栈训练</h1>
          <p className="text-gray-600 mt-1">追踪你的全栈成长之路</p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          快速记录
        </Button>
      </div>

      {/* Active Plan Card */}
      {activePlan && (
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{activePlan.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{activePlan.description}</p>
              <div className="flex gap-2 mt-3">
                {activePlan.domains.map((domain: string) => (
                  <DomainBadge key={domain} domain={domain as any} size="sm" />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {activePlan._count?.sessions || 0}
              </div>
              <div className="text-sm text-gray-600">训练次数</div>
            </div>
          </div>
        </Card>
      )}

      {/* Week Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">本周总时长</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.totalHours?.toFixed(1) || 0}h
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">训练次数</div>
          <div className="text-2xl font-bold mt-1">{stats?.totalSessions || 0}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">AI 使用率</div>
          <div className="text-2xl font-bold mt-1">
            {stats?.aiUsagePercentage?.toFixed(0) || 0}%
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">活跃技能</div>
          <div className="text-2xl font-bold mt-1">{stats?.topSkills?.length || 0}</div>
        </Card>
      </div>

      {/* Domain Breakdown */}
      {stats?.domainBreakdown && Object.keys(stats.domainBreakdown).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">本周职能分布</h3>
          <div className="space-y-3">
            {Object.entries(stats.domainBreakdown).map(([domain, hours]: [string, any]) => (
              <div key={domain} className="flex items-center gap-3">
                <DomainBadge domain={domain as any} size="sm" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(hours / stats.totalHours) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm font-medium w-16 text-right">
                  {hours.toFixed(1)}h
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">最近训练</h3>
        {recentSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>还没有训练记录</p>
            <Button className="mt-4">开始第一次训练</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium">{session.title}</div>
                  <div className="flex gap-2 mt-2">
                    {session.domains.map((domain: string) => (
                      <DomainBadge key={domain} domain={domain as any} size="sm" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {session.durationMin && (
                    <DurationDisplay minutes={session.durationMin} />
                  )}
                  <div className="text-sm text-gray-500">
                    {new Date(session.date).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
