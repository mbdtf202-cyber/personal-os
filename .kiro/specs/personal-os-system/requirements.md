# Requirements Document

## Introduction

Personal OS System 是一个基于 Next.js 15 + TypeScript 的全栈个人管理系统，旨在整合健康管理、知识沉淀、资讯聚合、社媒管理、交易记录、项目展示等多个维度的个人数据，形成统一的个人控制台。系统采用 React 19 + App Router + React Server Components 架构，前后端代码在同一代码库中实现。

## Glossary

- **Personal OS System**: 个人操作系统，指本文档描述的个人管理系统
- **Dashboard Module**: 仪表盘模块，用于展示各模块的聚合数据和今日概览
- **Health Module**: 健康管理模块，用于记录睡眠、运动、心情和习惯打卡
- **Blog Module**: 博客笔记模块，用于长文写作和知识沉淀
- **News Module**: 资讯聚合模块，用于聚合 AI、金融、Web3 等领域的资讯
- **Social Module**: 社媒管理模块，用于管理小红书、X 等平台的内容创作
- **Trading Module**: 交易记录模块，用于记录交易明细和每日复盘
- **Project Module**: 项目展示模块，用于展示个人项目作品集
- **Bookmark Module**: 收藏模块，用于管理网址和资源收藏
- **User**: 系统用户
- **Tag**: 标签，用于跨模块的内容分类
- **Server Component**: React 服务端组件，在服务器端渲染的组件
- **Client Component**: React 客户端组件，在浏览器端交互的组件
- **Server Action**: Next.js 服务端操作，用于处理表单提交和数据变更
- **Route Handler**: Next.js 路由处理器，用于实现 REST API 端点

## Requirements

### Requirement 1

**User Story:** 作为系统用户，我希望能够记录每日健康数据，以便追踪我的健康状况和生活习惯

#### Acceptance Criteria

1. WHEN User 提交每日健康记录表单，THE Health Module SHALL 保存睡眠时间、运动时长、心情评分、能量评分和压力水平数据
2. THE Health Module SHALL 支持用户查看历史健康记录列表并按日期筛选
3. WHEN User 创建习惯目标，THE Health Module SHALL 记录习惯名称、描述、频率类型和目标次数
4. WHEN User 进行习惯打卡，THE Health Module SHALL 记录打卡日期和完成状态
5. THE Health Module SHALL 在仪表盘上显示今日健康打卡状态


### Requirement 2

**User Story:** 作为系统用户，我希望能够撰写和管理博客笔记，以便沉淀我的技术思考和知识

#### Acceptance Criteria

1. WHEN User 创建新文章，THE Blog Module SHALL 首先要求用户输入标题和基本信息，然后导航到编辑页面进行内容编写
2. THE Blog Module SHALL 将文章创建流程分为两步：第一步创建标题和元数据，第二步编写 Markdown 内容
3. THE Blog Module SHALL 支持文章状态管理，包括草稿、已发布和已归档三种状态
4. THE Blog Module SHALL 允许用户关联文章与其他模块的实体（如交易记录、收藏、健康记录、项目）
5. THE Blog Module SHALL 提供文章列表视图，支持按分类、状态和标签筛选
6. WHEN User 编辑文章，THE Blog Module SHALL 在独立的编辑页面提供宽敞的 Markdown 编辑器

### Requirement 3

**User Story:** 作为系统用户，我希望能够聚合多个领域的资讯，以便在一个地方浏览所有关注的信息

#### Acceptance Criteria

1. THE News Module SHALL 支持配置多个资讯源，包括名称、类型（AI/金融/Web3）、URL 和抓取策略
2. WHEN 定时任务执行，THE News Module SHALL 从配置的资讯源抓取最新资讯并保存标题、URL、摘要、分类和发布时间
3. THE News Module SHALL 提供资讯列表视图，支持按类型、分类筛选和搜索
4. WHEN User 标记资讯为已读，THE News Module SHALL 更新该资讯的已读状态
5. WHEN User 收藏资讯，THE News Module SHALL 更新该资讯的收藏状态
6. WHEN User 手动添加链接，THE News Module SHALL 自动抓取链接的标题、描述和预览图
7. THE News Module SHALL 在资讯列表中显示每条资讯的预览卡片，包含标题、摘要、来源和预览图

### Requirement 4

**User Story:** 作为系统用户，我希望能够管理社媒内容创作流程，以便系统化地运营我的社交媒体账号

#### Acceptance Criteria

1. WHEN User 创建社媒内容，THE Social Module SHALL 保存平台类型、标题、内容文本、状态和标签
2. THE Social Module SHALL 支持内容状态流转，包括想法、草稿、已排期和已发布四种状态
3. WHEN User 设置发布时间，THE Social Module SHALL 记录计划发布时间和实际发布时间
4. WHEN User 录入数据表现，THE Social Module SHALL 保存浏览量、点赞数、评论数、分享数和收藏数
5. THE Social Module SHALL 在仪表盘上显示今日/本周需要发布的内容提醒

### Requirement 5

**User Story:** 作为系统用户，我希望能够记录交易明细和复盘，以便提升我的交易能力

#### Acceptance Criteria

1. WHEN User 记录交易，THE Trading Module SHALL 保存日期、市场类型、标的、方向、入场价、出场价、数量、盈亏、手续费、策略标签和开平仓原因
2. WHEN User 完成每日交易复盘，THE Trading Module SHALL 保存日期、总盈亏、错误总结、做得好的地方和明日计划
3. THE Trading Module SHALL 提供交易列表视图，支持按市场类型、日期范围和策略标签筛选
4. THE Trading Module SHALL 展示近 30 天盈亏曲线图
5. THE Trading Module SHALL 在仪表盘上显示是否有未完成的交易复盘提醒


### Requirement 6

**User Story:** 作为系统用户，我希望能够展示我的项目作品集，以便向他人展示我的技术能力和项目经验

#### Acceptance Criteria

1. WHEN User 添加项目链接，THE Project Module SHALL 自动抓取项目的标题、描述和预览信息
2. THE Project Module SHALL 支持手动输入项目信息，包括项目名称、简短描述、详细 Markdown 描述、技术栈、代码仓库 URL、演示 URL、状态和标签
3. THE Project Module SHALL 支持项目状态管理，包括进行中、已完成和已暂停三种状态
4. THE Project Module SHALL 提供项目列表视图，支持按状态和标签筛选
5. THE Project Module SHALL 提供项目详情页，展示完整的项目信息和链接
6. THE Project Module SHALL 支持将项目页面作为公开的作品集展示
7. WHEN User 粘贴 GitHub 或其他平台的项目链接，THE Project Module SHALL 自动填充项目基本信息

### Requirement 7

**User Story:** 作为系统用户，我希望能够结构化地管理我的网址收藏，以便替代浏览器杂乱的收藏夹

#### Acceptance Criteria

1. WHEN User 添加收藏，THE Bookmark Module SHALL 保存标题、URL、描述、分类、标签和状态
2. THE Bookmark Module SHALL 支持收藏状态管理，包括待阅读、阅读中和已完成三种状态
3. WHEN User 访问收藏链接，THE Bookmark Module SHALL 更新最后访问时间和访问次数
4. THE Bookmark Module SHALL 提供收藏列表视图，支持按分类、状态和标签筛选
5. WHEN User 标记收藏为喜爱，THE Bookmark Module SHALL 更新该收藏的喜爱状态

### Requirement 8

**User Story:** 作为系统用户，我希望能够在仪表盘上查看各模块的聚合信息，以便快速了解今日重点和系统整体状态

#### Acceptance Criteria

1. THE Dashboard Module SHALL 显示今日任务列表和重点事项
2. THE Dashboard Module SHALL 显示今日健康打卡完成状态
3. THE Dashboard Module SHALL 显示是否有未完成的交易复盘提醒
4. THE Dashboard Module SHALL 显示今日/本周需要发布的社媒内容数量
5. THE Dashboard Module SHALL 显示最新保存的资讯、博客草稿和项目进展摘要

### Requirement 9

**User Story:** 作为系统用户，我希望系统采用现代化的技术栈和架构，以便获得良好的性能和开发体验

#### Acceptance Criteria

1. THE Personal OS System SHALL 使用 Next.js 15 App Router 作为 Web 框架
2. THE Personal OS System SHALL 使用 React 19 和 React Server Components 进行前端开发
3. THE Personal OS System SHALL 使用 TypeScript 作为开发语言
4. THE Personal OS System SHALL 使用 PostgreSQL 作为数据库和 Prisma 作为 ORM
5. THE Personal OS System SHALL 使用 Tailwind CSS 和 shadcn/ui 作为 UI 框架


### Requirement 10

**User Story:** 作为系统用户，我希望系统提供统一的用户认证和标签管理，以便安全地使用系统并组织内容

#### Acceptance Criteria

1. THE Personal OS System SHALL 支持用户注册和登录功能
2. THE Personal OS System SHALL 为每个用户保存用户 ID、姓名、邮箱、头像和时区信息
3. THE Personal OS System SHALL 提供跨模块的标签系统，支持创建和管理标签
4. WHEN User 创建标签，THE Personal OS System SHALL 保存标签名称和类型（健康/博客/交易/收藏/社媒等）
5. THE Personal OS System SHALL 允许用户在各个模块中使用标签对内容进行分类

### Requirement 11

**User Story:** 作为系统用户，我希望系统提供全局搜索功能，以便快速找到我需要的信息

#### Acceptance Criteria

1. THE Personal OS System SHALL 提供全局搜索入口
2. WHEN User 输入搜索关键词，THE Personal OS System SHALL 在笔记、资讯、收藏和项目中搜索匹配内容
3. THE Personal OS System SHALL 显示搜索结果列表，包含内容类型、标题和摘要
4. WHEN User 点击搜索结果，THE Personal OS System SHALL 导航到对应的详情页
5. THE Personal OS System SHALL 支持按内容类型筛选搜索结果

### Requirement 12

**User Story:** 作为系统用户，我希望系统提供数据可视化功能，以便直观地了解各项数据的趋势

#### Acceptance Criteria

1. THE Health Module SHALL 提供健康趋势图，展示睡眠时长、心情评分和能量评分的变化曲线
2. THE Trading Module SHALL 提供交易盈亏曲线图，展示近期交易表现
3. THE Trading Module SHALL 计算并显示交易胜率统计
4. THE Social Module SHALL 提供内容发布频率统计图表
5. THE Social Module SHALL 提供内容表现对比图表，展示不同平台或内容类型的数据表现

### Requirement 13

**User Story:** 作为系统开发者，我希望系统采用合理的架构设计，以便后续功能扩展和维护

#### Acceptance Criteria

1. THE Personal OS System SHALL 使用 Server Components 作为默认组件类型，仅在需要交互时使用 Client Components
2. THE Personal OS System SHALL 使用 Server Actions 处理表单提交和数据变更操作
3. THE Personal OS System SHALL 使用 Route Handlers 提供 REST API 端点
4. THE Personal OS System SHALL 使用 TanStack Query 管理需要频繁交互的客户端数据
5. THE Personal OS System SHALL 采用左侧固定导航和顶部操作栏的后台管理风格布局

### Requirement 14

**User Story:** 作为系统用户，我希望所有模块的功能都是真实可用的，以便我能够实际使用系统管理我的个人数据

#### Acceptance Criteria

1. THE Personal OS System SHALL 确保所有 API 端点都正确连接到数据库并返回真实数据
2. THE Personal OS System SHALL 确保所有表单提交都能成功保存数据到数据库
3. THE Personal OS System SHALL 确保所有列表页面都能正确显示数据库中的数据
4. THE Personal OS System SHALL 确保所有编辑和删除操作都能正确更新数据库
5. THE Personal OS System SHALL 确保所有数据统计和图表都基于真实的数据库查询结果
6. THE Personal OS System SHALL 提供完整的错误处理和用户反馈机制
7. THE Personal OS System SHALL 确保所有页面之间的导航和数据流转都正常工作
