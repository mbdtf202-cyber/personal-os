import { requireAuth } from '@/lib/auth'
import { tradingService } from '@/lib/services/trading'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default async function TradingPage() {
  const userId = await requireAuth()
  const trades = await tradingService.getTrades(userId)
  const stats = await tradingService.getTradeStatistics(userId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trading</h1>
          <p className="text-gray-600 mt-1">Track your trades and performance</p>
        </div>
        <Button>New Trade</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-600">Total P&L (30d)</p>
          <p className={`text-2xl font-bold ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.totalPnl.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-600">Win Rate</p>
          <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-600">Total Trades</p>
          <p className="text-2xl font-bold">{stats.totalTrades}</p>
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-gray-500">No trades yet. Record your first trade!</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Symbol</th>
                  <th className="text-left p-4">Direction</th>
                  <th className="text-right p-4">P&L</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b last:border-0">
                    <td className="p-4">{format(new Date(trade.date), 'MMM dd, yyyy')}</td>
                    <td className="p-4">{trade.symbol}</td>
                    <td className="p-4">{trade.direction}</td>
                    <td className={`p-4 text-right font-semibold ${Number(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Number(trade.pnl).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
