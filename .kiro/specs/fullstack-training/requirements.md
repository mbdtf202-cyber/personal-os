# Requirements Document

## Introduction

The Fullstack Training System is a comprehensive personal development tracking module that enables users to monitor and improve their capabilities across multiple professional domains. The system uses a three-tier architecture: Role/Domain (职能板块), Skills (技能标签), and Training Sessions (训练事件), allowing users to track their growth as a full-stack professional across product design, project management, frontend, backend, testing, DevOps, and AI collaboration.

## Glossary

- **Training System**: The complete module for tracking professional development activities
- **Training Domain**: One of seven professional role categories (Product, Project Management, Frontend, Backend, Testing, DevOps, AI Collaboration)
- **Training Plan**: A time-bound goal-oriented training program spanning multiple domains
- **Training Session**: An atomic record of a single training activity with duration, domains, and skills
- **Skill Tag**: A specific technology, framework, tool, or methodology used during training
- **Session Type**: The nature of the training activity (Design, Coding, Debugging, etc.)
- **Weekly Review**: A reflection document summarizing training progress for a specific week
- **Training Radar**: A visualization showing training distribution across all domains
- **Domain Statistics**: Aggregated metrics showing time and effort invested in each domain

## Requirements

### Requirement 1: Training Domain Management

**User Story:** As a user, I want to categorize my training activities across seven professional domains, so that I can understand which roles I am developing.

#### Acceptance Criteria

1. THE Training System SHALL support exactly seven training domains: PRODUCT, PROJECT_MGMT, FRONTEND, BACKEND, TESTING, DEVOPS, and AI_COLLAB
2. WHEN a user creates a training session, THE Training System SHALL allow selection of one or multiple training domains
3. WHEN a user creates a training plan, THE Training System SHALL allow selection of one or multiple target domains
4. THE Training System SHALL display domain names in both English and Chinese for user clarity
5. THE Training System SHALL maintain consistent domain identifiers across all training records

### Requirement 2: Training Plan Creation and Management

**User Story:** As a user, I want to create structured training plans with specific domains and time commitments, so that I can set clear learning goals.

#### Acceptance Criteria

1. WHEN a user creates a training plan, THE Training System SHALL require a title and allow optional description
2. THE Training System SHALL allow users to select one or multiple target domains for each plan
3. THE Training System SHALL allow users to specify start date, end date, and target hours per week
4. THE Training System SHALL support plan status values: DRAFT, ACTIVE, COMPLETED, and PAUSED
5. WHEN a user views a training plan, THE Training System SHALL display total sessions, total hours, and progress percentage
6. THE Training System SHALL allow users to edit or delete training plans that have status DRAFT or ACTIVE

### Requirement 3: Training Session Recording

**User Story:** As a user, I want to quickly record training sessions with domains, skills, and duration, so that I can track my daily learning activities.

#### Acceptance Criteria

1. WHEN a user creates a training session, THE Training System SHALL require date, title, session type, and at least one domain
2. THE Training System SHALL support session types: DESIGN, CODING, CODE_REVIEW, DEBUGGING, REFACTOR, READING, DEPLOYMENT, REFLECTION, and OTHER
3. THE Training System SHALL allow users to input duration in minutes
4. THE Training System SHALL allow users to add multiple skill tags as free-form text
5. THE Training System SHALL allow users to optionally link a session to a project or blog post
6. WHEN AI tools are used, THE Training System SHALL allow users to mark AI involvement and specify which tools
7. THE Training System SHALL allow users to add detailed notes in Markdown format
8. THE Training System SHALL allow users to self-rate session outcome on a scale of 1 to 5

### Requirement 4: Quick Session Entry

**User Story:** As a user, I want to record a training session in under 10 seconds, so that I can capture activities without disrupting my workflow.

#### Acceptance Criteria

1. THE Training System SHALL provide a quick-entry dialog accessible from any training page
2. WHEN the quick-entry dialog opens, THE Training System SHALL pre-fill the current date and time
3. THE Training System SHALL allow domain selection via checkboxes or multi-select
4. THE Training System SHALL allow session type selection via dropdown
5. THE Training System SHALL allow duration input with common presets (15min, 30min, 1h, 2h)
6. WHEN a user submits the quick-entry form, THE Training System SHALL create the session and close the dialog within 2 seconds

### Requirement 5: Training Overview Dashboard

**User Story:** As a user, I want to see a comprehensive overview of my training activities, so that I can understand my learning patterns at a glance.

#### Acceptance Criteria

1. THE Training System SHALL display the current active training plan with progress metrics
2. THE Training System SHALL display a training radar chart showing distribution across all seven domains
3. WHEN calculating radar metrics, THE Training System SHALL use data from the most recent 30 days
4. THE Training System SHALL display a timeline of recent training sessions with date, domains, duration, and skills
5. THE Training System SHALL display total training hours for the current week
6. THE Training System SHALL provide a quick-record button that opens the session entry dialog
7. WHEN no training plan is active, THE Training System SHALL display a prompt to create one

### Requirement 6: Domain-Specific Training Views

**User Story:** As a user, I want to view my training progress for each professional domain separately, so that I can identify strengths and gaps.

#### Acceptance Criteria

1. THE Training System SHALL provide a domain overview page showing all seven domains as cards
2. WHEN a user selects a specific domain, THE Training System SHALL display a detail view for that domain
3. THE Training System SHALL display a 4-week trend chart showing training hours for the selected domain
4. THE Training System SHALL display the top 10 most-used skill tags for the selected domain
5. THE Training System SHALL display a list of recent training sessions filtered by the selected domain
6. THE Training System SHALL calculate and display total hours and session count for each domain

### Requirement 7: Weekly Review Creation

**User Story:** As a user, I want to write weekly reflections on my training progress, so that I can consolidate learning and plan improvements.

#### Acceptance Criteria

1. THE Training System SHALL allow users to create weekly reviews linked to a training plan
2. WHEN creating a review, THE Training System SHALL require week index, start date, and end date
3. THE Training System SHALL provide three Markdown text areas: summary, lessons learned, and next focus
4. THE Training System SHALL automatically calculate and store metrics for the review week
5. THE Training System SHALL display weekly reviews in chronological order within a training plan
6. THE Training System SHALL allow users to edit or delete weekly reviews

### Requirement 8: Training Statistics and Analytics

**User Story:** As a user, I want to see aggregated statistics about my training activities, so that I can measure progress over time.

#### Acceptance Criteria

1. THE Training System SHALL calculate total training hours grouped by domain for any date range
2. THE Training System SHALL calculate session count grouped by session type for any date range
3. THE Training System SHALL calculate average session duration for each domain
4. THE Training System SHALL identify the most frequently used skill tags across all sessions
5. THE Training System SHALL calculate AI tool usage frequency and percentage
6. THE Training System SHALL display statistics with visual charts (bar, line, pie, or radar)

### Requirement 9: Project Integration

**User Story:** As a user, I want to link training sessions to my projects, so that I can see which roles I played in each project.

#### Acceptance Criteria

1. WHEN viewing a project detail page, THE Training System SHALL display a Training tab
2. THE Training System SHALL display all training sessions linked to the current project
3. THE Training System SHALL group project training sessions by domain
4. THE Training System SHALL calculate total hours per domain for the current project
5. THE Training System SHALL display a domain distribution chart for the current project
6. WHEN creating a training session, THE Training System SHALL allow users to select a project from their project list

### Requirement 10: Blog Integration

**User Story:** As a user, I want to link training sessions to blog posts, so that I can document learning experiences in detail.

#### Acceptance Criteria

1. WHEN creating a training session, THE Training System SHALL allow users to link an existing blog post
2. WHEN viewing a blog post detail page, THE Training System SHALL display linked training sessions
3. THE Training System SHALL display the domains and skills associated with linked training sessions
4. THE Training System SHALL allow users to create a new blog post directly from a training session
5. WHEN creating a blog post from a session, THE Training System SHALL pre-fill relevant context and tags

### Requirement 11: Dashboard Widget

**User Story:** As a user, I want to see a training summary on my main dashboard, so that I can stay aware of my learning progress.

#### Acceptance Criteria

1. THE Training System SHALL display a training widget on the main dashboard
2. THE Training System SHALL show total training hours for the current week in the widget
3. THE Training System SHALL show a breakdown of hours by domain for the current week
4. THE Training System SHALL provide a "Record Training" button in the widget
5. WHEN no training has been recorded this week, THE Training System SHALL display an encouraging message

### Requirement 12: Skill Tag Management

**User Story:** As a user, I want to use consistent skill tags across sessions, so that I can accurately track technology usage.

#### Acceptance Criteria

1. WHEN a user enters skill tags, THE Training System SHALL suggest previously used tags
2. THE Training System SHALL allow users to create new skill tags freely
3. THE Training System SHALL display skill tags as clickable badges
4. WHEN a user clicks a skill tag, THE Training System SHALL filter sessions by that tag
5. THE Training System SHALL normalize skill tag capitalization for consistency

### Requirement 13: AI Collaboration Tracking

**User Story:** As a user, I want to track how I use AI tools during training, so that I can optimize my AI-assisted workflow.

#### Acceptance Criteria

1. WHEN creating a training session, THE Training System SHALL allow users to mark AI involvement
2. THE Training System SHALL allow users to specify which AI tools were used (ChatGPT, Cursor, Claude, etc.)
3. THE Training System SHALL allow users to add notes about AI usage and challenges
4. THE Training System SHALL calculate percentage of sessions involving AI tools
5. THE Training System SHALL display AI usage trends over time
6. THE Training System SHALL identify which domains have highest AI tool usage

### Requirement 14: Data Export

**User Story:** As a user, I want to export my training data, so that I can use it for resumes or external analysis.

#### Acceptance Criteria

1. THE Training System SHALL allow users to export training sessions as CSV
2. THE Training System SHALL allow users to export training sessions as JSON
3. THE Training System SHALL include all session fields in exports: date, domains, skills, duration, type, notes
4. THE Training System SHALL allow users to filter export data by date range and domains
5. THE Training System SHALL generate export files within 5 seconds for up to 1000 sessions

### Requirement 15: Mobile-Responsive Design

**User Story:** As a user, I want to access the training system on mobile devices, so that I can record sessions on the go.

#### Acceptance Criteria

1. THE Training System SHALL display correctly on screen widths from 320px to 2560px
2. WHEN viewed on mobile, THE Training System SHALL adapt charts to vertical orientation
3. WHEN viewed on mobile, THE Training System SHALL provide a simplified quick-entry form
4. THE Training System SHALL ensure all interactive elements have touch targets of at least 44x44 pixels
5. THE Training System SHALL load training overview page within 3 seconds on 3G connection
