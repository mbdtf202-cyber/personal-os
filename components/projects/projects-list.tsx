'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ExternalLink, Github, Globe } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  techStack?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  imageUrl?: string | null
  previewImage?: string | null
  stars?: number | null
  language?: string | null
  startDate?: Date | null
  endDate?: Date | null
  isPublic: boolean
  createdAt: Date
}

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [filter, setFilter] = useState<'all' | 'idea' | 'in_progress' | 'completed'>('all')

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true
    return project.status.toLowerCase() === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IDEA': return 'secondary'
      case 'IN_PROGRESS': return 'default'
      case 'COMPLETED': return 'default'
      case 'ARCHIVED': return 'outline'
      default: return 'secondary'
    }
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center theme-text-secondary">
          No projects yet. Add your first project!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({projects.length})
        </Button>
        <Button
          variant={filter === 'idea' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('idea')}
        >
          Ideas ({projects.filter(p => p.status === 'IDEA').length})
        </Button>
        <Button
          variant={filter === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('in_progress')}
        >
          In Progress ({projects.filter(p => p.status === 'IN_PROGRESS').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({projects.filter(p => p.status === 'COMPLETED').length})
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              {(project.previewImage || project.imageUrl) && (
                <img
                  src={project.previewImage || project.imageUrl || ''}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  {project.language && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.language}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={getStatusColor(project.status) as any}>
                    {project.status}
                  </Badge>
                  {project.stars !== null && project.stars !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>⭐</span>
                      <span>{project.stars}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
                  {project.description && (
                    <p className="text-sm theme-text-secondary line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {project.techStack && (
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.split(',').map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs rounded-full bg-white/60 px-3 py-1 theme-text-secondary dark:bg-white/10"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs theme-text-tertiary">
                    {project.startDate && (
                      <div>Started: {format(new Date(project.startDate), 'MMM yyyy')}</div>
                    )}
                {project.endDate && (
                  <div>Completed: {format(new Date(project.endDate), 'MMM yyyy')}</div>
                )}
              </div>

                  <div className="flex gap-2 pt-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs theme-color-primary hover:opacity-80"
                      >
                        <Github className="h-3 w-3" />
                        Code
                  </a>
                )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs theme-color-primary hover:opacity-80"
                      >
                        <Globe className="h-3 w-3" />
                        Live
                  </a>
                )}
                {project.isPublic && (
                  <Badge variant="outline" className="text-xs">Public</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
