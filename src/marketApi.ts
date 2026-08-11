import type { MarketRates } from './types'

type TruncgilItem = {
  Buying?: number
  Selling?: number
  Name?: string
  Type?: string
}

type TruncgilResponse = {
  Update_Date?: string
  USD?: TruncgilItem
  EUR?: TruncgilItem
  GRA?: TruncgilItem
  CEYREKALTIN?: TruncgilItem
  YARIMALTIN?: TruncgilItem
  TAMALTIN?: TruncgilItem
}

const URL = 'https://finans.truncgil.com/v4/today.json'

function sell(item?: TruncgilItem): number {
  const n = item?.Selling ?? item?.Buying ?? 0
  return Number.isFinite(n) ? n : 0
}

export async function fetchMarketRates(): Promise<MarketRates> {
  const res = await fetch(URL, { cache: 'no-store' })
  if (!res.ok) throw new Error('Piyasa verisi alınamadı')
  const data = (await res.json()) as TruncgilResponse
  return {
    altinGram: sell(data.GRA),
    ceyrek: sell(data.CEYREKALTIN),
    yarim: sell(data.YARIMALTIN),
    tam: sell(data.TAMALTIN),
    usd: sell(data.USD),
    eur: sell(data.EUR),
    updatedAt: data.Update_Date
      ? new Date(data.Update_Date.replace(' ', 'T')).toISOString()
      : new Date().toISOString(),
  }
}
