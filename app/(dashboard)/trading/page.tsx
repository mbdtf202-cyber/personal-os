import { requirePageAuth } from '@/lib/auth'
import { tradingService } from '@/lib/services/trading'
import { format } from 'date-fns'
import { PageHeader } from '@/components/layout/page-header'
import { PageSection } from '@/components/layout/page-section'
import { GlassCard } from '@/components/ui/glass-card'
import { CreateTradeDialog } from '@/components/trading/create-trade-dialog'

export default async function TradingPage() {
  const { id: userId } = await requirePageAuth()
  const trades = await tradingService.getTrades(userId)
  const stats = await tradingService.getTradeStatistics(userId)

  return (
    <div className="space-y-8">
      <PageHeader
        title="量化交易"
        description="多市场交易记录、胜率与盈亏在一个仪表盘中呈现。"
        accent="aqua"
        actions={<CreateTradeDialog />}
      />

      <PageSection title="30 天表现">
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-6">
            <p className="text-sm theme-text-tertiary">总收益 (30 天)</p>
            <p className={`mt-2 text-3xl font-semibold ${stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              ${stats.totalPnl.toFixed(2)}
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-sm theme-text-tertiary">胜率</p>
            <p className="mt-2 text-3xl font-semibold theme-text-primary">{stats.winRate.toFixed(1)}%</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-sm theme-text-tertiary">交易次数</p>
            <p className="mt-2 text-3xl font-semibold theme-text-primary">{stats.totalTrades}</p>
          </GlassCard>
        </div>
      </PageSection>

      <PageSection title="交易明细" description="所有记录支持排序导出">
        {trades.length === 0 ? (
          <div className="py-12 text-center theme-text-secondary">
            暂无交易，先记录一笔吧。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] theme-text-tertiary">
                  <th className="p-4">日期</th>
                  <th className="p-4">标的</th>
                  <th className="p-4">方向</th>
                  <th className="p-4 text-right">盈亏</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-t theme-border">
                    <td className="p-4">{format(new Date(trade.date), 'yyyy-MM-dd')}</td>
                    <td className="p-4 font-semibold theme-text-primary">{trade.symbol}</td>
                    <td className="p-4 uppercase theme-text-secondary">{trade.direction}</td>
                    <td className={`p-4 text-right font-semibold ${Number(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      ${Number(trade.pnl).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageSection>
    </div>
  )
}
