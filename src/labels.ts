import type { AssetType, DebtType } from './types'

export const assetLabels: Record<AssetType, string> = {
  banka: 'Banka',
  nakit: 'Nakit',
  altin: 'Altın (gr)',
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
  usd: 'USD',
  eur: 'EUR',
  hisse: 'TL',
  fon: 'TL',
  diger: 'TL',
}

export const debtLabels: Record<DebtType, string> = {
  kredi_karti: 'Kredi kartı',
  kredi: 'Kredi',
  taksit: 'Taksit',
  kira: 'Kira',
  fatura: 'Fatura',
  diger: 'Diğer',
}
