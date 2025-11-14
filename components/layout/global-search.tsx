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

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
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
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (type: string, id: string) => {
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="h-4 w-4" />
      case 'news': return <Newspaper className="h-4 w-4" />
      case 'bookmark': return <Bookmark className="h-4 w-4" />
      case 'project': return <FolderKanban className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-xs">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search blog posts, news, bookmarks, projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />

            {loading && (
              <div className="text-center text-sm text-gray-500 py-8">
                Searching...
              </div>
            )}

            {results && results.total === 0 && (
              <div className="text-center text-sm text-gray-500 py-8">
                No results found
              </div>
            )}

            {results && results.total > 0 && (
              <div className="space-y-4">
                {results.blog.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Blog Posts</h3>
                    <div className="space-y-2">
                      {results.blog.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('blog', item.id)}
                          className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {getIcon('blog')}
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              <Badge variant="outline" className="text-xs mt-1">
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
                    <h3 className="text-sm font-semibold mb-2">News</h3>
                    <div className="space-y-2">
                      {results.news.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('news', item.id)}
                          className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {getIcon('news')}
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{item.source.name}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.bookmarks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Bookmarks</h3>
                    <div className="space-y-2">
                      {results.bookmarks.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('bookmark', item.id)}
                          className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {getIcon('bookmark')}
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
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
                    <h3 className="text-sm font-semibold mb-2">Projects</h3>
                    <div className="space-y-2">
                      {results.projects.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick('project', item.id)}
                          className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            {getIcon('project')}
                            <div className="flex-1">
                              <p className="font-medium">{item.title}</p>
                              <Badge variant="outline" className="text-xs mt-1">
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
