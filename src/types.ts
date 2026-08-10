export type AssetType =
  | 'banka'
  | 'nakit'
  | 'altin'
  | 'usd'
  | 'eur'
  | 'hisse'
  | 'fon'
  | 'diger'

export type DebtType =
  | 'kredi_karti'
  | 'kredi'
  | 'taksit'
  | 'kira'
  | 'fatura'
  | 'diger'

export type MonthlyFinance = {
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

export type Asset = {
  id: string
  type: AssetType
  name: string
  amount: number
}

export type Debt = {
  id: string
  name: string
  type: DebtType
  amount: number
  dueDate: string
}

export type MarketRates = {
  altinGram: number
  usd: number
  eur: number
  updatedAt: string
}

export type AppData = {
  months: MonthlyFinance[]
  assets: Asset[]
  debts: Debt[]
  market: MarketRates
}

export type TabId =
  | 'dashboard'
  | 'monthly'
  | 'assets'
  | 'debts'
  | 'market'
  | 'analysis'
