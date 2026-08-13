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

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function monthFromDate(date: string): string {
  return date.slice(0, 7)
}

function entryDate(e: Partial<FinanceEntry>): string {
  if (e.date) return e.date
  if (e.createdAt) return e.createdAt.slice(0, 10)
  if (e.month) return `${e.month}-01`
  return todayKey()
}

function migrateMonths(months: LegacyMonthlyFinance[]): FinanceEntry[] {
  const out: FinanceEntry[] = []
  for (const m of months) {
    const push = (kind: FinanceEntry['kind'], category: string, amount: number) => {
      if (!amount) return
      out.push({
        id: uid(),
        month: m.month,
        date: `${m.month}-01`,
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
    return normalizeData(JSON.parse(raw))
  } catch {
    return defaultData()
  }
}

export function normalizeData(raw: unknown): AppData {
  const parsed = raw as Partial<AppData> & {
    months?: LegacyMonthlyFinance[]
    data?: Partial<AppData> & { months?: LegacyMonthlyFinance[] }
  }
  const body = parsed.data ?? parsed
  const fromMonths =
    !body.entries?.length && body.months?.length ? migrateMonths(body.months) : []
  return {
    ...defaultData(),
    ...body,
    market: { ...defaultMarket(), ...body.market },
    entries: (body.entries?.length ? body.entries : fromMonths).map((e) => {
      const date = entryDate(e)
      return {
        ...e,
        date,
        month: e.month || monthFromDate(date),
        note: e.note ?? '',
        amount: Number(e.amount) || 0,
      }
    }),
    assets: (body.assets ?? []).map((a) => ({
      ...a,
      amount: Number(a.amount) || 0,
    })),
    hideNetWorth: Boolean(body.hideNetWorth),
  }
}

export function createBackup(data: AppData): string {
  return JSON.stringify(
    {
      app: 'apple-finans',
      version: 1,
      exportedAt: new Date().toISOString(),
      data,
    },
    null,
    2,
  )
}

export function parseBackup(raw: string): AppData {
  const parsed = JSON.parse(raw) as unknown
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Geçersiz yedek dosyası')
  }
  const obj = parsed as { app?: string; data?: unknown }
  if (obj.app && obj.app !== 'apple-finans') {
    throw new Error('Bu dosya Defter yedeği değil')
  }
  const data = normalizeData(obj.data ?? parsed)
  if (!Array.isArray(data.entries) || !Array.isArray(data.assets)) {
    throw new Error('Yedek içeriği okunamadı')
  }
  return data
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
