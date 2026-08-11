export type AssetType =
  | 'banka'
  | 'nakit'
  | 'altin'
  | 'ceyrek'
  | 'yarim'
  | 'tam'
  | 'usd'
  | 'eur'
  | 'hisse'
  | 'fon'
  | 'diger'

export type EntryKind = 'income' | 'expense' | 'investment'

export type FinanceEntry = {
  id: string
  month: string
  kind: EntryKind
  category: string
  amount: number
  note: string
  createdAt: string
}

export type Asset = {
  id: string
  type: AssetType
  name: string
  amount: number
}

export type MarketRates = {
  altinGram: number
  ceyrek: number
  yarim: number
  tam: number
  usd: number
  eur: number
  updatedAt: string
}

export type AppData = {
  entries: FinanceEntry[]
  assets: Asset[]
  market: MarketRates
  hideNetWorth: boolean
}

export type TabId = 'dashboard' | 'monthly' | 'assets' | 'market' | 'analysis'

/** Eski ay toplam modeli — sadece migration için */
export type LegacyMonthlyFinance = {
  month: string
  income: { maas: number; ek: number; diger: number }
  expense: {
    krediKarti: number
    nakit: number
    kira: number
    faturalar: number
    diger: number
  }
  investment: {
    altin: number
    doviz: number
    hisse: number
    fon: number
    diger: number
  }
}
