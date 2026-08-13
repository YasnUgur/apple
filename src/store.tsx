import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppData, Asset, FinanceEntry, MarketRates } from './types'
import {
  currentMonthKey,
  loadData,
  saveData,
  uid,
  upsertAsset,
} from './storage'

type Store = {
  data: AppData
  monthKey: string
  setMonthKey: (k: string) => void
  addEntry: (e: Omit<FinanceEntry, 'id' | 'createdAt'>) => void
  removeEntry: (id: string) => void
  addAsset: (a: Omit<Asset, 'id'>) => void
  updateAsset: (a: Asset) => void
  removeAsset: (id: string) => void
  updateMarket: (m: Partial<MarketRates>) => void
  setMarket: (m: MarketRates) => void
  setHideNetWorth: (v: boolean) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())
  const [monthKey, setMonthKey] = useState(currentMonthKey)

  useEffect(() => {
    saveData(data)
  }, [data])

  const addEntry = useCallback((e: Omit<FinanceEntry, 'id' | 'createdAt'>) => {
    setData((d) => {
      const entry: FinanceEntry = {
        ...e,
        id: uid(),
        createdAt: new Date().toISOString(),
      }
      let assets = d.assets
      if (entry.goldType && entry.quantity && entry.quantity > 0) {
        const existing = assets.find((a) => a.type === entry.goldType)
        if (existing) {
          assets = upsertAsset(assets, {
            ...existing,
            amount: existing.amount + entry.quantity,
          })
        } else {
          const labels: Record<string, string> = {
            ceyrek: 'Çeyrek altın',
            yarim: 'Yarım altın',
            tam: 'Tam altın',
            altin: 'Gram altın',
          }
          assets = upsertAsset(assets, {
            id: uid(),
            type: entry.goldType,
            name: labels[entry.goldType] ?? 'Altın',
            amount: entry.quantity,
          })
        }
      }
      return { ...d, entries: [...d.entries, entry], assets }
    })
  }, [])

  const removeEntry = useCallback((id: string) => {
    setData((d) => {
      const entry = d.entries.find((x) => x.id === id)
      let assets = d.assets
      if (entry?.goldType && entry.quantity && entry.quantity > 0) {
        const existing = assets.find((a) => a.type === entry.goldType)
        if (existing) {
          const nextQty = existing.amount - entry.quantity
          if (nextQty <= 0) {
            assets = assets.filter((a) => a.id !== existing.id)
          } else {
            assets = upsertAsset(assets, { ...existing, amount: nextQty })
          }
        }
      }
      return {
        ...d,
        entries: d.entries.filter((x) => x.id !== id),
        assets,
      }
    })
  }, [])

  const addAsset = useCallback((a: Omit<Asset, 'id'>) => {
    setData((d) => ({
      ...d,
      assets: upsertAsset(d.assets, { ...a, id: uid() }),
    }))
  }, [])

  const updateAsset = useCallback((a: Asset) => {
    setData((d) => ({ ...d, assets: upsertAsset(d.assets, a) }))
  }, [])

  const removeAsset = useCallback((id: string) => {
    setData((d) => ({ ...d, assets: d.assets.filter((x) => x.id !== id) }))
  }, [])

  const updateMarket = useCallback((m: Partial<MarketRates>) => {
    setData((d) => ({
      ...d,
      market: { ...d.market, ...m, updatedAt: new Date().toISOString() },
    }))
  }, [])

  const setMarket = useCallback((m: MarketRates) => {
    setData((d) => ({ ...d, market: m }))
  }, [])

  const setHideNetWorth = useCallback((v: boolean) => {
    setData((d) => ({ ...d, hideNetWorth: v }))
  }, [])

  const value = useMemo(
    () => ({
      data,
      monthKey,
      setMonthKey,
      addEntry,
      removeEntry,
      addAsset,
      updateAsset,
      removeAsset,
      updateMarket,
      setMarket,
      setHideNetWorth,
    }),
    [
      data,
      monthKey,
      addEntry,
      removeEntry,
      addAsset,
      updateAsset,
      removeAsset,
      updateMarket,
      setMarket,
      setHideNetWorth,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside provider')
  return v
}
