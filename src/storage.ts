import type { AppData, Asset, Debt, MarketRates, MonthlyFinance } from './types'

const KEY = 'apple-finans-v1'

export const defaultMarket = (): MarketRates => ({
  altinGram: 4340,
  usd: 38.75,
  eur: 42.1,
  updatedAt: new Date().toISOString(),
})

export const emptyMonth = (month: string): MonthlyFinance => ({
  month,
  income: { maas: 0, ek: 0, diger: 0 },
  expense: { krediKarti: 0, nakit: 0, kira: 0, faturalar: 0, diger: 0 },
  investment: { altin: 0, doviz: 0, hisse: 0, fon: 0, diger: 0 },
})

export const defaultData = (): AppData => ({
  months: [emptyMonth(currentMonthKey())],
  assets: [],
  debts: [],
  market: defaultMarket(),
})

export function currentMonthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw) as AppData
    return {
      ...defaultData(),
      ...parsed,
      market: { ...defaultMarket(), ...parsed.market },
      months: parsed.months?.length ? parsed.months : defaultData().months,
      assets: parsed.assets ?? [],
      debts: parsed.debts ?? [],
    }
  } catch {
    return defaultData()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function upsertMonth(
  months: MonthlyFinance[],
  month: MonthlyFinance,
): MonthlyFinance[] {
  const i = months.findIndex((m) => m.month === month.month)
  if (i === -1) return [...months, month].sort((a, b) => a.month.localeCompare(b.month))
  const next = [...months]
  next[i] = month
  return next
}

export function upsertAsset(assets: Asset[], asset: Asset): Asset[] {
  const i = assets.findIndex((a) => a.id === asset.id)
  if (i === -1) return [...assets, asset]
  const next = [...assets]
  next[i] = asset
  return next
}

export function upsertDebt(debts: Debt[], debt: Debt): Debt[] {
  const i = debts.findIndex((d) => d.id === debt.id)
  if (i === -1) return [...debts, debt]
  const next = [...debts]
  next[i] = debt
  return next
}
