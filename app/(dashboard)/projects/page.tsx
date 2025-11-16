import { requireAuth } from '@/lib/auth'
import { projectsService } from '@/lib/services/projects'
import { ProjectsList } from '@/components/projects/projects-list'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'

export default async function ProjectsPage() {
  const userId = await requireAuth()
  const projects = await projectsService.getProjects(userId)

  return (
    <div className="space-y-8">
      <PageHeader
        title="项目集"
        description="展示正在进行与已完成的作品，支持按阶段筛选。"
        accent="iris"
        actions={<CreateProjectDialog />}
      />

      <PageSection title="项目面板" description="查看不同阶段的进展">
        <ProjectsList projects={projects} />
      </PageSection>
    </div>
  )
}
