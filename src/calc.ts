import type { Asset, FinanceEntry, MarketRates } from './types'

export function sumByKind(entries: FinanceEntry[], month: string, kind: FinanceEntry['kind']): number {
  return entries
    .filter((e) => e.month === month && e.kind === kind)
    .reduce((s, e) => s + e.amount, 0)
}

export function sumIncome(entries: FinanceEntry[], month: string): number {
  return sumByKind(entries, month, 'income')
}

export function sumExpense(entries: FinanceEntry[], month: string): number {
  return sumByKind(entries, month, 'expense')
}

export function sumInvestment(entries: FinanceEntry[], month: string): number {
  return sumByKind(entries, month, 'investment')
}

export function savings(entries: FinanceEntry[], month: string): number {
  return sumIncome(entries, month) - sumExpense(entries, month) - sumInvestment(entries, month)
}

export function monthKeys(entries: FinanceEntry[]): string[] {
  return [...new Set(entries.map((e) => e.month))].sort()
}

export function assetValueTl(asset: Asset, market: MarketRates): number {
  switch (asset.type) {
    case 'altin':
      return asset.amount * market.altinGram
    case 'ceyrek':
      return asset.amount * market.ceyrek
    case 'yarim':
      return asset.amount * market.yarim
    case 'tam':
      return asset.amount * market.tam
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

export function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / Math.abs(previous)) * 100
}

export function investmentPortfolioValue(assets: Asset[], market: MarketRates): number {
  return assets
    .filter((a) =>
      ['altin', 'ceyrek', 'yarim', 'tam', 'usd', 'eur', 'hisse', 'fon'].includes(a.type),
    )
    .reduce((s, a) => s + assetValueTl(a, market), 0)
}

export function prevMonthKey(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function entriesForMonth(entries: FinanceEntry[], month: string, kind?: FinanceEntry['kind']) {
  return entries
    .filter((e) => e.month === month && (!kind || e.kind === kind))
    .sort((a, b) => {
      const da = a.date || a.createdAt
      const db = b.date || b.createdAt
      return db.localeCompare(da)
    })
}

export function goldBuysForMonth(entries: FinanceEntry[], month: string) {
  return entriesForMonth(entries, month, 'investment').filter((e) => e.goldType)
}

export function assetsByType(assets: Asset[]) {
  const map = new Map<Asset['type'], { qty: number; items: Asset[] }>()
  for (const a of assets) {
    const cur = map.get(a.type) ?? { qty: 0, items: [] }
    cur.qty += a.amount
    cur.items.push(a)
    map.set(a.type, cur)
  }
  return map
}
