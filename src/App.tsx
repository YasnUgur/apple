import { useState } from 'react'
import { Analysis } from './screens/Analysis'
import { Assets } from './screens/Assets'
import { Dashboard } from './screens/Dashboard'
import { Debts } from './screens/Debts'
import { Market } from './screens/Market'
import { Monthly } from './screens/Monthly'
import { StoreProvider } from './store'
import type { TabId } from './types'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Özet', icon: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z' },
  { id: 'monthly', label: 'Aylık', icon: 'M7 3h10v3H7V3zm-2 5h14v13H5V8zm4 3v2h6v-2H9z' },
  { id: 'assets', label: 'Varlık', icon: 'M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z' },
  { id: 'debts', label: 'Borç', icon: 'M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z' },
  { id: 'market', label: 'Piyasa', icon: 'M3 17 9 11l4 4 8-8v-1h-4M21 7v6h-2' },
  { id: 'analysis', label: 'Analiz', icon: 'M4 19h16v2H4v-2zm2-3 4-6 3 4 5-8 2 1.5-7 10-3-4-3 4.5L6 16z' },
]

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

function Shell() {
  const [tab, setTab] = useState<TabId>('dashboard')

  return (
    <>
      <main className="app">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'monthly' && <Monthly />}
        {tab === 'assets' && <Assets />}
        {tab === 'debts' && <Debts />}
        {tab === 'market' && <Market />}
        {tab === 'analysis' && <Analysis />}
      </main>
      <nav className="nav" aria-label="Ana menü">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : undefined}
            onClick={() => setTab(t.id)}
          >
            <Icon d={t.icon} />
            {t.label}
          </button>
        ))}
      </nav>
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
