import { requireAuth } from '@/lib/auth'
import { bookmarksService } from '@/lib/services/bookmarks'
import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkDialog } from '@/components/bookmarks/create-bookmark-dialog'

export default async function BookmarksPage() {
  const userId = await requireAuth()
  const bookmarks = await bookmarksService.getBookmarks(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookmarks</h1>
          <p className="text-gray-600 mt-1">Manage your bookmarks and resources</p>
        </div>
        <CreateBookmarkDialog />
      </div>

      <BookmarksList bookmarks={bookmarks} />
    </div>
  )
}
