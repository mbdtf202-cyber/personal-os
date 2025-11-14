"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Code, Link as LinkIcon, Bug, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDomainConfig } from "@/components/training/domain-badge";
import { CreateNoteDialog } from "@/components/training/create-note-dialog";
import { CreateSnippetDialog } from "@/components/training/create-snippet-dialog";
import { CreateResourceDialog } from "@/components/training/create-resource-dialog";
import { CreateBugDialog } from "@/components/training/create-bug-dialog";

export default function DomainPage() {
  const params = useParams();
  const domain = (params.domain as string).toUpperCase();
  const config = getDomainConfig(domain as any);

  const [stats, setStats] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, notesRes, snippetsRes, resourcesRes, bugsRes] = await Promise.all([
          fetch(`/api/training/${domain}/stats`),
          fetch(`/api/training/${domain}/notes`),
          fetch(`/api/training/${domain}/snippets`),
          fetch(`/api/training/${domain}/resources`),
          fetch(`/api/training/${domain}/bugs`),
        ]);

        setStats(await statsRes.json());
        setNotes(await notesRes.json());
        setSnippets(await snippetsRes.json());
        setResources(await resourcesRes.json());
        setBugs(await bugsRes.json());
      } catch (error) {
        console.error("Failed to fetch domain data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [domain]);

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  const Icon = config.icon;

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm">笔记</span>
          </div>
          <div className="text-2xl font-bold">{stats?.notes || 0}</div>
        </Card>
        {(domain === "FRONTEND" || domain === "BACKEND" || domain === "TESTING" || domain === "DEVOPS") && (
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
        {(domain === "FRONTEND" || domain === "BACKEND" || domain === "TESTING" || domain === "DEVOPS") && (
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
          {(domain === "FRONTEND" || domain === "BACKEND" || domain === "TESTING" || domain === "DEVOPS") && (
            <TabsTrigger value="snippets">代码片段</TabsTrigger>
          )}
          <TabsTrigger value="resources">资源</TabsTrigger>
          {(domain === "FRONTEND" || domain === "BACKEND" || domain === "TESTING" || domain === "DEVOPS") && (
            <TabsTrigger value="bugs">Bug</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-end">
            <CreateNoteDialog domain={domain} onSuccess={() => window.location.reload()} />
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
                    {note.tags.map((tag: string) => (
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

        {(domain === "FRONTEND" || domain === "BACKEND" || domain === "TESTING" || domain === "DEVOPS") && (
          <TabsContent value="snippets" className="space-y-4">
            <div className="flex justify-end">
              <CreateSnippetDialog domain={domain} onSuccess={() => window.location.reload()} />
            </div>
          {snippets.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              还没有代码片段
            </Card>
          ) : (
            <div className="grid gap-4">
              {snippets.map((snippet) => (
                <Card key={snippet.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{snippet.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{snippet.description}</p>
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
            <CreateResourceDialog domain={domain} onSuccess={() => window.location.reload()} />
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

        {(domain === "FRONTEND" || domain === "BACKEND" || domain === "TESTING" || domain === "DEVOPS") && (
          <TabsContent value="bugs" className="space-y-4">
            <div className="flex justify-end">
              <CreateBugDialog domain={domain} onSuccess={() => window.location.reload()} />
            </div>
          {bugs.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              还没有 Bug 记录
            </Card>
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
