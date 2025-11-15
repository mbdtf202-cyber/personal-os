'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, FileText, Newspaper, Bookmark, FolderKanban } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

type SearchResultType = 'blog' | 'news' | 'bookmark' | 'project'

type BlogResult = { id: string; title: string; status: string }
type NewsResult = { id: string; title: string; source: { name: string } }
type BookmarkResult = { id: string; title: string; description: string | null }
type ProjectResult = { id: string; title: string; status: string }

type SearchResponse = {
  total: number
  blog: BlogResult[]
  news: NewsResult[]
  bookmarks: BookmarkResult[]
  projects: ProjectResult[]
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      performSearch(debouncedQuery)
    } else {
      setResults(null)
    }
  }, [debouncedQuery])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data: SearchResponse = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (type: SearchResultType, id: string) => {
    setOpen(false)
    setQuery('')
    setResults(null)

    switch (type) {
      case 'blog':
        router.push(`/blog/${id}`)
        break
      case 'news':
        router.push('/news')
        break
      case 'bookmark':
        router.push('/bookmarks')
        break
      case 'project':
        router.push('/projects')
        break
    }
  }

  const getIcon = (type: SearchResultType | 'default') => {
    switch (type) {
      case 'blog':
        return <FileText className="h-4 w-4" />
      case 'news':
        return <Newspaper className="h-4 w-4" />
      case 'bookmark':
        return <Bookmark className="h-4 w-4" />
      case 'project':
        return <FolderKanban className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2.5 text-sm font-medium text-slate-500 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all hover:scale-[1.01] hover:text-slate-700 hover:shadow-[0_18px_40px_rgba(79,70,229,0.15)] focus:outline-none focus:ring-2 focus:ring-sky-200 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300"
      >
        <Search className="h-4 w-4 text-sky-500 transition-colors group-hover:text-indigo-500" />
        <span className="hidden text-sm sm:inline">Search the workspace</span>
        <kbd className="hidden items-center gap-1 rounded-full border border-white/50 bg-white/80 px-2 py-0.5 font-mono text-[10px] text-slate-400 shadow-sm sm:flex dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto rounded-[2rem] border-white/60 bg-white/80 p-6 shadow-[0_40px_90px_rgba(15,23,42,0.2)] backdrop-blur-3xl dark:border-white/10 dark:bg-slate-900/80">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-700 dark:text-white">
              Search
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search blog posts, news, bookmarks, projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="h-12 rounded-full border-white/50 bg-white/80 px-5 text-base shadow-inner shadow-white/40 focus:border-sky-300 focus:ring-sky-200 dark:border-white/10 dark:bg-white/10"
            />

            {loading && (
              <div className="py-10 text-center text-sm text-slate-400">Searching...</div>
            )}

            {results && results.total === 0 && (
              <div className="py-10 text-center text-sm text-slate-400">No results found</div>
            )}

            {results && results.total > 0 && (
              <div className="space-y-6">
                {results.blog.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-500">Blog Posts</h3>
                    <div className="space-y-2">
                      {results.blog.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('blog', item.id)}
                          className="w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-500">
                              {getIcon('blog')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-700 dark:text-white">{item.title}</p>
                              <Badge variant="outline" className="mt-2 rounded-full border-white/50 px-2 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-200">
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.news.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-500">News</h3>
                    <div className="space-y-2">
                      {results.news.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('news', item.id)}
                          className="w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500">
                              {getIcon('news')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-700 dark:text-white">{item.title}</p>
                              <p className="mt-2 text-xs text-slate-400 dark:text-slate-300">{item.source.name}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.bookmarks.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-500">Bookmarks</h3>
                    <div className="space-y-2">
                      {results.bookmarks.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('bookmark', item.id)}
                          className="w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-500">
                              {getIcon('bookmark')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-700 dark:text-white">{item.title}</p>
                              {item.description && (
                                <p className="mt-2 text-xs text-slate-400 dark:text-slate-300 line-clamp-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-500">Projects</h3>
                    <div className="space-y-2">
                      {results.projects.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('project', item.id)}
                          className="w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-500">
                              {getIcon('project')}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-700 dark:text-white">{item.title}</p>
                              <Badge variant="outline" className="mt-2 rounded-full border-white/50 px-2 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-200">
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
