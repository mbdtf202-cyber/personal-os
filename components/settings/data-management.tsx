// 数据管理面板
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { Download, Upload, Trash2, Database, FileJson, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function DataManagement() {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleExport = async (format: 'json' | 'csv' | 'markdown') => {
    setExporting(true)
    try {
      const response = await fetch(`/api/export?format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `personal-os-export-${Date.now()}.${format === 'markdown' ? 'md' : format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('数据导出成功')
      } else {
        toast.error('导出失败')
      }
    } catch (error) {
      toast.error('导出失败')
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (file: File) => {
    setImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(`导入成功：${result.success} 条记录`)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        toast.error('导入失败')
      }
    } catch (error) {
      toast.error('导入失败：文件格式错误')
    } finally {
      setImporting(false)
    }
  }

  const handleClearCache = async () => {
    if (!confirm('确定要清除所有缓存吗？')) return

    try {
      const response = await fetch('/api/cache/clear', { method: 'POST' })
      if (response.ok) {
        toast.success('缓存已清除')
        setTimeout(() => window.location.reload(), 1000)
      } else {
        toast.error('清除失败')
      }
    } catch (error) {
      toast.error('清除失败')
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-semibold">数据导出</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            导出您的所有数据，支持多种格式
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="gap-2"
            >
              <FileJson className="h-4 w-4" />
              导出 JSON
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              导出 CSV
            </Button>
            <Button
              onClick={() => handleExport('markdown')}
              disabled={exporting}
              variant="outline"
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              导出 Markdown
            </Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-semibold">数据导入</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            从 JSON 文件导入数据
          </p>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImport(file)
            }}
            className="hidden"
            id="import-file"
            disabled={importing}
          />
          <label htmlFor="import-file">
            <Button asChild disabled={importing}>
              <span className="gap-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                {importing ? '导入中...' : '选择文件'}
              </span>
            </Button>
          </label>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="h-5 w-5 text-rose-600" />
            <h3 className="text-lg font-semibold">缓存管理</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            清除应用缓存以释放空间或解决问题
          </p>
          <Button
            onClick={handleClearCache}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            清除缓存
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
