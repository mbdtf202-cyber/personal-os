'use client'

import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'

export interface NewsSource {
  name: string
  type: string
  [key: string]: unknown
}

export interface NewsItem {
  id: string
  title: string
  url: string
  summary: string | null
  previewImage: string | null
  siteName: string | null
  domain: string | null
  faviconUrl: string | null
  type: string
  publishedAt: string
  isRead: boolean
  isFavorited: boolean
  source: NewsSource
}

async function fetchNewsItems(filter: 'all' | 'unread' | 'favorites'): Promise<NewsItem[]> {
  const params = new URLSearchParams()
  if (filter === 'unread') {
    params.set('isRead', 'false')
  }
  if (filter === 'favorites') {
    params.set('isFavorited', 'true')
  }

  const response = await fetch(`/api/news/items?${params.toString()}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to load news items')
  }

  const data = await response.json()
  return data.items as NewsItem[]
}

async function updateNewsItem(
  id: string,
  updates: Partial<Pick<NewsItem, 'isRead' | 'isFavorited'>>
): Promise<NewsItem> {
  const response = await fetch(`/api/news/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    const message = payload?.error ?? 'Failed to update news item'
    throw new Error(message)
  }

  return (await response.json()) as NewsItem
}

export function useNewsItems(filter: 'all' | 'unread' | 'favorites') {
  const queryKey = useMemo<QueryKey>(() => ['newsItems', filter], [filter])

  const query = useQuery({
    queryKey,
    queryFn: () => fetchNewsItems(filter),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  return {
    ...query,
    items: query.data ?? [],
    queryKey,
  }
}

interface MutationVariables {
  id: string
  updates: Partial<Pick<NewsItem, 'isRead' | 'isFavorited'>>
}

interface MutationContext {
  previousItems?: NewsItem[]
}

export function useNewsItemMutation(queryKey: QueryKey) {
  const queryClient = useQueryClient()

  return useMutation<NewsItem, Error, MutationVariables, MutationContext>({
    mutationFn: ({ id, updates }) => updateNewsItem(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousItems = queryClient.getQueryData<NewsItem[]>(queryKey)

      if (previousItems) {
        queryClient.setQueryData<NewsItem[]>(
          queryKey,
          previousItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                }
              : item
          )
        )
      }

      return { previousItems }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems)
      }
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<NewsItem[]>(queryKey, (items) => {
        if (!items) return items
        return items.map((item) =>
          item.id === updatedItem.id
            ? {
                ...item,
                ...updatedItem,
              }
            : item
        )
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
