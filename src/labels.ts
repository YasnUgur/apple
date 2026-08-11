import type { AssetType, EntryKind } from './types'

export const assetLabels: Record<AssetType, string> = {
  banka: 'Banka',
  nakit: 'Nakit',
  altin: 'Gram altın',
  ceyrek: 'Çeyrek altın',
  yarim: 'Yarım altın',
  tam: 'Tam altın',
  usd: 'USD',
  eur: 'EUR',
  hisse: 'Hisse (TL)',
  fon: 'Fon (TL)',
  diger: 'Diğer (TL)',
}

export const assetUnits: Record<AssetType, string> = {
  banka: 'TL',
  nakit: 'TL',
  altin: 'gr',
  ceyrek: 'adet',
  yarim: 'adet',
  tam: 'adet',
  usd: 'USD',
  eur: 'EUR',
  hisse: 'TL',
  fon: 'TL',
  diger: 'TL',
}

export const incomeCategories = ['Maaş', 'Ek gelir', 'Kira geliri', 'Diğer'] as const
export const expenseCategories = [
  'Kredi kartı',
  'Nakit',
  'Kira',
  'Fatura',
  'Borç / taksit',
  'Market',
  'Ulaşım',
  'Diğer',
] as const
export const investmentCategories = [
  'Altın',
  'Çeyrek / yarım / tam',
  'Döviz',
  'Hisse',
  'Fon',
  'Diğer',
] as const

export const kindLabels: Record<EntryKind, string> = {
  income: 'Gelir',
  expense: 'Gider',
  investment: 'Yatırım',
}

export function categoriesFor(kind: EntryKind): readonly string[] {
  if (kind === 'income') return incomeCategories
  if (kind === 'expense') return expenseCategories
  return investmentCategories
}
