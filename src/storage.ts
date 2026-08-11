import type {
  AppData,
  Asset,
  FinanceEntry,
  LegacyMonthlyFinance,
  MarketRates,
} from './types'

const KEY = 'apple-finans-v1'

export const defaultMarket = (): MarketRates => ({
  altinGram: 6700,
  ceyrek: 10900,
  yarim: 21800,
  tam: 43500,
  usd: 47.7,
  eur: 55.1,
  updatedAt: new Date().toISOString(),
})

export const defaultData = (): AppData => ({
  entries: [],
  assets: [],
  market: defaultMarket(),
  hideNetWorth: false,
})

export function currentMonthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function migrateMonths(months: LegacyMonthlyFinance[]): FinanceEntry[] {
  const out: FinanceEntry[] = []
  for (const m of months) {
    const push = (kind: FinanceEntry['kind'], category: string, amount: number) => {
      if (!amount) return
      out.push({
        id: uid(),
        month: m.month,
        kind,
        category,
        amount,
        note: 'Eski kayıttan aktarıldı',
        createdAt: new Date().toISOString(),
      })
    }
    push('income', 'Maaş', m.income.maas)
    push('income', 'Ek gelir', m.income.ek)
    push('income', 'Diğer', m.income.diger)
    push('expense', 'Kredi kartı', m.expense.krediKarti)
    push('expense', 'Nakit', m.expense.nakit)
    push('expense', 'Kira', m.expense.kira)
    push('expense', 'Faturalar', m.expense.faturalar)
    push('expense', 'Diğer', m.expense.diger)
    push('investment', 'Altın', m.investment.altin)
    push('investment', 'Döviz', m.investment.doviz)
    push('investment', 'Hisse', m.investment.hisse)
    push('investment', 'Fon', m.investment.fon)
    push('investment', 'Diğer', m.investment.diger)
  }
  return out
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw) as Partial<AppData> & {
      months?: LegacyMonthlyFinance[]
    }
    const fromMonths =
      !parsed.entries?.length && parsed.months?.length
        ? migrateMonths(parsed.months)
        : []
    return {
      ...defaultData(),
      ...parsed,
      market: { ...defaultMarket(), ...parsed.market },
      entries: parsed.entries?.length ? parsed.entries : fromMonths,
      assets: parsed.assets ?? [],
      hideNetWorth: Boolean(parsed.hideNetWorth),
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

export function upsertAsset(assets: Asset[], asset: Asset): Asset[] {
  const i = assets.findIndex((a) => a.id === asset.id)
  if (i === -1) return [...assets, asset]
  const next = [...assets]
  next[i] = asset
  return next
}
