'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTrade } from '@/lib/actions/trading'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CreateTradeDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const entryPrice = parseFloat(formData.get('entryPrice') as string)
    const exitPrice = parseFloat(formData.get('exitPrice') as string)
    const quantity = parseFloat(formData.get('quantity') as string)
    const fees = parseFloat(formData.get('fees') as string)
    
    const pnl = (exitPrice - entryPrice) * quantity - fees

    const data = {
      date: new Date(formData.get('date') as string),
      market: formData.get('market') as 'A_STOCK' | 'US_STOCK' | 'CRYPTO' | 'FOREX' | 'FUTURES',
      symbol: formData.get('symbol') as string,
      direction: formData.get('direction') as 'LONG' | 'SHORT',
      entryPrice,
      exitPrice,
      quantity,
      pnl,
      fees,
      strategyTag: formData.get('strategyTag') as string || undefined,
      reasonOpen: formData.get('reasonOpen') as string || undefined,
      reasonClose: formData.get('reasonClose') as string || undefined,
    }

    const result = await createTrade(data)

    if (result.success) {
      toast.success('Trade recorded!')
      setOpen(false)
      e.currentTarget.reset()
    } else {
      toast.error(result.error || 'Failed to create trade')
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Trade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Trade</DialogTitle>
          <DialogDescription>
            Log your trading activity
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="market">Market</Label>
              <Select name="market" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A_STOCK">A股</SelectItem>
                  <SelectItem value="US_STOCK">美股</SelectItem>
                  <SelectItem value="CRYPTO">加密货币</SelectItem>
                  <SelectItem value="FOREX">外汇</SelectItem>
                  <SelectItem value="FUTURES">期货</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                placeholder="e.g., AAPL, BTC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Direction</Label>
              <Select name="direction" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LONG">做多 (Long)</SelectItem>
                  <SelectItem value="SHORT">做空 (Short)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                id="exitPrice"
                name="exitPrice"
                type="number"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fees">Fees</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                step="0.01"
                defaultValue="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategyTag">Strategy Tag</Label>
              <Input
                id="strategyTag"
                name="strategyTag"
                placeholder="e.g., Breakout, Trend"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonOpen">Reason to Open</Label>
            <Textarea
              id="reasonOpen"
              name="reasonOpen"
              placeholder="Why did you enter this trade?"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonClose">Reason to Close</Label>
            <Textarea
              id="reasonClose"
              name="reasonClose"
              placeholder="Why did you exit this trade?"
              rows={2}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Recording...' : 'Record Trade'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
