import { prisma } from "@/lib/prisma";

function serializeArray(arr: string[]): string {
  return JSON.stringify(arr);
}

function deserializeArray(str: string): string[] {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

// Notes
export async function createNote(userId: string, data: {
  domain: string;
  title: string;
  contentMd: string;
  tags?: string[];
  isPinned?: boolean;
}) {
  return await prisma.trainingNote.create({
    data: {
      userId,
      domain: data.domain as any,
      title: data.title,
      contentMd: data.contentMd,
      tags: serializeArray(data.tags || []),
      isPinned: data.isPinned || false,
    },
  });
}

export async function getNotesByDomain(userId: string, domain: string) {
  const notes = await prisma.trainingNote.findMany({
    where: { userId, domain: domain as any },
    orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  });
  return notes.map((n) => ({ ...n, tags: deserializeArray(n.tags) }));
}

export async function updateNote(noteId: string, userId: string, data: any) {
  const note = await prisma.trainingNote.findUnique({
    where: { id: noteId },
    select: { userId: true },
  });
  if (!note || note.userId !== userId) throw new Error("Unauthorized");

  return await prisma.trainingNote.update({
    where: { id: noteId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.contentMd && { contentMd: data.contentMd }),
      ...(data.tags && { tags: serializeArray(data.tags) }),
      ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
    },
  });
}

export async function deleteNote(noteId: string, userId: string) {
  const note = await prisma.trainingNote.findUnique({
    where: { id: noteId },
    select: { userId: true },
  });
  if (!note || note.userId !== userId) throw new Error("Unauthorized");
  await prisma.trainingNote.delete({ where: { id: noteId } });
}

// Snippets
export async function createSnippet(userId: string, data: {
  domain: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags?: string[];
}) {
  return await prisma.trainingSnippet.create({
    data: {
      userId,
      domain: data.domain as any,
      title: data.title,
      description: data.description,
      code: data.code,
      language: data.language,
      tags: serializeArray(data.tags || []),
    },
  });
}

export async function getSnippetsByDomain(userId: string, domain: string) {
  const snippets = await prisma.trainingSnippet.findMany({
    where: { userId, domain: domain as any },
    orderBy: { updatedAt: "desc" },
  });
  return snippets.map((s) => ({ ...s, tags: deserializeArray(s.tags) }));
}

export async function deleteSnippet(snippetId: string, userId: string) {
  const snippet = await prisma.trainingSnippet.findUnique({
    where: { id: snippetId },
    select: { userId: true },
  });
  if (!snippet || snippet.userId !== userId) throw new Error("Unauthorized");
  await prisma.trainingSnippet.delete({ where: { id: snippetId } });
}

// Resources
export async function createResource(userId: string, data: {
  domain: string;
  title: string;
  url: string;
  description?: string;
  type: string;
  tags?: string[];
  isFavorite?: boolean;
}) {
  return await prisma.trainingResource.create({
    data: {
      userId,
      domain: data.domain as any,
      title: data.title,
      url: data.url,
      description: data.description,
      type: data.type,
      tags: serializeArray(data.tags || []),
      isFavorite: data.isFavorite || false,
    },
  });
}

export async function getResourcesByDomain(userId: string, domain: string) {
  const resources = await prisma.trainingResource.findMany({
    where: { userId, domain: domain as any },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });
  return resources.map((r) => ({ ...r, tags: deserializeArray(r.tags) }));
}

export async function deleteResource(resourceId: string, userId: string) {
  const resource = await prisma.trainingResource.findUnique({
    where: { id: resourceId },
    select: { userId: true },
  });
  if (!resource || resource.userId !== userId) throw new Error("Unauthorized");
  await prisma.trainingResource.delete({ where: { id: resourceId } });
}

// Bugs
export async function createBug(userId: string, data: {
  domain: string;
  title: string;
  description: string;
  solution?: string;
  tags?: string[];
  projectId?: string;
}) {
  return await prisma.trainingBug.create({
    data: {
      userId,
      domain: data.domain as any,
      title: data.title,
      description: data.description,
      solution: data.solution,
      tags: serializeArray(data.tags || []),
      projectId: data.projectId,
    },
  });
}

export async function getBugsByDomain(userId: string, domain: string) {
  const bugs = await prisma.trainingBug.findMany({
    where: { userId, domain: domain as any },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true } } },
  });
  return bugs.map((b) => ({ ...b, tags: deserializeArray(b.tags) }));
}

export async function updateBug(bugId: string, userId: string, data: any) {
  const bug = await prisma.trainingBug.findUnique({
    where: { id: bugId },
    select: { userId: true },
  });
  if (!bug || bug.userId !== userId) throw new Error("Unauthorized");

  return await prisma.trainingBug.update({
    where: { id: bugId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.solution !== undefined && { solution: data.solution }),
      ...(data.status && { status: data.status }),
      ...(data.tags && { tags: serializeArray(data.tags) }),
      ...(data.status === "SOLVED" && !bug && { solvedAt: new Date() }),
    },
  });
}

export async function deleteBug(bugId: string, userId: string) {
  const bug = await prisma.trainingBug.findUnique({
    where: { id: bugId },
    select: { userId: true },
  });
  if (!bug || bug.userId !== userId) throw new Error("Unauthorized");
  await prisma.trainingBug.delete({ where: { id: bugId } });
}

// Progress
export async function updateProgress(userId: string, data: {
  domain: string;
  skill: string;
  level: number;
  notes?: string;
}) {
  return await prisma.trainingProgress.upsert({
    where: {
      userId_domain_skill: {
        userId,
        domain: data.domain as any,
        skill: data.skill,
      },
    },
    create: {
      userId,
      domain: data.domain as any,
      skill: data.skill,
      level: data.level,
      notes: data.notes,
    },
    update: {
      level: data.level,
      notes: data.notes,
    },
  });
}

export async function getProgressByDomain(userId: string, domain: string) {
  return await prisma.trainingProgress.findMany({
    where: { userId, domain: domain as any },
    orderBy: { skill: "asc" },
  });
}

// Stats
export async function getDomainStats(userId: string, domain: string) {
  const [notes, snippets, resources, bugs, progress] = await Promise.all([
    prisma.trainingNote.count({ where: { userId, domain: domain as any } }),
    prisma.trainingSnippet.count({ where: { userId, domain: domain as any } }),
    prisma.trainingResource.count({ where: { userId, domain: domain as any } }),
    prisma.trainingBug.count({ where: { userId, domain: domain as any } }),
    prisma.trainingProgress.findMany({ where: { userId, domain: domain as any } }),
  ]);

  const avgLevel = progress.length > 0
    ? progress.reduce((sum, p) => sum + p.level, 0) / progress.length
    : 0;

  return {
    notes,
    snippets,
    resources,
    bugs,
    skills: progress.length,
    avgLevel: Math.round(avgLevel * 10) / 10,
  };
}

export async function getAllStats(userId: string) {
  const domains = ["PRODUCT", "PROJECT_MGMT", "FRONTEND", "BACKEND", "TESTING", "DEVOPS", "AI_COLLAB"];
  const stats = await Promise.all(
    domains.map(async (domain) => ({
      domain,
      ...(await getDomainStats(userId, domain)),
    }))
  );
  return stats;
}
