'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface QuickTradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function QuickTradeDialog({ open, onOpenChange, onSuccess }: QuickTradeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    market: 'CRYPTO',
    symbol: '',
    direction: 'LONG',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    fees: '0',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const entryPrice = parseFloat(formData.entryPrice)
      const exitPrice = parseFloat(formData.exitPrice)
      const quantity = parseFloat(formData.quantity)
      const fees = parseFloat(formData.fees)
      
      const pnl = formData.direction === 'LONG'
        ? (exitPrice - entryPrice) * quantity - fees
        : (entryPrice - exitPrice) * quantity - fees

      const response = await fetch('/api/trading/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          market: formData.market,
          symbol: formData.symbol,
          direction: formData.direction,
          entryPrice,
          exitPrice,
          quantity,
          fees,
          pnl,
        }),
      })

      if (response.ok) {
        toast.success('交易已记录')
        onOpenChange(false)
        onSuccess?.()
        setFormData({
          market: 'CRYPTO',
          symbol: '',
          direction: 'LONG',
          entryPrice: '',
          exitPrice: '',
          quantity: '',
          fees: '0',
        })
      } else {
        toast.error('记录失败')
      }
    } catch (error) {
      toast.error('记录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>快速记录交易</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="market">市场</Label>
              <select
                id="market"
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="CRYPTO">加密货币</option>
                <option value="STOCK">股票</option>
                <option value="FOREX">外汇</option>
              </select>
            </div>

            <div>
              <Label htmlFor="direction">方向</Label>
              <select
                id="direction"
                value={formData.direction}
                onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="LONG">做多</option>
                <option value="SHORT">做空</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="symbol">交易对 *</Label>
            <Input
              id="symbol"
              required
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="BTC/USDT"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryPrice">入场价 *</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.01"
                required
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="exitPrice">出场价 *</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.01"
                required
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">数量 *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="fees">手续费</Label>
              <Input
                id="fees"
                type="number"
                step="0.01"
                value={formData.fees}
                onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? '记录中...' : '记录'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
