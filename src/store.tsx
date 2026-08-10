import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppData, Asset, Debt, MarketRates, MonthlyFinance } from './types'
import {
  currentMonthKey,
  emptyMonth,
  loadData,
  saveData,
  uid,
  upsertAsset,
  upsertDebt,
  upsertMonth,
} from './storage'

type Store = {
  data: AppData
  monthKey: string
  setMonthKey: (k: string) => void
  currentMonth: MonthlyFinance
  saveMonth: (m: MonthlyFinance) => void
  addAsset: (a: Omit<Asset, 'id'>) => void
  updateAsset: (a: Asset) => void
  removeAsset: (id: string) => void
  addDebt: (d: Omit<Debt, 'id'>) => void
  updateDebt: (d: Debt) => void
  removeDebt: (id: string) => void
  updateMarket: (m: Partial<MarketRates>) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())
  const [monthKey, setMonthKey] = useState(currentMonthKey)

  useEffect(() => {
    saveData(data)
  }, [data])

  const currentMonth = useMemo(() => {
    return data.months.find((m) => m.month === monthKey) ?? emptyMonth(monthKey)
  }, [data.months, monthKey])

  const saveMonth = useCallback((m: MonthlyFinance) => {
    setData((d) => ({ ...d, months: upsertMonth(d.months, m) }))
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

  const addDebt = useCallback((debt: Omit<Debt, 'id'>) => {
    setData((d) => ({
      ...d,
      debts: upsertDebt(d.debts, { ...debt, id: uid() }),
    }))
  }, [])

  const updateDebt = useCallback((debt: Debt) => {
    setData((d) => ({ ...d, debts: upsertDebt(d.debts, debt) }))
  }, [])

  const removeDebt = useCallback((id: string) => {
    setData((d) => ({ ...d, debts: d.debts.filter((x) => x.id !== id) }))
  }, [])

  const updateMarket = useCallback((m: Partial<MarketRates>) => {
    setData((d) => ({
      ...d,
      market: { ...d.market, ...m, updatedAt: new Date().toISOString() },
    }))
  }, [])

  const value = useMemo(
    () => ({
      data,
      monthKey,
      setMonthKey,
      currentMonth,
      saveMonth,
      addAsset,
      updateAsset,
      removeAsset,
      addDebt,
      updateDebt,
      removeDebt,
      updateMarket,
    }),
    [
      data,
      monthKey,
      currentMonth,
      saveMonth,
      addAsset,
      updateAsset,
      removeAsset,
      addDebt,
      updateDebt,
      removeDebt,
      updateMarket,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside provider')
  return v
}
