# Implementation Plan: Fullstack Training System

## Overview

This implementation plan breaks down the Fullstack Training System into discrete, actionable coding tasks. Each task builds incrementally on previous work, following the 7-phase migration strategy outlined in the design document.

---

## Phase 1: Database Schema and Models

- [x] 1. Set up Prisma schema for training system
  - Add TrainingDomain enum with 7 values (PRODUCT, PROJECT_MGMT, FRONTEND, BACKEND, TESTING, DEVOPS, AI_COLLAB)
  - Add TrainingSessionType enum with 9 values (DESIGN, CODING, CODE_REVIEW, DEBUGGING, REFACTOR, READING, DEPLOYMENT, REFLECTION, OTHER)
  - Add TrainingPlanStatus enum with 4 values (DRAFT, ACTIVE, COMPLETED, PAUSED)
  - _Requirements: 1.1, 2.4, 3.2_

- [x] 2. Create TrainingPlan model
  - Define model with all fields: id, userId, title, description, domains, startDate, endDate, weeks, status, targetHoursPerWeek, timestamps
  - Add relation to User model
  - Add index on [userId, status]
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Create TrainingSession model
  - Define model with all fields: id, userId, planId, date, title, type, durationMin, domains, skillTags, description, projectId, blogPostId, aiInvolved, aiTools, aiNotes, outcomeScore, notesMd, timestamps
  - Add relations to User, TrainingPlan, Project, and Post models
  - Add indexes on [userId, date], [planId], [projectId], [type]
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Create TrainingWeeklyReview model
  - Define model with all fields: id, userId, planId, weekIndex, startDate, endDate, summaryMd, lessonsMd, nextFocusMd, metricsJson, timestamps
  - Add relations to User and TrainingPlan models
  - Add unique constraint on [planId, weekIndex]
  - Add index on [userId, startDate]
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 5. Update existing models with training relations
  - Add trainingPlans, trainingSessions, trainingReviews relations to User model
  - Add trainingSessions relation to Project model
  - Add trainingSessions relation to Post model
  - _Requirements: 9.1, 10.1_

- [x] 6. Generate and run Prisma migration
  - Run `npx prisma migrate dev --name add_training_system`
  - Verify migration files are created correctly
  - Test database schema in development environment
  - _Requirements: All Phase 1_

---

## Phase 2: Validation Schemas

- [x] 7. Create training validation schemas
  - Create `lib/validations/training.ts` file
  - Define createPlanSchema with Zod (title, description, domains, dates, targetHoursPerWeek)
  - Define updatePlanSchema with Zod (all fields optional except id)
  - Define createSessionSchema with Zod (date, title, type, domains, durationMin, skillTags, etc.)
  - Define updateSessionSchema with Zod (all fields optional except id)
  - Define createReviewSchema with Zod (weekIndex, dates, markdown fields)
  - Define updateReviewSchema with Zod (all fields optional except id)
  - Add validation for enum values, date ranges, and array lengths
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 7.2_

---

## Phase 3: Service Layer

- [x] 8. Implement TrainingService - Plans CRUD
  - Create `lib/services/training.ts` file
  - Implement createPlan(userId, data) method
  - Implement updatePlan(planId, data) method with ownership check
  - Implement deletePlan(planId) method with ownership check
  - Implement getPlan(planId) method with relations
  - Implement getUserPlans(userId) method with sorting
  - Implement getActivePlan(userId) method
  - _Requirements: 2.1, 2.2, 2.6_

- [x] 9. Implement TrainingService - Sessions CRUD
  - Implement createSession(userId, data) method
  - Implement updateSession(sessionId, data) method with ownership check
  - Implement deleteSession(sessionId) method with ownership check
  - Implement getSession(sessionId) method with relations
  - Implement getUserSessions(userId, filters) method with filtering by date, domain, type, project
  - Implement getRecentSessions(userId, limit) method
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 10. Implement TrainingService - Reviews CRUD
  - Implement createReview(userId, data) method
  - Implement updateReview(reviewId, data) method with ownership check
  - Implement deleteReview(reviewId) method with ownership check
  - Implement getReview(reviewId) method with relations
  - Implement getPlanReviews(planId) method with sorting
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 11. Implement TrainingService - Analytics methods
  - Implement getTrainingStats(userId, dateRange) method calculating total hours, sessions, domain breakdown, type breakdown, top skills, AI usage percentage
  - Implement getDomainStats(userId, domain, dateRange) method with hours, sessions, avg duration, top skills, recent sessions, weekly trend
  - Implement getProjectTrainingStats(projectId) method
  - Implement getCurrentWeekStats(userId) method
  - Implement getRadarChartData(userId, dateRange) method returning 7-axis data
  - _Requirements: 5.2, 5.3, 5.4, 6.3, 6.4, 6.5, 6.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 12. Implement TrainingService - Skill and AI analytics
  - Implement getPopularSkills(userId, limit) method aggregating skill tags
  - Implement getSkillSuggestions(userId, query) method for autocomplete
  - Implement getAIUsageStats(userId, dateRange) method
  - _Requirements: 12.1, 12.2, 13.4, 13.5, 13.6_

---

## Phase 4: API Routes

- [x] 13. Create Training Plans API routes
  - Create `app/api/training/plans/route.ts` for POST (create) and GET (list)
  - Create `app/api/training/plans/[id]/route.ts` for GET (detail), PATCH (update), DELETE
  - Add authentication checks using auth helper
  - Add request validation using Zod schemas
  - Add error handling with appropriate status codes
  - Return properly formatted JSON responses
  - _Requirements: 2.1, 2.2, 2.6_

- [x] 14. Create Training Sessions API routes
  - Create `app/api/training/sessions/route.ts` for POST (create) and GET (list with filters)
  - Create `app/api/training/sessions/[id]/route.ts` for GET (detail), PATCH (update), DELETE
  - Create `app/api/training/sessions/recent/route.ts` for GET recent sessions
  - Add query parameter parsing for filters (date, domain, type, project)
  - Add pagination support (page, limit)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 15. Create Training Reviews API routes
  - Create `app/api/training/reviews/route.ts` for POST (create) and GET (list)
  - Create `app/api/training/reviews/[id]/route.ts` for GET (detail), PATCH (update), DELETE
  - Add plan filtering support
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 16. Create Training Stats API routes
  - Create `app/api/training/stats/route.ts` for GET overall stats with date range query params
  - Create `app/api/training/stats/domains/route.ts` for GET domain breakdown
  - Create `app/api/training/stats/domains/[domain]/route.ts` for GET specific domain stats
  - Create `app/api/training/stats/radar/route.ts` for GET radar chart data
  - Create `app/api/training/stats/week/route.ts` for GET current week stats
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 17. Create Skills and Export API routes
  - Create `app/api/training/skills/route.ts` for GET popular skills
  - Create `app/api/training/skills/suggest/route.ts` for GET skill suggestions with query param
  - Create `app/api/training/export/route.ts` for GET export data (CSV/JSON) with format query param
  - Implement CSV generation logic
  - Implement JSON export logic
  - Add date range and domain filters for export
  - _Requirements: 12.1, 12.2, 14.1, 14.2, 14.3, 14.4, 14.5_

---

## Phase 5: Core UI Components

- [x] 18. Create base training UI components
  - Create `components/training/domain-badge.tsx` component displaying domain with icon and color
  - Create `components/training/session-type-icon.tsx` component showing icon for each session type
  - Create `components/training/skill-tag.tsx` component as clickable badge
  - Create `components/training/duration-display.tsx` component formatting minutes to readable format
  - Create `components/training/ai-indicator.tsx` component showing AI tools used
  - _Requirements: 5.4, 6.5, 12.3_

- [ ] 19. Create QuickSessionDialog component
  - Create `components/training/quick-session-dialog.tsx` with form
  - Add domain multi-select with checkboxes
  - Add session type dropdown
  - Add duration input with presets (15min, 30min, 1h, 2h)
  - Add skill tags input with autocomplete
  - Add optional fields (description, project, AI tools) in collapsed section
  - Implement form submission with optimistic update
  - Add loading state and error handling
  - Ensure form can be completed in under 10 seconds
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 20. Create SessionCard component
  - Create `components/training/session-card.tsx` displaying session summary
  - Show date and duration prominently
  - Display domain badges
  - Display skill tags
  - Show session type icon
  - Show AI indicator if applicable
  - Add quick action buttons (edit, delete)
  - Make card clickable to view details
  - _Requirements: 5.4, 12.3, 13.1_

- [ ] 21. Create TrainingTimeline component
  - Create `components/training/training-timeline.tsx` showing chronological sessions
  - Group sessions by date
  - Use SessionCard for each entry
  - Add expandable details section
  - Implement infinite scroll or pagination
  - Add filter controls (domain, type)
  - Show empty state when no sessions
  - _Requirements: 5.4_

- [ ] 22. Create DomainCard component
  - Create `components/training/domain-card.tsx` showing domain summary
  - Display domain icon and name (bilingual)
  - Show total hours badge
  - Show session count
  - Show trend indicator (up/down arrow with percentage)
  - Make card clickable to navigate to domain detail
  - Add hover effect
  - _Requirements: 6.1, 6.6_

---

## Phase 6: Visualization Components

- [ ] 23. Create TrainingRadarChart component
  - Create `components/training/training-radar-chart.tsx` using recharts
  - Implement 7-axis radar chart for domains
  - Add interactive tooltips showing hours and percentage
  - Add date range selector (7 days, 30 days, 90 days, all time)
  - Implement domain highlighting on hover
  - Add responsive sizing for mobile
  - Handle empty data state
  - _Requirements: 5.2, 5.3, 8.6_

- [ ] 24. Create DomainTrendChart component
  - Create `components/training/domain-trend-chart.tsx` using recharts
  - Implement line chart showing weekly hours for a domain
  - Display last 4 weeks by default
  - Add tooltips with exact values
  - Add responsive sizing
  - _Requirements: 6.3_

- [ ] 25. Create SkillTagCloud component
  - Create `components/training/skill-tag-cloud.tsx` displaying top skills
  - Size tags based on usage frequency
  - Make tags clickable to filter sessions
  - Add color coding by domain (optional)
  - Limit to top 20 skills
  - _Requirements: 6.4, 12.4_

---

## Phase 7: Main Pages

- [x] 26. Create Training Overview page
  - Create `app/(dashboard)/training/page.tsx` as main training dashboard
  - Add current plan card with progress bar using PlanProgressCard component
  - Add TrainingRadarChart showing 30-day domain distribution
  - Add current week stats cards (total hours, sessions, top domain)
  - Add TrainingTimeline showing recent 10 sessions
  - Add floating quick record button opening QuickSessionDialog
  - Add empty state when no training data exists
  - Implement data fetching with SWR
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 7.1_

- [ ] 27. Create Training Plans pages
  - Create `app/(dashboard)/training/plans/page.tsx` listing all plans
  - Create `app/(dashboard)/training/plans/[id]/page.tsx` showing plan details with sessions
  - Create `app/(dashboard)/training/plans/new/page.tsx` with plan creation form
  - Add plan status filter (all, active, completed, draft, paused)
  - Add plan cards showing progress, domains, dates
  - Add edit and delete actions
  - Implement form validation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 28. Create Training Sessions pages
  - Create `app/(dashboard)/training/sessions/page.tsx` with filterable session list
  - Create `app/(dashboard)/training/sessions/[id]/page.tsx` showing full session details
  - Add filters for date range, domain, type, project
  - Add sorting options (date, duration)
  - Add pagination (20 per page)
  - Add bulk actions (delete selected)
  - Show full notes in Markdown format on detail page
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 29. Create Domain Overview and Detail pages
  - Create `app/(dashboard)/training/domains/page.tsx` showing all 7 domain cards in grid
  - Create `app/(dashboard)/training/domains/[domain]/page.tsx` for domain-specific view
  - Display DomainCard for each domain with stats
  - On detail page, show DomainTrendChart for 4 weeks
  - Show SkillTagCloud for domain
  - Show filtered session list for domain
  - Display domain-specific metrics (total hours, avg duration, session count)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 30. Create Weekly Reviews pages
  - Create `app/(dashboard)/training/reviews/page.tsx` listing all reviews
  - Create `app/(dashboard)/training/reviews/[id]/page.tsx` showing review detail
  - Create `app/(dashboard)/training/reviews/new/page.tsx` with review form
  - Add three Markdown editors (summary, lessons, next focus)
  - Display auto-calculated metrics for the week
  - Add week selector with calendar
  - Show linked sessions in review detail
  - Implement draft save functionality
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

---

## Phase 8: Advanced Features

- [ ] 31. Create Training Analytics page
  - Create `app/(dashboard)/training/analytics/page.tsx` with advanced visualizations
  - Add domain breakdown bar chart
  - Add session type distribution pie chart
  - Add AI usage trend line chart
  - Add top skills table with usage count
  - Add date range selector
  - Add export button
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 13.5, 14.1_

- [ ] 32. Implement data export functionality
  - Add export button to analytics page
  - Implement CSV download with all session fields
  - Implement JSON download with nested structure
  - Add format selector (CSV/JSON)
  - Add date range and domain filters for export
  - Show download progress indicator
  - Handle large datasets (1000+ sessions)
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

---

## Phase 9: Integration with Existing Modules

- [ ] 33. Add Training tab to Projects
  - Modify `app/(dashboard)/projects/[id]/page.tsx` to add Training tab
  - Create `components/projects/project-training-tab.tsx` component
  - Display sessions linked to project grouped by domain
  - Show domain distribution chart for project
  - Calculate total hours per domain
  - Add "Record Training" button that pre-fills project
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 34. Add Training section to Blog
  - Modify `app/(dashboard)/blog/[id]/page.tsx` to add Related Training section
  - Create `components/blog/blog-training-section.tsx` component
  - Display linked training sessions with domains and skills
  - Add "Create Blog Post" button to session detail page
  - Pre-fill blog post with session context when creating from session
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 35. Add Training widget to Dashboard
  - Create `components/dashboard/training-widget.tsx` component
  - Add widget to main dashboard page `app/(dashboard)/page.tsx`
  - Show current week total hours
  - Show domain breakdown with mini bars
  - Add "Record Training" button
  - Add link to full training overview
  - Show encouraging message when no training this week
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

---

## Phase 10: Polish and Optimization

- [ ] 36. Implement loading and error states
  - Add loading skeletons for all training pages
  - Add error boundaries for training module
  - Add empty states with helpful messages and CTAs
  - Add toast notifications for success/error actions
  - Add confirmation dialogs for delete actions
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 37. Optimize performance
  - Implement code splitting for training pages
  - Lazy load chart libraries (recharts)
  - Lazy load Markdown editor
  - Add SWR caching for all data fetching
  - Implement optimistic updates for quick session entry
  - Add debouncing to skill tag autocomplete (300ms)
  - Virtualize long session lists
  - Prefetch domain stats on hover
  - _Requirements: 4.6, 15.5_

- [ ] 38. Ensure mobile responsiveness
  - Test all training pages on mobile devices (320px - 768px)
  - Adapt radar chart to vertical orientation on mobile
  - Simplify quick-entry form for mobile
  - Ensure touch targets are at least 44x44 pixels
  - Test loading performance on 3G connection
  - Add mobile-specific navigation patterns
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 39. Add comprehensive error handling
  - Implement validation error display in all forms
  - Add user-friendly error messages for API failures
  - Add retry logic for failed requests
  - Log errors to console for debugging
  - Add error reporting for production issues
  - _Requirements: All_

- [ ] 40. Write documentation
  - Add JSDoc comments to all service methods
  - Document API routes with request/response examples
  - Create user guide for training system
  - Add inline help text to complex forms
  - Document data export format
  - _Requirements: All_

---

## Notes

- Each task should be completed and tested before moving to the next
- Optional tasks (marked with *) can be skipped for MVP
- All tasks reference specific requirements from requirements.md
- Integration tasks (Phase 9) depend on existing modules being functional
- Performance optimization (Phase 10) should be done after core functionality is complete
