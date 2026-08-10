import type { Asset, Debt, MarketRates, MonthlyFinance } from './types'

export function sumIncome(m: MonthlyFinance): number {
  return m.income.maas + m.income.ek + m.income.diger
}

export function sumExpense(m: MonthlyFinance): number {
  const e = m.expense
  return e.krediKarti + e.nakit + e.kira + e.faturalar + e.diger
}

export function sumInvestment(m: MonthlyFinance): number {
  const i = m.investment
  return i.altin + i.doviz + i.hisse + i.fon + i.diger
}

export function savings(m: MonthlyFinance): number {
  return sumIncome(m) - sumExpense(m) - sumInvestment(m)
}

export function assetValueTl(asset: Asset, market: MarketRates): number {
  switch (asset.type) {
    case 'altin':
      return asset.amount * market.altinGram
    case 'usd':
      return asset.amount * market.usd
    case 'eur':
      return asset.amount * market.eur
    default:
      return asset.amount
  }
}

export function totalAssets(assets: Asset[], market: MarketRates): number {
  return assets.reduce((s, a) => s + assetValueTl(a, market), 0)
}

export function totalDebts(debts: Debt[]): number {
  return debts.reduce((s, d) => s + d.amount, 0)
}

export function netWorth(assets: Asset[], debts: Debt[], market: MarketRates): number {
  return totalAssets(assets, market) - totalDebts(debts)
}

export function upcomingDebts(debts: Debt[], withinDays = 15): Debt[] {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setDate(end.getDate() + withinDays)
  return debts
    .filter((d) => {
      const due = new Date(d.dueDate)
      due.setHours(0, 0, 0, 0)
      return due >= now && due <= end
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / Math.abs(previous)) * 100
}

export function investmentPortfolioValue(assets: Asset[], market: MarketRates): number {
  return assets
    .filter((a) => ['altin', 'usd', 'eur', 'hisse', 'fon'].includes(a.type))
    .reduce((s, a) => s + assetValueTl(a, market), 0)
}
