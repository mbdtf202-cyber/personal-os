# Implementation Plan

- [x] 1. 初始化项目和基础配置
  - 创建 Next.js 15 项目，配置 TypeScript、Tailwind CSS 和 ESLint
  - 安装并配置 Prisma、shadcn/ui、Recharts 等核心依赖
  - 设置项目目录结构（app、components、lib、prisma 等）
  - 配置环境变量模板（.env.example）
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 2. 实现数据库模型和 Prisma 配置
  - [x] 2.1 创建 Prisma Schema 文件
    - 定义 User 和 Tag 公共基础模型
    - 定义健康管理模型（HealthDailyLog、Habit、HabitCheckin）
    - 定义博客笔记模型（Post、PostLink）
    - 定义资讯聚合模型（NewsSource、NewsItem）
    - 定义社媒管理模型（SocialPost、SocialPostStats）
    - 定义交易记录模型（Trade、TradingDailySummary）
    - 定义项目展示模型（Project）
    - 定义收藏管理模型（Bookmark）
    - 添加所有必要的索引和关系定义
    - _Requirements: 9.4, 10.2, 10.4_
  
  - [x] 2.2 创建初始数据库迁移
    - 运行 `prisma migrate dev` 生成迁移文件
    - 验证数据库表结构正确创建
    - _Requirements: 9.4_
  
  - [x] 2.3 创建数据库 seed 脚本
    - 编写 seed.ts 创建测试用户和示例数据
    - _Requirements: 9.4_

- [x] 3. 实现认证系统和用户管理
  - [x] 3.1 配置 NextAuth.js 或 Clerk
    - 安装认证库并配置 API 路由
    - 实现用户注册和登录功能
    - 创建认证辅助函数（getCurrentUserId、requireAuth）
    - _Requirements: 10.1, 10.2_
  
  - [x] 3.2 创建认证页面
    - 实现登录页面（app/(auth)/login）
    - 实现注册页面（app/(auth)/register）
    - 添加表单验证和错误处理
    - _Requirements: 10.1_

- [x] 4. 实现核心布局和 UI 组件
  - [x] 4.1 安装和配置 shadcn/ui 组件
    - 初始化 shadcn/ui
    - 安装核心 UI 组件（Button、Card、Input、Table、Dialog 等）
    - 配置主题系统（亮色/暗色模式）
    - _Requirements: 9.5, 13.5_
  
  - [x] 4.2 创建主应用布局
    - 实现 Dashboard Layout（app/(dashboard)/layout.tsx）
    - 创建侧边栏导航组件（components/layout/sidebar.tsx）
    - 创建顶部栏组件（components/layout/header.tsx）
    - 实现响应式布局（桌面/平板/移动端）
    - _Requirements: 13.5_
  
  - [x] 4.3 创建通用 UI 组件
    - 实现 DashboardCard 组件
    - 实现 DataTable 组件（支持排序、筛选、分页）
    - 实现 LineChart 和其他图表组件
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_



- [x] 5. 实现健康管理模块
  - [x] 5.1 创建健康服务层
    - 实现 HealthService 类（lib/services/health.ts）
    - 编写健康记录 CRUD 方法
    - 编写习惯管理和打卡方法
    - 实现健康数据统计和趋势计算
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 5.2 创建健康数据验证 Schema
    - 使用 Zod 定义 healthLogSchema
    - 定义 habitSchema 和 habitCheckinSchema
    - _Requirements: 1.1, 1.3_
  
  - [x] 5.3 实现健康 Server Actions
    - 创建 createHealthLog action
    - 创建 createHabit 和 checkinHabit actions
    - 添加错误处理和数据验证
    - _Requirements: 1.1, 1.3, 1.4, 13.2_
  
  - [x] 5.4 创建健康管理页面
    - 实现健康记录列表页（app/(dashboard)/health/page.tsx）
    - 实现健康记录表单组件
    - 实现习惯管理页面（app/(dashboard)/health/habits/page.tsx）
    - 实现习惯打卡界面
    - 添加日期筛选和数据展示
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 5.5 实现健康趋势图表
    - 创建健康趋势图表组件
    - 展示睡眠、心情、能量评分的变化曲线
    - _Requirements: 1.2, 12.1_

- [x] 6. 实现博客笔记模块
  - [x] 6.1 创建博客服务层
    - 实现 BlogService 类（lib/services/blog.ts）
    - 编写文章 CRUD 方法
    - 实现文章关联功能（PostLink）
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 6.2 创建博客数据验证 Schema
    - 使用 Zod 定义 postSchema
    - 定义 postLinkSchema
    - _Requirements: 2.1_
  
  - [x] 6.3 实现博客 Server Actions
    - 创建 createPost 和 updatePost actions
    - 创建 updatePostStatus action
    - 创建 createPostLink action
    - _Requirements: 2.1, 2.2, 2.5, 13.2_
  
  - [x] 6.4 创建博客管理页面
    - 实现文章列表页（app/(dashboard)/blog/page.tsx）
    - 实现文章详情页（app/(dashboard)/blog/[id]/page.tsx）
    - 实现文章编辑页（app/(dashboard)/blog/[id]/edit/page.tsx）
    - 实现新建文章页（app/(dashboard)/blog/new/page.tsx）
    - 添加分类、状态和标签筛选
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  
  - [x] 6.5 集成 Markdown 编辑器
    - 安装并配置 Markdown 编辑器组件
    - 实现 Markdown 预览功能
    - _Requirements: 2.1, 2.5_

- [x] 7. 实现资讯聚合模块
  - [x] 7.1 创建资讯服务层
    - 实现 NewsService 类（lib/services/news.ts）
    - 编写资讯源管理方法
    - 实现 RSS 抓取功能（fetchFromRSS）
    - 实现资讯列表查询和筛选
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 7.2 创建资讯数据验证 Schema
    - 使用 Zod 定义 newsSourceSchema
    - 定义 newsItemSchema
    - _Requirements: 3.1_
  
  - [x] 7.3 实现资讯 API 端点
    - 创建 GET /api/news/items 端点
    - 创建 PATCH /api/news/items/:id 端点（更新已读/收藏状态）
    - 创建 POST /api/news/refresh 端点（触发抓取）
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 13.3_
  
  - [x] 7.4 创建资讯管理页面
    - 实现资讯列表页（app/(dashboard)/news/page.tsx）
    - 实现资讯源配置页（app/(dashboard)/news/sources/page.tsx）
    - 添加类型筛选、搜索和状态切换
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  
  - [x] 7.5 实现定时任务脚本
    - 创建资讯抓取脚本（scripts/fetch-news.ts）
    - 配置 Vercel Cron 或系统 crontab
    - 添加错误处理和日志记录
    - _Requirements: 3.2_

- [x] 8. 实现社媒管理模块
  - [x] 8.1 创建社媒服务层
    - 实现 SocialService 类（lib/services/social.ts）
    - 编写社媒内容 CRUD 方法
    - 实现数据统计记录方法
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 8.2 创建社媒数据验证 Schema
    - 使用 Zod 定义 socialPostSchema
    - 定义 socialPostStatsSchema
    - _Requirements: 4.1, 4.4_
  
  - [x] 8.3 实现社媒 API 端点
    - 创建 GET /api/social/posts 端点
    - 创建 POST /api/social/posts 端点
    - 创建 POST /api/social/posts/:id/stats 端点
    - _Requirements: 4.1, 4.2, 4.4, 13.3_
  
  - [x] 8.4 创建社媒管理页面
    - 实现社媒内容列表页（app/(dashboard)/social/page.tsx）
    - 实现内容创建/编辑表单
    - 实现状态流转界面（想法→草稿→已排期→已发布）
    - 实现数据录入界面
    - 添加平台和状态筛选
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 8.5 实现社媒数据可视化
    - 创建发布频率统计图表
    - 创建内容表现对比图表
    - _Requirements: 4.5, 12.4, 12.5_



- [x] 9. 实现交易记录模块
  - [x] 9.1 创建交易服务层
    - 实现 TradingService 类（lib/services/trading.ts）
    - 编写交易记录 CRUD 方法
    - 实现每日复盘管理方法
    - 实现交易统计计算（总盈亏、胜率）
    - 实现盈亏曲线数据生成
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 9.2 创建交易数据验证 Schema
    - 使用 Zod 定义 tradeSchema
    - 定义 tradingSummarySchema
    - _Requirements: 5.1, 5.2_
  
  - [x] 9.3 实现交易 API 端点
    - 创建 GET /api/trading/trades 端点
    - 创建 POST /api/trading/trades 端点
    - 创建 POST /api/trading/summaries 端点
    - 创建 GET /api/trading/chart 端点
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 13.3_
  
  - [x] 9.4 创建交易管理页面
    - 实现交易列表页（app/(dashboard)/trading/page.tsx）
    - 实现交易记录表单
    - 实现每日复盘表单
    - 添加市场类型、日期范围和策略标签筛选
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 9.5 实现交易数据可视化
    - 创建盈亏曲线图组件
    - 显示交易统计（总盈亏、胜率、交易次数）
    - _Requirements: 5.4, 12.2, 12.3_

- [x] 10. 实现项目展示模块
  - [x] 10.1 创建项目服务层
    - 实现 ProjectService 类（lib/services/projects.ts）
    - 编写项目 CRUD 方法
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 10.2 创建项目数据验证 Schema
    - 使用 Zod 定义 projectSchema
    - _Requirements: 6.1_
  
  - [x] 10.3 实现项目 API 端点
    - 创建 GET /api/projects 端点
    - 创建 POST /api/projects 端点
    - 创建 PUT /api/projects/:id 端点
    - _Requirements: 6.1, 6.3, 13.3_
  
  - [x] 10.4 创建项目管理页面
    - 实现项目列表页（app/(dashboard)/projects/page.tsx）
    - 实现项目详情页（app/(dashboard)/projects/[id]/page.tsx）
    - 实现项目创建/编辑表单
    - 添加状态和标签筛选
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 10.5 实现公开项目展示页
    - 创建公开访问的项目作品集页面
    - 优化 SEO 和分享预览
    - _Requirements: 6.5_

- [x] 11. 实现收藏管理模块
  - [x] 11.1 创建收藏服务层
    - 实现 BookmarkService 类（lib/services/bookmarks.ts）
    - 编写收藏 CRUD 方法
    - 实现访问记录更新方法
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 11.2 创建收藏数据验证 Schema
    - 使用 Zod 定义 bookmarkSchema
    - _Requirements: 7.1_
  
  - [x] 11.3 实现收藏 API 端点
    - 创建 GET /api/bookmarks 端点
    - 创建 POST /api/bookmarks 端点
    - 创建 PATCH /api/bookmarks/:id/visit 端点
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 13.3_
  
  - [x] 11.4 创建收藏管理页面
    - 实现收藏列表页（app/(dashboard)/bookmarks/page.tsx）
    - 实现收藏添加/编辑表单
    - 添加分类、状态和标签筛选
    - 实现快速添加书签功能
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

- [x] 12. 实现仪表盘聚合功能
  - [x] 12.1 创建仪表盘服务层
    - 实现 DashboardService 类（lib/services/dashboard.ts）
    - 编写今日概览数据聚合方法
    - 实现各模块状态检查方法
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 12.2 创建仪表盘页面
    - 实现仪表盘首页（app/(dashboard)/page.tsx）
    - 显示今日任务和重点事项
    - 显示今日健康打卡状态
    - 显示未完成交易复盘提醒
    - 显示待发布社媒内容
    - 显示最新资讯、博客草稿和项目进展
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 1.5, 4.5, 5.5_
  
  - [x] 12.3 实现仪表盘卡片组件
    - 创建各模块的仪表盘卡片
    - 添加快速操作链接
    - 实现数据刷新机制
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 13. 实现全局搜索功能
  - [x] 13.1 创建搜索服务层
    - 实现 SearchService 类（lib/services/search.ts）
    - 编写全局搜索方法（支持博客、资讯、收藏、项目）
    - 实现搜索结果聚合和排序
    - _Requirements: 11.1, 11.2, 11.3, 11.5_
  
  - [x] 13.2 实现搜索 API 端点
    - 创建 GET /api/search 端点
    - 支持关键词搜索和类型筛选
    - _Requirements: 11.2, 11.5, 13.3_
  
  - [x] 13.3 创建搜索 UI 组件
    - 实现全局搜索框（在顶部栏）
    - 实现搜索结果页面
    - 添加类型筛选和结果高亮
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_



- [x] 14. 实现标签管理系统
  - [x] 14.1 创建标签服务层
    - 实现 TagService 类（lib/services/tags.ts）
    - 编写标签 CRUD 方法
    - 实现标签关联查询方法
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [x] 14.2 实现标签 API 端点
    - 创建 GET /api/tags 端点
    - 创建 POST /api/tags 端点
    - _Requirements: 10.3, 10.4, 13.3_
  
  - [x] 14.3 创建标签管理 UI
    - 实现标签选择器组件
    - 实现标签管理页面
    - 在各模块中集成标签功能
    - _Requirements: 10.3, 10.4, 10.5_

- [x] 15. 实现性能优化
  - [x] 15.1 优化 Server Components 使用
    - 确保默认使用 Server Components
    - 仅在需要交互时使用 Client Components
    - 添加 loading.tsx 和 Suspense 边界
    - _Requirements: 13.1_
  
  - [x] 15.2 优化数据库查询
    - 添加必要的数据库索引
    - 使用 Prisma select 精确控制查询字段
    - 实现分页功能
    - _Requirements: 9.4_
  
  - [x] 15.3 实现缓存策略
    - 配置静态数据缓存（revalidate）
    - 集成 Redis 缓存热门资讯（可选）
    - _Requirements: 3.3_
  
  - [x] 15.4 优化图片和资源加载
    - 使用 Next.js Image 组件
    - 实现代码分割和动态导入
    - _Requirements: 13.1_

- [x] 16. 实现错误处理和数据验证
  - [x] 16.1 完善 API 错误处理
    - 在所有 API 端点添加统一错误处理
    - 实现认证和授权检查
    - 添加请求日志记录
    - _Requirements: 13.3_
  
  - [x] 16.2 完善 Server Actions 错误处理
    - 在所有 Server Actions 添加错误处理
    - 实现表单验证错误展示
    - _Requirements: 13.2_
  
  - [x] 16.3 实现客户端错误处理
    - 添加全局错误边界
    - 实现 Toast 通知系统
    - 创建错误页面（404、500）
    - _Requirements: 13.1_
  
  - [x] 16.4 完善数据验证
    - 为所有模块创建完整的 Zod Schema
    - 在 API 和 Server Actions 中应用验证
    - _Requirements: 9.3_

- [ ] 17. 编写测试
  - [x] 17.1 编写服务层单元测试
    - 为 HealthService 编写测试
    - 为 TradingService 编写测试
    - 为 SearchService 编写测试
    - _Requirements: 1.1, 5.1, 11.2_
  
  - [x] 17.2 编写 API 集成测试
    - 测试健康管理 API 端点
    - 测试交易记录 API 端点
    - 测试搜索 API 端点
    - _Requirements: 13.3_
  
  - [x] 17.3 编写 E2E 测试
    - 测试用户登录流程
    - 测试健康记录创建流程
    - 测试博客文章发布流程
    - _Requirements: 10.1, 1.1, 2.1_

- [x] 18. 部署准备和配置
  - [x] 18.1 配置生产环境变量
    - 设置数据库连接字符串
    - 配置认证密钥
    - 配置定时任务密钥
    - _Requirements: 9.4_
  
  - [x] 18.2 配置 Vercel 部署
    - 创建 vercel.json 配置文件
    - 配置 Cron Jobs
    - 设置环境变量
    - _Requirements: 3.2_
  
  - [x] 18.3 运行生产构建测试
    - 执行 `npm run build`
    - 验证所有页面正常构建
    - 测试生产环境功能
    - _Requirements: 9.1_
  
  - [x] 18.4 配置数据库迁移
    - 在生产环境运行 Prisma 迁移
    - 验证数据库结构
    - _Requirements: 9.4_

- [x] 19. 文档和优化
  - [x] 19.1 编写 README 文档
    - 添加项目介绍和功能说明
    - 编写本地开发指南
    - 添加部署说明
    - _Requirements: 9.1_
  
  - [x] 19.2 编写 API 文档
    - 记录所有 API 端点
    - 添加请求/响应示例
    - _Requirements: 13.3_
  
  - [x] 19.3 性能监控和优化
    - 添加性能监控工具
    - 分析和优化慢查询
    - 优化首屏加载时间
    - _Requirements: 13.1_

- [x] 20. 功能完善和打磨
  - [x] 20.1 完善用户体验
    - 添加加载状态指示器
    - 优化表单交互体验
    - 添加操作确认对话框
    - _Requirements: 13.5_
  
  - [x] 20.2 完善响应式设计
    - 测试并优化移动端体验
    - 优化平板端布局
    - _Requirements: 13.5_
  
  - [x] 20.3 添加数据导出功能（可选）
    - 实现健康数据导出
    - 实现交易记录导出
    - 支持 CSV/JSON 格式
    - _Requirements: 1.2, 5.3_
  
  - [x] 20.4 集成 AI 功能（可选）
    - 实现每日自动复盘生成
    - 实现资讯摘要生成
    - _Requirements: 3.3, 5.2_

- [ ] 21. 实现链接预览功能
  - [x] 21.1 创建链接预览服务
    - 安装 axios 和 cheerio 依赖
    - 实现 LinkPreviewService 类（lib/services/link-preview.ts）
    - 实现 fetchPreview 方法（抓取 Open Graph 标签）
    - 实现 fetchGitHubRepo 方法（调用 GitHub API）
    - 添加错误处理和超时控制
    - _Requirements: 3.6, 6.1, 6.7_
  
  - [x] 21.2 创建链接预览 API 端点
    - 创建 POST /api/link-preview 端点
    - 实现 URL 验证和安全检查
    - 返回标题、描述、预览图等信息
    - _Requirements: 3.6, 6.7_
  
  - [x] 21.3 创建 GitHub 项目抓取 API
    - 创建 POST /api/projects/fetch-github 端点
    - 调用 LinkPreviewService.fetchGitHubRepo
    - 返回项目名称、描述、stars、语言等信息
    - _Requirements: 6.7_

- [ ] 22. 优化博客创建流程
  - [x] 22.1 更新数据库模型
    - 修改 Post 模型，使 contentMarkdown 字段可选
    - 运行数据库迁移
    - _Requirements: 2.1, 2.2_
  
  - [x] 22.2 重构博客创建 API
    - 修改 POST /api/blog/posts 端点，仅接收标题和元数据
    - 创建文章后返回文章 ID
    - 确保 contentMarkdown 可以为空
    - _Requirements: 2.1, 2.2_
  
  - [x] 22.3 重构博客创建页面
    - 修改 app/(dashboard)/blog/new/page.tsx
    - 创建简化的表单，仅包含标题、分类和标签
    - 提交后重定向到编辑页面 /blog/[id]/edit
    - _Requirements: 2.1, 2.2, 2.6_
  
  - [x] 22.4 创建独立的博客编辑页面
    - 创建 app/(dashboard)/blog/[id]/edit/page.tsx
    - 提供宽敞的 Markdown 编辑器界面
    - 支持实时预览
    - 添加保存和发布按钮
    - _Requirements: 2.5, 2.6_

- [ ] 23. 增强 News 模块
  - [x] 23.1 更新数据库模型
    - 修改 NewsItem 模型，添加 previewImage 字段
    - 运行数据库迁移
    - _Requirements: 3.6, 3.7_
  
  - [x] 23.2 创建手动添加资讯 API
    - 创建 POST /api/news/items 端点
    - 接收 URL 参数
    - 调用 LinkPreviewService 抓取预览信息
    - 保存到数据库并返回
    - _Requirements: 3.6_
  
  - [x] 23.3 更新资讯列表组件
    - 修改资讯卡片组件，显示预览图
    - 添加"添加链接"按钮和对话框
    - 实现链接输入和自动抓取功能
    - _Requirements: 3.6, 3.7_
  
  - [x] 23.4 优化资讯展示
    - 使用卡片布局展示资讯
    - 显示预览图、标题、摘要和来源
    - 添加已读/收藏状态指示
    - _Requirements: 3.7_

- [ ] 24. 增强 Projects 模块
  - [x] 24.1 更新数据库模型
    - 修改 Project 模型，添加 previewImage、stars、language 字段
    - 使 longDescriptionMd 字段可选
    - 运行数据库迁移
    - _Requirements: 6.1, 6.2, 6.7_
  
  - [x] 24.2 更新项目创建 API
    - 修改 POST /api/projects 端点
    - 支持接收 url 参数
    - 如果是 GitHub URL，调用 fetchGitHubRepo 自动填充信息
    - 否则调用 fetchPreview 获取基本信息
    - _Requirements: 6.1, 6.7_
  
  - [x] 24.3 重构项目创建组件
    - 修改 CreateProjectDialog 组件
    - 添加 URL 输入框
    - 实现"从链接导入"功能
    - 自动填充项目信息后允许用户编辑
    - _Requirements: 6.1, 6.7_
  
  - [x] 24.4 优化项目列表展示
    - 显示项目预览图
    - 显示 GitHub stars 和主要语言
    - 添加快速操作按钮（查看仓库、查看演示）
    - _Requirements: 6.4_

- [ ] 25. 全面验证功能可用性
  - [x] 25.1 验证数据库连接
    - 实现 verifyDatabaseConnection 函数
    - 在应用启动时验证数据库连接
    - 添加连接失败的错误提示
    - _Requirements: 14.1_
  
  - [x] 25.2 验证所有 CRUD 操作
    - 测试每个模块的创建功能
    - 测试每个模块的读取功能（列表和详情）
    - 测试每个模块的更新功能
    - 测试每个模块的删除功能
    - 确保所有操作都正确更新数据库
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [x] 25.3 完善错误处理和用户反馈
    - 为所有表单添加加载状态
    - 为所有操作添加成功/失败提示
    - 实现统一的错误处理机制
    - 添加网络错误重试功能
    - _Requirements: 14.6_
  
  - [x] 25.4 验证数据统计和图表
    - 确保仪表盘数据来自真实数据库查询
    - 验证健康趋势图表数据正确
    - 验证交易盈亏曲线数据正确
    - 验证社媒数据统计正确
    - _Requirements: 14.5_
  
  - [x] 25.5 测试页面导航和数据流转
    - 测试创建后跳转到详情页
    - 测试编辑后数据正确更新
    - 测试删除后返回列表页
    - 测试筛选和搜索功能
    - 确保所有页面间的数据流转正常
    - _Requirements: 14.7_
  
  - [x] 25.6 添加空状态处理
    - 为所有列表页面添加空状态组件
    - 提供友好的提示和操作引导
    - 确保新用户体验流畅
    - _Requirements: 14.6_

- [ ] 26. 最终测试和优化
  - [x] 26.1 端到端功能测试
    - 测试完整的用户流程（注册→创建数据→查看→编辑→删除）
    - 测试跨模块功能（如博客关联交易记录）
    - 测试全局搜索功能
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.7_
  
  - [x] 26.2 性能优化验证
    - 检查页面加载速度
    - 优化慢查询
    - 验证图片加载优化
    - 测试大数据量下的性能
    - _Requirements: 14.5_
  
  - [x] 26.3 移动端适配测试
    - 测试所有页面在移动端的显示
    - 优化移动端交互体验
    - 确保响应式布局正常工作
    - _Requirements: 13.5_
  
  - [x] 26.4 编写用户文档
    - 创建功能使用指南
    - 添加常见问题解答
    - 编写部署文档
    - _Requirements: 14.6_
