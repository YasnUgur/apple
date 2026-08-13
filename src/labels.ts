import type { AssetType, EntryKind, FinanceEntry, GoldType } from './types'

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

export const goldLabels: Record<GoldType, string> = {
  ceyrek: 'Çeyrek altın',
  yarim: 'Yarım altın',
  tam: 'Tam altın',
  altin: 'Gram altın',
}

export const goldUnits: Record<GoldType, string> = {
  ceyrek: 'adet',
  yarim: 'adet',
  tam: 'adet',
  altin: 'gr',
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

export function entryMeta(e: FinanceEntry): string {
  if (e.goldType && e.quantity != null && e.unitPrice != null) {
    return `${e.quantity} ${goldUnits[e.goldType]} · birim ${e.unitPrice.toLocaleString('tr-TR')} TL`
  }
  return e.note || '—'
}
