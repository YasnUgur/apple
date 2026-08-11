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
    setData((d) => ({
      ...d,
      entries: [
        ...d.entries,
        { ...e, id: uid(), createdAt: new Date().toISOString() },
      ],
    }))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setData((d) => ({ ...d, entries: d.entries.filter((x) => x.id !== id) }))
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
