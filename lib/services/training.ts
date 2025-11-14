import { prisma } from "@/lib/prisma";
import type {
  CreatePlanInput,
  UpdatePlanInput,
  CreateSessionInput,
  UpdateSessionInput,
  CreateReviewInput,
  UpdateReviewInput,
  SessionFilters,
} from "@/lib/validations/training";

// Helper functions for JSON array handling
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

// Training Plans CRUD
export async function createPlan(userId: string, data: CreatePlanInput) {
  return await prisma.trainingPlan.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      domains: serializeArray(data.domains),
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      weeks: data.weeks,
      targetHoursPerWeek: data.targetHoursPerWeek,
    },
  });
}

export async function updatePlan(planId: string, userId: string, data: UpdatePlanInput) {
  // Check ownership
  const plan = await prisma.trainingPlan.findUnique({
    where: { id: planId },
    select: { userId: true },
  });

  if (!plan || plan.userId !== userId) {
    throw new Error("Plan not found or unauthorized");
  }

  return await prisma.trainingPlan.update({
    where: { id: planId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.domains && { domains: serializeArray(data.domains) }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.weeks && { weeks: data.weeks }),
      ...(data.status && { status: data.status }),
      ...(data.targetHoursPerWeek && { targetHoursPerWeek: data.targetHoursPerWeek }),
    },
  });
}

export async function deletePlan(planId: string, userId: string) {
  const plan = await prisma.trainingPlan.findUnique({
    where: { id: planId },
    select: { userId: true },
  });

  if (!plan || plan.userId !== userId) {
    throw new Error("Plan not found or unauthorized");
  }

  await prisma.trainingPlan.delete({
    where: { id: planId },
  });
}

export async function getPlan(planId: string, userId: string) {
  const plan = await prisma.trainingPlan.findUnique({
    where: { id: planId },
    include: {
      sessions: {
        orderBy: { date: "desc" },
        take: 10,
      },
      weeklyReviews: {
        orderBy: { weekIndex: "desc" },
      },
    },
  });

  if (!plan || plan.userId !== userId) {
    return null;
  }

  return {
    ...plan,
    domains: deserializeArray(plan.domains),
    sessions: plan.sessions.map((s) => ({
      ...s,
      domains: deserializeArray(s.domains),
      skillTags: deserializeArray(s.skillTags),
      aiTools: deserializeArray(s.aiTools),
    })),
  };
}

export async function getUserPlans(userId: string) {
  const plans = await prisma.trainingPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { sessions: true },
      },
    },
  });

  return plans.map((plan) => ({
    ...plan,
    domains: deserializeArray(plan.domains),
  }));
}

export async function getActivePlan(userId: string) {
  const plan = await prisma.trainingPlan.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      _count: {
        select: { sessions: true },
      },
    },
  });

  if (!plan) return null;

  return {
    ...plan,
    domains: deserializeArray(plan.domains),
  };
}

// Training Sessions CRUD
export async function createSession(userId: string, data: CreateSessionInput) {
  return await prisma.trainingSession.create({
    data: {
      userId,
      planId: data.planId,
      date: new Date(data.date),
      title: data.title,
      type: data.type,
      durationMin: data.durationMin,
      domains: serializeArray(data.domains),
      skillTags: serializeArray(data.skillTags),
      description: data.description,
      projectId: data.projectId,
      blogPostId: data.blogPostId,
      aiInvolved: data.aiInvolved,
      aiTools: serializeArray(data.aiTools),
      aiNotes: data.aiNotes,
      outcomeScore: data.outcomeScore,
      notesMd: data.notesMd,
    },
  });
}

export async function updateSession(sessionId: string, userId: string, data: UpdateSessionInput) {
  const session = await prisma.trainingSession.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  if (!session || session.userId !== userId) {
    throw new Error("Session not found or unauthorized");
  }

  return await prisma.trainingSession.update({
    where: { id: sessionId },
    data: {
      ...(data.planId !== undefined && { planId: data.planId }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.title && { title: data.title }),
      ...(data.type && { type: data.type }),
      ...(data.durationMin !== undefined && { durationMin: data.durationMin }),
      ...(data.domains && { domains: serializeArray(data.domains) }),
      ...(data.skillTags && { skillTags: serializeArray(data.skillTags) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.projectId !== undefined && { projectId: data.projectId }),
      ...(data.blogPostId !== undefined && { blogPostId: data.blogPostId }),
      ...(data.aiInvolved !== undefined && { aiInvolved: data.aiInvolved }),
      ...(data.aiTools && { aiTools: serializeArray(data.aiTools) }),
      ...(data.aiNotes !== undefined && { aiNotes: data.aiNotes }),
      ...(data.outcomeScore !== undefined && { outcomeScore: data.outcomeScore }),
      ...(data.notesMd !== undefined && { notesMd: data.notesMd }),
    },
  });
}

export async function deleteSession(sessionId: string, userId: string) {
  const session = await prisma.trainingSession.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  if (!session || session.userId !== userId) {
    throw new Error("Session not found or unauthorized");
  }

  await prisma.trainingSession.delete({
    where: { id: sessionId },
  });
}

export async function getSession(sessionId: string, userId: string) {
  const session = await prisma.trainingSession.findUnique({
    where: { id: sessionId },
    include: {
      plan: true,
      project: true,
      blogPost: true,
    },
  });

  if (!session || session.userId !== userId) {
    return null;
  }

  return {
    ...session,
    domains: deserializeArray(session.domains),
    skillTags: deserializeArray(session.skillTags),
    aiTools: deserializeArray(session.aiTools),
    plan: session.plan ? {
      ...session.plan,
      domains: deserializeArray(session.plan.domains),
    } : null,
  };
}

export async function getUserSessions(userId: string, filters?: SessionFilters) {
  const where: any = { userId };

  if (filters) {
    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.planId) where.planId = filters.planId;
    if (filters.aiInvolved !== undefined) where.aiInvolved = filters.aiInvolved;
    if (filters.types && filters.types.length > 0) {
      where.type = { in: filters.types };
    }
  }

  const sessions = await prisma.trainingSession.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      plan: { select: { id: true, title: true } },
      project: { select: { id: true, title: true } },
    },
  });

  return sessions.map((session) => ({
    ...session,
    domains: deserializeArray(session.domains),
    skillTags: deserializeArray(session.skillTags),
    aiTools: deserializeArray(session.aiTools),
    plan: session.plan ? {
      ...session.plan,
    } : null,
  }));
}

export async function getRecentSessions(userId: string, limit: number = 10) {
  const sessions = await prisma.trainingSession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    include: {
      plan: { select: { id: true, title: true } },
      project: { select: { id: true, title: true } },
    },
  });

  return sessions.map((session) => ({
    ...session,
    domains: deserializeArray(session.domains),
    skillTags: deserializeArray(session.skillTags),
    aiTools: deserializeArray(session.aiTools),
  }));
}

// Weekly Reviews CRUD
export async function createReview(userId: string, data: CreateReviewInput) {
  return await prisma.trainingWeeklyReview.create({
    data: {
      userId,
      planId: data.planId,
      weekIndex: data.weekIndex,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      summaryMd: data.summaryMd,
      lessonsMd: data.lessonsMd,
      nextFocusMd: data.nextFocusMd,
      metricsJson: data.metricsJson,
    },
  });
}

export async function updateReview(reviewId: string, userId: string, data: UpdateReviewInput) {
  const review = await prisma.trainingWeeklyReview.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Review not found or unauthorized");
  }

  return await prisma.trainingWeeklyReview.update({
    where: { id: reviewId },
    data: {
      ...(data.weekIndex && { weekIndex: data.weekIndex }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.summaryMd && { summaryMd: data.summaryMd }),
      ...(data.lessonsMd && { lessonsMd: data.lessonsMd }),
      ...(data.nextFocusMd && { nextFocusMd: data.nextFocusMd }),
      ...(data.metricsJson && { metricsJson: data.metricsJson }),
    },
  });
}

export async function deleteReview(reviewId: string, userId: string) {
  const review = await prisma.trainingWeeklyReview.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Review not found or unauthorized");
  }

  await prisma.trainingWeeklyReview.delete({
    where: { id: reviewId },
  });
}

export async function getReview(reviewId: string, userId: string) {
  const review = await prisma.trainingWeeklyReview.findUnique({
    where: { id: reviewId },
    include: {
      plan: true,
    },
  });

  if (!review || review.userId !== userId) {
    return null;
  }

  return {
    ...review,
    plan: review.plan ? {
      ...review.plan,
      domains: deserializeArray(review.plan.domains),
    } : null,
  };
}

export async function getPlanReviews(planId: string, userId: string) {
  const plan = await prisma.trainingPlan.findUnique({
    where: { id: planId },
    select: { userId: true },
  });

  if (!plan || plan.userId !== userId) {
    throw new Error("Plan not found or unauthorized");
  }

  return await prisma.trainingWeeklyReview.findMany({
    where: { planId },
    orderBy: { weekIndex: "asc" },
  });
}

// Analytics Methods
export interface TrainingStats {
  totalHours: number;
  totalSessions: number;
  domainBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  topSkills: Array<{ skill: string; count: number }>;
  aiUsagePercentage: number;
}

export interface DomainStats {
  domain: string;
  totalHours: number;
  sessionCount: number;
  avgDuration: number;
  topSkills: string[];
  recentSessions: any[];
  weeklyTrend: Array<{ week: string; hours: number }>;
}

export async function getTrainingStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<TrainingStats> {
  const where: any = { userId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const sessions = await prisma.trainingSession.findMany({
    where,
    select: {
      durationMin: true,
      domains: true,
      type: true,
      skillTags: true,
      aiInvolved: true,
    },
  });

  const totalHours = sessions.reduce((sum, s) => sum + (s.durationMin || 0), 0) / 60;
  const totalSessions = sessions.length;

  // Domain breakdown
  const domainBreakdown: Record<string, number> = {};
  sessions.forEach((s) => {
    const domains = deserializeArray(s.domains);
    domains.forEach((d) => {
      domainBreakdown[d] = (domainBreakdown[d] || 0) + (s.durationMin || 0) / 60;
    });
  });

  // Type breakdown
  const typeBreakdown: Record<string, number> = {};
  sessions.forEach((s) => {
    typeBreakdown[s.type] = (typeBreakdown[s.type] || 0) + 1;
  });

  // Top skills
  const skillCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const skills = deserializeArray(s.skillTags);
    skills.forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  // AI usage
  const aiSessions = sessions.filter((s) => s.aiInvolved).length;
  const aiUsagePercentage = totalSessions > 0 ? (aiSessions / totalSessions) * 100 : 0;

  return {
    totalHours,
    totalSessions,
    domainBreakdown,
    typeBreakdown,
    topSkills,
    aiUsagePercentage,
  };
}

export async function getDomainStats(
  userId: string,
  domain: string,
  startDate?: Date,
  endDate?: Date
): Promise<DomainStats> {
  const where: any = { userId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const allSessions = await prisma.trainingSession.findMany({
    where,
    orderBy: { date: "desc" },
  });

  // Filter sessions that include this domain
  const sessions = allSessions.filter((s) => {
    const domains = deserializeArray(s.domains);
    return domains.includes(domain);
  });

  const totalHours = sessions.reduce((sum, s) => sum + (s.durationMin || 0), 0) / 60;
  const sessionCount = sessions.length;
  const avgDuration = sessionCount > 0 ? totalHours / sessionCount : 0;

  // Top skills for this domain
  const skillCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const skills = deserializeArray(s.skillTags);
    skills.forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill]) => skill);

  // Recent sessions
  const recentSessions = sessions.slice(0, 5).map((s) => ({
    ...s,
    domains: deserializeArray(s.domains),
    skillTags: deserializeArray(s.skillTags),
    aiTools: deserializeArray(s.aiTools),
  }));

  // Weekly trend (last 4 weeks)
  const weeklyTrend: Array<{ week: string; hours: number }> = [];
  const now = new Date();
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (i + 1) * 7);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - i * 7);

    const weekSessions = sessions.filter((s) => {
      const date = new Date(s.date);
      return date >= weekStart && date < weekEnd;
    });

    const weekHours = weekSessions.reduce((sum, s) => sum + (s.durationMin || 0), 0) / 60;
    weeklyTrend.push({
      week: `Week ${4 - i}`,
      hours: weekHours,
    });
  }

  return {
    domain,
    totalHours,
    sessionCount,
    avgDuration,
    topSkills,
    recentSessions,
    weeklyTrend,
  };
}

export async function getProjectTrainingStats(projectId: string): Promise<TrainingStats> {
  const sessions = await prisma.trainingSession.findMany({
    where: { projectId },
    select: {
      durationMin: true,
      domains: true,
      type: true,
      skillTags: true,
      aiInvolved: true,
    },
  });
  const
 totalHours = sessions.reduce((sum, s) => sum + (s.durationMin || 0), 0) / 60;
  const totalSessions = sessions.length;

  const domainBreakdown: Record<string, number> = {};
  sessions.forEach((s) => {
    const domains = deserializeArray(s.domains);
    domains.forEach((d) => {
      domainBreakdown[d] = (domainBreakdown[d] || 0) + (s.durationMin || 0) / 60;
    });
  });

  const typeBreakdown: Record<string, number> = {};
  sessions.forEach((s) => {
    typeBreakdown[s.type] = (typeBreakdown[s.type] || 0) + 1;
  });

  const skillCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const skills = deserializeArray(s.skillTags);
    skills.forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  const aiSessions = sessions.filter((s) => s.aiInvolved).length;
  const aiUsagePercentage = totalSessions > 0 ? (aiSessions / totalSessions) * 100 : 0;

  return {
    totalHours,
    totalSessions,
    domainBreakdown,
    typeBreakdown,
    topSkills,
    aiUsagePercentage,
  };
}

export async function getCurrentWeekStats(userId: string): Promise<TrainingStats> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return await getTrainingStats(userId, weekStart, now);
}

export async function getRadarChartData(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Record<string, number>> {
  const stats = await getTrainingStats(userId, startDate, endDate);
  return stats.domainBreakdown;
}

// Skill and AI Analytics
export async function getPopularSkills(userId: string, limit: number = 20): Promise<string[]> {
  const sessions = await prisma.trainingSession.findMany({
    where: { userId },
    select: { skillTags: true },
  });

  const skillCount: Record<string, number> = {};
  sessions.forEach((s) => {
    const skills = deserializeArray(s.skillTags);
    skills.forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([skill]) => skill);
}

export async function getSkillSuggestions(
  userId: string,
  query: string
): Promise<string[]> {
  const allSkills = await getPopularSkills(userId, 100);
  const lowerQuery = query.toLowerCase();
  return allSkills.filter((skill) => skill.toLowerCase().includes(lowerQuery)).slice(0, 10);
}

export interface AIUsageStats {
  totalSessions: number;
  aiSessions: number;
  aiPercentage: number;
  topAITools: Array<{ tool: string; count: number }>;
  aiUsageByDomain: Record<string, number>;
}

export async function getAIUsageStats(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<AIUsageStats> {
  const where: any = { userId };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const sessions = await prisma.trainingSession.findMany({
    where,
    select: {
      aiInvolved: true,
      aiTools: true,
      domains: true,
    },
  });

  const totalSessions = sessions.length;
  const aiSessions = sessions.filter((s) => s.aiInvolved).length;
  const aiPercentage = totalSessions > 0 ? (aiSessions / totalSessions) * 100 : 0;

  // Top AI tools
  const toolCount: Record<string, number> = {};
  sessions.forEach((s) => {
    if (s.aiInvolved) {
      const tools = deserializeArray(s.aiTools);
      tools.forEach((tool) => {
        toolCount[tool] = (toolCount[tool] || 0) + 1;
      });
    }
  });
  const topAITools = Object.entries(toolCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tool, count]) => ({ tool, count }));

  // AI usage by domain
  const aiUsageByDomain: Record<string, number> = {};
  sessions.forEach((s) => {
    if (s.aiInvolved) {
      const domains = deserializeArray(s.domains);
      domains.forEach((d) => {
        aiUsageByDomain[d] = (aiUsageByDomain[d] || 0) + 1;
      });
    }
  });

  return {
    totalSessions,
    aiSessions,
    aiPercentage,
    topAITools,
    aiUsageByDomain,
  };
}
