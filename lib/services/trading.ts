import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'

export class TradingService {
  async getTrades(userId: string, filters?: {
    market?: string
    startDate?: Date
    endDate?: Date
  }) {
    return prisma.trade.findMany({
      where: {
        userId,
        ...(filters?.market && { market: filters.market }),
        ...(filters?.startDate && { date: { gte: filters.startDate } }),
        ...(filters?.endDate && { date: { lte: filters.endDate } }),
      },
      include: {
        tags: true,
      },
      orderBy: { date: 'desc' },
    })
  }

  async createTrade(userId: string, data: {
    date: Date
    market: string
    symbol: string
    direction: string
    entryPrice: number
    exitPrice: number
    quantity: number
    pnl: number
    fees: number
    strategyTag?: string
    reasonOpen?: string
    reasonClose?: string
  }) {
    return prisma.trade.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  async getTradeStatistics(userId: string, days: number = 30) {
    const startDate = subDays(new Date(), days)
    
    const trades = await prisma.trade.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
    })
    
    const totalPnl = trades.reduce((sum, t) => sum + Number(t.pnl), 0)
    const winningTrades = trades.filter(t => Number(t.pnl) > 0).length
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0
    
    return { totalPnl, winRate, totalTrades: trades.length }
  }

  async createTradingSummary(userId: string, data: {
    date: Date
    totalPnl: number
    mistakes?: string
    whatWentWell?: string
    planForTomorrow?: string
  }) {
    return prisma.tradingDailySummary.create({
      data: {
        ...data,
        userId,
      },
    })
  }

  async getTradingSummaries(userId: string, days: number = 30) {
    const startDate = subDays(new Date(), days)
    
    return prisma.tradingDailySummary.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'desc' },
    })
  }
}

export const tradingService = new TradingService()
