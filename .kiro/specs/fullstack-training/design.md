# Design Document: Fullstack Training System

## Overview

The Fullstack Training System is a comprehensive module for tracking professional development across seven key domains: Product Design, Project Management, Frontend, Backend, Testing, DevOps, and AI Collaboration. The system follows a three-tier architecture that maps training activities to professional roles, specific skills, and concrete learning sessions.

### Key Design Principles

1. **Quick Capture**: Users should be able to record a training session in under 10 seconds
2. **Multi-dimensional Analysis**: Every training activity is viewed through three lenses: role/domain, skills/tech stack, and activity type
3. **Visual Feedback**: Use radar charts, trend lines, and heatmaps to make progress tangible
4. **Integration-First**: Connect training data with existing Projects and Blog modules
5. **AI-Aware**: Track AI tool usage as a first-class citizen in modern development workflow

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Training System                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Training   │  │   Training   │  │   Weekly     │      │
│  │     Plans    │  │   Sessions   │  │   Reviews    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│                            ▼                                  │
│                  ┌──────────────────┐                        │
│                  │  Analytics       │                        │
│                  │  Engine          │                        │
│                  └──────────────────┘                        │
│                            │                                  │
│         ┌──────────────────┼──────────────────┐              │
│         ▼                  ▼                  ▼              │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐          │
│  │ Projects │      │   Blog   │      │Dashboard │          │
│  │Integration│     │Integration│     │  Widget  │          │
│  └──────────┘      └──────────┘      └──────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Recording Flow**: User → Quick Entry Dialog → TrainingSession → Database → Analytics Update
2. **Viewing Flow**: User → Dashboard/Domain View → Analytics Engine → Aggregated Data → Visualization
3. **Review Flow**: User → Weekly Review Form → TrainingWeeklyReview → Linked Sessions → Metrics Snapshot

## Components and Interfaces

### 1. Data Models (Prisma Schema)

#### Enums

```prisma
enum TrainingDomain {
  PRODUCT        // 产品设计
  PROJECT_MGMT   // 项目管理
  FRONTEND       // 前端开发
  BACKEND        // 后端开发
  TESTING        // 测试
  DEVOPS         // 运维/DevOps
  AI_COLLAB      // AI 协作
}

enum TrainingSessionType {
  DESIGN         // 设计
  CODING         // 编码
  CODE_REVIEW    // 代码审查
  DEBUGGING      // 调试排错
  REFACTOR       // 重构
  READING        // 阅读学习
  DEPLOYMENT     // 部署
  REFLECTION     // 复盘总结
  OTHER          // 其他
}

enum TrainingPlanStatus {
  DRAFT          // 草稿
  ACTIVE         // 进行中
  COMPLETED      // 已完成
  PAUSED         // 已暂停
}
```

#### Core Models

```prisma
model TrainingPlan {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title       String              // 计划标题
  description String?             // 计划描述
  domains     TrainingDomain[]    // 目标职能领域（多选）
  
  startDate   DateTime?           // 开始日期
  endDate     DateTime?           // 结束日期
  weeks       Int?                // 计划周数
  status      TrainingPlanStatus  @default(DRAFT)
  
  targetHoursPerWeek Int?         // 每周目标小时数
  
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  
  sessions      TrainingSession[]
  weeklyReviews TrainingWeeklyReview[]
  
  @@index([userId, status])
}

model TrainingSession {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  planId      String?
  plan        TrainingPlan?       @relation(fields: [planId], references: [id], onDelete: SetNull)
  
  date        DateTime            // 训练日期
  title       String              // 简短标题
  type        TrainingSessionType // 活动类型
  durationMin Int?                // 时长（分钟）
  
  // 三维度核心字段
  domains     TrainingDomain[]    // 职能领域（多选）
  skillTags   String[]            // 技能标签（自由输入）
  
  description String?             // 简要描述
  
  // 关联其他模块
  projectId   String?
  project     Project?            @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  blogPostId  String?
  blogPost    Post?               @relation(fields: [blogPostId], references: [id], onDelete: SetNull)
  
  // AI 协作相关
  aiInvolved  Boolean             @default(false)
  aiTools     String[]            // AI 工具列表
  aiNotes     String?             // AI 使用笔记
  
  // 自评和详细记录
  outcomeScore Int?               // 效果评分 1-5
  notesMd      String?            // Markdown 详细笔记
  
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  
  @@index([userId, date])
  @@index([planId])
  @@index([projectId])
  @@index([type])
}

model TrainingWeeklyReview {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  planId      String?
  plan        TrainingPlan?  @relation(fields: [planId], references: [id], onDelete: SetNull)
  
  weekIndex   Int            // 第几周
  startDate   DateTime       // 周开始日期
  endDate     DateTime       // 周结束日期
  
  summaryMd   String         // 本周总结（Markdown）
  lessonsMd   String         // 经验教训（Markdown）
  nextFocusMd String         // 下周重点（Markdown）
  
  metricsJson Json?          // 本周统计数据快照
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  @@unique([planId, weekIndex])
  @@index([userId, startDate])
}
```

#### User Model Extension

```prisma
model User {
  // ... existing fields ...
  
  trainingPlans    TrainingPlan[]
  trainingSessions TrainingSession[]
  trainingReviews  TrainingWeeklyReview[]
}

model Project {
  // ... existing fields ...
  
  trainingSessions TrainingSession[]
}

model Post {
  // ... existing fields ...
  
  trainingSessions TrainingSession[]
}
```

### 2. Service Layer

#### TrainingService

```typescript
// lib/services/training.ts

export interface TrainingStats {
  totalHours: number;
  totalSessions: number;
  domainBreakdown: Record<TrainingDomain, number>;
  typeBreakdown: Record<TrainingSessionType, number>;
  topSkills: Array<{ skill: string; count: number }>;
  aiUsagePercentage: number;
}

export interface DomainStats {
  domain: TrainingDomain;
  totalHours: number;
  sessionCount: number;
  avgDuration: number;
  topSkills: string[];
  recentSessions: TrainingSession[];
  weeklyTrend: Array<{ week: string; hours: number }>;
}

class TrainingService {
  // Training Plans
  async createPlan(userId: string, data: CreatePlanInput): Promise<TrainingPlan>
  async updatePlan(planId: string, data: UpdatePlanInput): Promise<TrainingPlan>
  async deletePlan(planId: string): Promise<void>
  async getPlan(planId: string): Promise<TrainingPlan | null>
  async getUserPlans(userId: string): Promise<TrainingPlan[]>
  async getActivePlan(userId: string): Promise<TrainingPlan | null>
  
  // Training Sessions
  async createSession(userId: string, data: CreateSessionInput): Promise<TrainingSession>
  async updateSession(sessionId: string, data: UpdateSessionInput): Promise<TrainingSession>
  async deleteSession(sessionId: string): Promise<void>
  async getSession(sessionId: string): Promise<TrainingSession | null>
  async getUserSessions(userId: string, filters?: SessionFilters): Promise<TrainingSession[]>
  async getRecentSessions(userId: string, limit: number): Promise<TrainingSession[]>
  
  // Weekly Reviews
  async createReview(userId: string, data: CreateReviewInput): Promise<TrainingWeeklyReview>
  async updateReview(reviewId: string, data: UpdateReviewInput): Promise<TrainingWeeklyReview>
  async deleteReview(reviewId: string): Promise<void>
  async getReview(reviewId: string): Promise<TrainingWeeklyReview | null>
  async getPlanReviews(planId: string): Promise<TrainingWeeklyReview[]>
  
  // Analytics
  async getTrainingStats(userId: string, dateRange: DateRange): Promise<TrainingStats>
  async getDomainStats(userId: string, domain: TrainingDomain, dateRange: DateRange): Promise<DomainStats>
  async getProjectTrainingStats(projectId: string): Promise<TrainingStats>
  async getCurrentWeekStats(userId: string): Promise<TrainingStats>
  async getRadarChartData(userId: string, dateRange: DateRange): Promise<RadarData>
  
  // Skill Tags
  async getPopularSkills(userId: string, limit: number): Promise<string[]>
  async getSkillSuggestions(userId: string, query: string): Promise<string[]>
  
  // AI Analytics
  async getAIUsageStats(userId: string, dateRange: DateRange): Promise<AIUsageStats>
}
```

### 3. API Routes

```
POST   /api/training/plans              - Create training plan
GET    /api/training/plans              - List user's plans
GET    /api/training/plans/[id]         - Get plan details
PATCH  /api/training/plans/[id]         - Update plan
DELETE /api/training/plans/[id]         - Delete plan

POST   /api/training/sessions           - Create session
GET    /api/training/sessions           - List sessions (with filters)
GET    /api/training/sessions/[id]      - Get session details
PATCH  /api/training/sessions/[id]      - Update session
DELETE /api/training/sessions/[id]      - Delete session
GET    /api/training/sessions/recent    - Get recent sessions

POST   /api/training/reviews            - Create weekly review
GET    /api/training/reviews            - List reviews
GET    /api/training/reviews/[id]       - Get review details
PATCH  /api/training/reviews/[id]       - Update review
DELETE /api/training/reviews/[id]       - Delete review

GET    /api/training/stats              - Get overall stats
GET    /api/training/stats/domains      - Get domain breakdown
GET    /api/training/stats/domains/[domain] - Get specific domain stats
GET    /api/training/stats/radar        - Get radar chart data
GET    /api/training/stats/week         - Get current week stats

GET    /api/training/skills             - Get popular skills
GET    /api/training/skills/suggest     - Get skill suggestions

GET    /api/training/export             - Export training data (CSV/JSON)
```

### 4. Frontend Components

#### Page Structure

```
/training                           - Training overview dashboard
/training/plans                     - Training plans list
/training/plans/[id]                - Plan detail with sessions
/training/plans/new                 - Create new plan
/training/sessions                  - Sessions list with filters
/training/sessions/[id]             - Session detail
/training/domains                   - Domain overview grid
/training/domains/[domain]          - Domain-specific view
/training/reviews                   - Weekly reviews list
/training/reviews/[id]              - Review detail
/training/analytics                 - Advanced analytics page
```

#### Key Components

**TrainingOverview** (`components/training/training-overview.tsx`)
- Current plan card with progress
- Radar chart for domain distribution
- Recent sessions timeline
- Quick stats cards
- Quick record button

**TrainingRadarChart** (`components/training/training-radar-chart.tsx`)
- 7-axis radar visualization
- Interactive tooltips
- Configurable date range
- Domain highlighting on hover

**QuickSessionDialog** (`components/training/quick-session-dialog.tsx`)
- Fast entry form (< 10 seconds)
- Domain multi-select
- Session type dropdown
- Duration presets
- Skill tag autocomplete
- Optional fields collapsed by default

**DomainCard** (`components/training/domain-card.tsx`)
- Domain icon and name
- Total hours badge
- Session count
- Trend indicator (↑↓)
- Click to view details

**SessionCard** (`components/training/session-card.tsx`)
- Date and duration
- Domain badges
- Skill tags
- Session type icon
- AI indicator
- Quick actions (edit, delete)

**TrainingTimeline** (`components/training/training-timeline.tsx`)
- Chronological session list
- Grouped by date
- Expandable details
- Filter by domain/type

**WeeklyReviewForm** (`components/training/weekly-review-form.tsx`)
- Three Markdown editors (summary, lessons, next focus)
- Auto-calculated metrics display
- Week selector
- Save draft functionality

**PlanProgressCard** (`components/training/plan-progress-card.tsx`)
- Progress bar
- Hours completed / target
- Domain distribution mini-chart
- Days remaining
- Quick actions

**DomainStatsView** (`components/training/domain-stats-view.tsx`)
- 4-week trend line chart
- Top skills tag cloud
- Recent sessions list
- Average session duration
- Total hours counter

**TrainingDashboardWidget** (`components/dashboard/training-widget.tsx`)
- Current week summary
- Domain breakdown
- Quick record button
- Link to full training page

## Data Models

### TrainingPlan Schema

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| userId | String | Owner user ID |
| title | String | Plan title |
| description | String? | Optional description |
| domains | TrainingDomain[] | Target domains |
| startDate | DateTime? | Start date |
| endDate | DateTime? | End date |
| weeks | Int? | Duration in weeks |
| status | TrainingPlanStatus | Current status |
| targetHoursPerWeek | Int? | Weekly hour goal |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### TrainingSession Schema

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| userId | String | Owner user ID |
| planId | String? | Associated plan |
| date | DateTime | Session date |
| title | String | Session title |
| type | TrainingSessionType | Activity type |
| durationMin | Int? | Duration in minutes |
| domains | TrainingDomain[] | Related domains |
| skillTags | String[] | Technology tags |
| description | String? | Brief description |
| projectId | String? | Linked project |
| blogPostId | String? | Linked blog post |
| aiInvolved | Boolean | AI tools used |
| aiTools | String[] | AI tool names |
| aiNotes | String? | AI usage notes |
| outcomeScore | Int? | Self-rating 1-5 |
| notesMd | String? | Detailed notes |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### TrainingWeeklyReview Schema

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| userId | String | Owner user ID |
| planId | String? | Associated plan |
| weekIndex | Int | Week number |
| startDate | DateTime | Week start |
| endDate | DateTime | Week end |
| summaryMd | String | Summary markdown |
| lessonsMd | String | Lessons markdown |
| nextFocusMd | String | Next focus markdown |
| metricsJson | Json? | Metrics snapshot |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Error Handling

### Validation Errors

- **Invalid Domain**: Return 400 with message "Invalid training domain"
- **Invalid Session Type**: Return 400 with message "Invalid session type"
- **Missing Required Fields**: Return 400 with specific field names
- **Invalid Date Range**: Return 400 with message "End date must be after start date"
- **Invalid Duration**: Return 400 with message "Duration must be positive"

### Authorization Errors

- **Unauthorized Access**: Return 401 when user not authenticated
- **Forbidden Resource**: Return 403 when accessing another user's training data

### Not Found Errors

- **Plan Not Found**: Return 404 with message "Training plan not found"
- **Session Not Found**: Return 404 with message "Training session not found"
- **Review Not Found**: Return 404 with message "Weekly review not found"

### Server Errors

- **Database Error**: Return 500 with generic message, log detailed error
- **Analytics Calculation Error**: Return 500, fallback to empty stats

## Testing Strategy

### Unit Tests

1. **Service Layer Tests**
   - Test CRUD operations for plans, sessions, reviews
   - Test analytics calculations with mock data
   - Test date range filtering
   - Test domain and skill aggregations

2. **Validation Tests**
   - Test input validation for all create/update operations
   - Test enum value validation
   - Test date range validation

3. **Utility Tests**
   - Test date range helpers
   - Test duration formatting
   - Test skill tag normalization

### Integration Tests

1. **API Route Tests**
   - Test all endpoints with valid/invalid inputs
   - Test authentication and authorization
   - Test query parameter filtering
   - Test pagination

2. **Database Tests**
   - Test Prisma queries with test database
   - Test cascade deletes
   - Test unique constraints
   - Test indexes performance

### Component Tests

1. **Form Component Tests**
   - Test quick session dialog submission
   - Test plan creation form
   - Test weekly review form
   - Test validation error display

2. **Visualization Tests**
   - Test radar chart rendering with various data
   - Test timeline rendering
   - Test empty state handling

### E2E Tests

1. **User Flows**
   - Create plan → Record sessions → View stats → Write review
   - Quick record session from dashboard
   - Filter sessions by domain
   - Export training data

## Performance Considerations

### Database Optimization

1. **Indexes**
   - Index on `userId` + `date` for session queries
   - Index on `userId` + `status` for plan queries
   - Index on `planId` for session filtering
   - Index on `type` for session type filtering

2. **Query Optimization**
   - Use `select` to limit returned fields
   - Use `include` strategically to avoid N+1 queries
   - Implement pagination for session lists (20 per page)
   - Cache popular skills list (5 minute TTL)

3. **Aggregation Strategy**
   - Pre-calculate weekly metrics when creating reviews
   - Use database aggregation functions for stats
   - Implement incremental updates for radar chart data

### Frontend Optimization

1. **Code Splitting**
   - Lazy load chart libraries (recharts)
   - Lazy load Markdown editor
   - Split training pages into separate chunks

2. **Data Fetching**
   - Use SWR for caching and revalidation
   - Implement optimistic updates for quick session entry
   - Prefetch domain stats on overview page hover

3. **Rendering Optimization**
   - Virtualize long session lists
   - Debounce skill tag autocomplete (300ms)
   - Memoize chart data transformations

## Security Considerations

1. **Authorization**
   - Verify user owns training data before any operation
   - Implement row-level security checks in service layer
   - Validate plan/session ownership on updates

2. **Input Sanitization**
   - Sanitize Markdown input to prevent XSS
   - Validate skill tags length (max 50 chars each)
   - Limit notes field size (max 10,000 chars)

3. **Rate Limiting**
   - Limit session creation to 100 per day per user
   - Limit export requests to 10 per hour per user

## Integration Points

### Projects Module

- Add "Training" tab to project detail page
- Display sessions linked to project
- Show domain distribution for project
- Calculate total training hours per project
- Allow creating session from project page

### Blog Module

- Add "Related Training" section to blog post detail
- Display linked sessions with domains and skills
- Allow creating blog post from session
- Pre-fill blog post with session context

### Dashboard Module

- Add training widget showing current week stats
- Display domain breakdown
- Show quick record button
- Link to full training overview

## Migration Strategy

1. **Phase 1: Core Models**
   - Create enums and base models
   - Run Prisma migration
   - Verify database schema

2. **Phase 2: Service Layer**
   - Implement TrainingService
   - Add unit tests
   - Verify CRUD operations

3. **Phase 3: API Routes**
   - Implement all endpoints
   - Add integration tests
   - Test with Postman/Thunder Client

4. **Phase 4: UI Components**
   - Build core components
   - Implement overview page
   - Add quick session dialog

5. **Phase 5: Analytics**
   - Implement stats calculations
   - Build visualization components
   - Add domain-specific views

6. **Phase 6: Integration**
   - Add training tabs to Projects
   - Add training sections to Blog
   - Add dashboard widget

7. **Phase 7: Polish**
   - Add loading states
   - Implement error boundaries
   - Add empty states
   - Optimize performance
