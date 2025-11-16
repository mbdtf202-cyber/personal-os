import { requireAuth } from '@/lib/auth'
import { bookmarksService } from '@/lib/services/bookmarks'
import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkDialog } from '@/components/bookmarks/create-bookmark-dialog'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'

export default async function BookmarksPage() {
  const userId = await requireAuth()
  const bookmarks = await bookmarksService.getBookmarks(userId)

  return (
    <div className="space-y-8">
      <PageHeader
        title="知识书签库"
        description="将灵感、文章、工具集中管理，随时检索。"
        accent="aqua"
        actions={<CreateBookmarkDialog />}
      />

      <PageSection title="全部收藏" description="支持状态与分类筛选">
        <BookmarksList bookmarks={bookmarks} />
      </PageSection>
    </div>
  )
}
