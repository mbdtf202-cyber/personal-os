"use client";

import { useCallback, useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { FileText, Code, Link as LinkIcon, Bug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDomainConfig, type TrainingDomainId } from "@/lib/training/domains";
import { CreateNoteDialog } from "@/components/training/create-note-dialog";
import { CreateSnippetDialog } from "@/components/training/create-snippet-dialog";
import { CreateResourceDialog } from "@/components/training/create-resource-dialog";
import { CreateBugDialog } from "@/components/training/create-bug-dialog";

type DomainStats = {
  notes: number;
  snippets: number;
  resources: number;
  bugs: number;
  skills: number;
  avgLevel: number;
};

type DomainNote = {
  id: string;
  title: string;
  contentMd: string;
  tags: string[];
};

type DomainSnippet = {
  id: string;
  title: string;
  description?: string | null;
  code: string;
  language: string;
};

type DomainResource = {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  type: string;
};

type DomainBug = {
  id: string;
  title: string;
  description: string;
  solution?: string | null;
  status: "OPEN" | "SOLVED";
};

export default function DomainPage() {
  const params = useParams();
  const domainSlug = (params.domain as string) ?? "";
  const normalizedDomain = domainSlug.toUpperCase() as TrainingDomainId;
  const config = getDomainConfig(normalizedDomain);

  const [stats, setStats] = useState<DomainStats | null>(null);
  const [notes, setNotes] = useState<DomainNote[]>([]);
  const [snippets, setSnippets] = useState<DomainSnippet[]>([]);
  const [resources, setResources] = useState<DomainResource[]>([]);
  const [bugs, setBugs] = useState<DomainBug[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDomainData = useCallback(async () => {
    if (!normalizedDomain) return;

    setLoading(true);
    setLoadError(null);
    try {
      const [statsRes, notesRes, snippetsRes, resourcesRes, bugsRes] = await Promise.all([
        fetch(`/api/training/${normalizedDomain}/stats`),
        fetch(`/api/training/${normalizedDomain}/notes`),
        fetch(`/api/training/${normalizedDomain}/snippets`),
        fetch(`/api/training/${normalizedDomain}/resources`),
        fetch(`/api/training/${normalizedDomain}/bugs`),
      ]);

      if (!statsRes.ok) throw new Error("加载统计信息失败");
      if (!notesRes.ok) throw new Error("加载笔记失败");
      if (!snippetsRes.ok) throw new Error("加载代码片段失败");
      if (!resourcesRes.ok) throw new Error("加载资源失败");
      if (!bugsRes.ok) throw new Error("加载 Bug 失败");

      setStats((await statsRes.json()) as DomainStats);
      setNotes((await notesRes.json()) as DomainNote[]);
      setSnippets((await snippetsRes.json()) as DomainSnippet[]);
      setResources((await resourcesRes.json()) as DomainResource[]);
      setBugs((await bugsRes.json()) as DomainBug[]);
    } catch (error) {
      console.error("Failed to fetch domain data:", error);
      setLoadError(error instanceof Error ? error.message : "加载数据失败");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [normalizedDomain]);

  useEffect(() => {
    void fetchDomainData();
  }, [fetchDomainData]);

  const handleDataUpdated = () => {
    void fetchDomainData();
  };

  if (!config) {
    return notFound();
  }

  const showEngineeringSections = ["FRONTEND", "BACKEND", "TESTING", "DEVOPS"].includes(
    normalizedDomain
  );

  const Icon = config.icon;

  if (isInitialLoad && loading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-lg ${config.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{config.label}</h1>
            <p className="text-gray-600">{config.labelEn}</p>
          </div>
        </div>
      </div>

      {loadError && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm">笔记</span>
          </div>
          <div className="text-2xl font-bold">{stats?.notes || 0}</div>
        </Card>
        {showEngineeringSections && (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Code className="w-4 h-4" />
              <span className="text-sm">代码片段</span>
            </div>
            <div className="text-2xl font-bold">{stats?.snippets || 0}</div>
          </Card>
        )}
        <Card className="p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <LinkIcon className="w-4 h-4" />
            <span className="text-sm">资源</span>
          </div>
          <div className="text-2xl font-bold">{stats?.resources || 0}</div>
        </Card>
        {showEngineeringSections && (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Bug className="w-4 h-4" />
              <span className="text-sm">Bug</span>
            </div>
            <div className="text-2xl font-bold">{stats?.bugs || 0}</div>
          </Card>
        )}
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes">笔记</TabsTrigger>
          {showEngineeringSections && (
            <TabsTrigger value="snippets">代码片段</TabsTrigger>
          )}
          <TabsTrigger value="resources">资源</TabsTrigger>
          {showEngineeringSections && (
            <TabsTrigger value="bugs">Bug</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-end">
            <CreateNoteDialog domain={normalizedDomain} onSuccess={handleDataUpdated} />
          </div>
          {notes.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              还没有笔记，点击上方按钮创建第一条笔记
            </Card>
          ) : (
            <div className="grid gap-4">
              {notes.map((note) => (
                <Card key={note.id} className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {note.contentMd.substring(0, 150)}...
                  </p>
                  <div className="flex gap-2 mt-3">
                    {note.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {showEngineeringSections && (
          <TabsContent value="snippets" className="space-y-4">
            <div className="flex justify-end">
              <CreateSnippetDialog domain={normalizedDomain} onSuccess={handleDataUpdated} />
            </div>
            {snippets.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">还没有代码片段</Card>
            ) : (
              <div className="grid gap-4">
                {snippets.map((snippet) => (
                  <Card key={snippet.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{snippet.title}</h3>
                        {snippet.description && (
                          <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
                        )}
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {snippet.language}
                      </span>
                    </div>
                    <pre className="mt-3 p-3 bg-gray-50 rounded text-sm overflow-x-auto">
                      <code>{snippet.code}</code>
                    </pre>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-end">
            <CreateResourceDialog domain={normalizedDomain} onSuccess={handleDataUpdated} />
          </div>
          {resources.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              还没有资源
            </Card>
          ) : (
            <div className="grid gap-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        {resource.url}
                      </a>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {resource.type}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {showEngineeringSections && (
          <TabsContent value="bugs" className="space-y-4">
            <div className="flex justify-end">
              <CreateBugDialog domain={normalizedDomain} onSuccess={handleDataUpdated} />
            </div>
            {bugs.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">还没有 Bug 记录</Card>
            ) : (
              <div className="grid gap-4">
                {bugs.map((bug) => (
                  <Card key={bug.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{bug.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{bug.description}</p>
                        {bug.solution && (
                          <div className="mt-3 p-3 bg-green-50 rounded">
                            <div className="text-sm font-medium text-green-800">解决方案：</div>
                            <p className="text-sm text-green-700 mt-1">{bug.solution}</p>
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          bug.status === "SOLVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {bug.status === "SOLVED" ? "已解决" : "未解决"}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
