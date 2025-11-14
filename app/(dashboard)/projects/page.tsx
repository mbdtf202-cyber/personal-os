import { requireAuth } from '@/lib/auth'
import { projectsService } from '@/lib/services/projects'
import { ProjectsList } from '@/components/projects/projects-list'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'

export default async function ProjectsPage() {
  const userId = await requireAuth()
  const projects = await projectsService.getProjects(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600 mt-1">Showcase your projects</p>
        </div>
        <CreateProjectDialog />
      </div>

      <ProjectsList projects={projects} />
    </div>
  )
}
