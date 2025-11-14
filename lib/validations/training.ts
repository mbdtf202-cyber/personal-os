import { z } from "zod";

// Enums
export const TrainingDomain = z.enum([
  "PRODUCT",
  "PROJECT_MGMT",
  "FRONTEND",
  "BACKEND",
  "TESTING",
  "DEVOPS",
  "AI_COLLAB",
]);

export const TrainingSessionType = z.enum([
  "DESIGN",
  "CODING",
  "CODE_REVIEW",
  "DEBUGGING",
  "REFACTOR",
  "READING",
  "DEPLOYMENT",
  "REFLECTION",
  "OTHER",
]);

export const TrainingPlanStatus = z.enum([
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "PAUSED",
]);

// Training Plan Schemas
export const createPlanSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  domains: z.array(TrainingDomain).min(1, "At least one domain is required"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  weeks: z.number().int().positive().optional(),
  targetHoursPerWeek: z.number().int().positive().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) < new Date(data.endDate);
    }
    return true;
  },
  { message: "End date must be after start date" }
);

export const updatePlanSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  domains: z.array(TrainingDomain).min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  weeks: z.number().int().positive().optional(),
  status: TrainingPlanStatus.optional(),
  targetHoursPerWeek: z.number().int().positive().optional(),
});

// Training Session Schemas
export const createSessionSchema = z.object({
  planId: z.string().optional(),
  date: z.string().datetime(),
  title: z.string().min(1, "Title is required").max(200),
  type: TrainingSessionType,
  durationMin: z.number().int().positive().optional(),
  domains: z.array(TrainingDomain).min(1, "At least one domain is required"),
  skillTags: z.array(z.string().max(50)).max(20).default([]),
  description: z.string().max(500).optional(),
  projectId: z.string().optional(),
  blogPostId: z.string().optional(),
  aiInvolved: z.boolean().default(false),
  aiTools: z.array(z.string().max(50)).max(10).default([]),
  aiNotes: z.string().max(1000).optional(),
  outcomeScore: z.number().int().min(1).max(5).optional(),
  notesMd: z.string().max(10000).optional(),
});

export const updateSessionSchema = z.object({
  planId: z.string().optional().nullable(),
  date: z.string().datetime().optional(),
  title: z.string().min(1).max(200).optional(),
  type: TrainingSessionType.optional(),
  durationMin: z.number().int().positive().optional().nullable(),
  domains: z.array(TrainingDomain).min(1).optional(),
  skillTags: z.array(z.string().max(50)).max(20).optional(),
  description: z.string().max(500).optional().nullable(),
  projectId: z.string().optional().nullable(),
  blogPostId: z.string().optional().nullable(),
  aiInvolved: z.boolean().optional(),
  aiTools: z.array(z.string().max(50)).max(10).optional(),
  aiNotes: z.string().max(1000).optional().nullable(),
  outcomeScore: z.number().int().min(1).max(5).optional().nullable(),
  notesMd: z.string().max(10000).optional().nullable(),
});

// Weekly Review Schemas
export const createReviewSchema = z.object({
  planId: z.string().optional(),
  weekIndex: z.number().int().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  summaryMd: z.string().min(1, "Summary is required"),
  lessonsMd: z.string().min(1, "Lessons learned is required"),
  nextFocusMd: z.string().min(1, "Next focus is required"),
  metricsJson: z.record(z.any()).optional(),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  { message: "End date must be after start date" }
);

export const updateReviewSchema = z.object({
  weekIndex: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  summaryMd: z.string().min(1).optional(),
  lessonsMd: z.string().min(1).optional(),
  nextFocusMd: z.string().min(1).optional(),
  metricsJson: z.record(z.any()).optional(),
});

// Query Filters
export const sessionFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  domains: z.array(TrainingDomain).optional(),
  types: z.array(TrainingSessionType).optional(),
  projectId: z.string().optional(),
  planId: z.string().optional(),
  aiInvolved: z.boolean().optional(),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type SessionFilters = z.infer<typeof sessionFiltersSchema>;
