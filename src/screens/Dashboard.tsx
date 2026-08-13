import { useRef, useState } from 'react'
import {
  investmentPortfolioValue,
  pctChange,
  prevMonthKey,
  savings,
  sumExpense,
  sumIncome,
  sumInvestment,
  totalAssets,
} from '../calc'
import { monthLabel, tl } from '../format'
import { useStore } from '../store'
import { createBackup, parseBackup, todayKey } from '../storage'

export function Dashboard() {
  const { data, monthKey, setHideNetWorth, replaceData } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const assets = totalAssets(data.assets, data.market)
  const income = sumIncome(data.entries, monthKey)
  const expense = sumExpense(data.entries, monthKey)
  const invest = sumInvestment(data.entries, monthKey)
  const save = savings(data.entries, monthKey)
  const portfolio = investmentPortfolioValue(data.assets, data.market)
  const prev = prevMonthKey(monthKey)
  const savePct = pctChange(save, savings(data.entries, prev))

  const downloadBackup = async () => {
    setErr('')
    setMsg('')
    const json = createBackup(data)
    const blob = new Blob([json], { type: 'application/json' })
    const name = `apple-finans-yedek-${todayKey()}.json`

    const file = new File([blob], name, { type: 'application/json' })
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean
      share?: (data?: ShareData) => Promise<void>
    }

    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: 'Apple Finans yedek' })
        setMsg('Yedek paylaşıldı / kaydedildi.')
        return
      } catch {
        // kullanıcı iptal ettiyse sessiz geç
      }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Yedek dosyası indirildi. Dosyalar’a kaydet.')
  }

  const onImportFile = async (file: File | undefined) => {
    setErr('')
    setMsg('')
    if (!file) return
    try {
      const text = await file.text()
      const next = parseBackup(text)
      const ok = window.confirm(
        `Yedek yüklenecek.\n${next.entries.length} kayıt, ${next.assets.length} varlık.\nMevcut verinin üzerine yazılır. Devam?`,
      )
      if (!ok) return
      replaceData(next)
      setMsg('Yedek başarıyla yüklendi.')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Yedek okunamadı')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Apple</h1>
          <p>{monthLabel(monthKey)}</p>
        </div>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setHideNetWorth(!data.hideNetWorth)}
        >
          {data.hideNetWorth ? 'Net varlığı göster' : 'Net varlığı gizle'}
        </button>
      </header>

      <section className="hero-metric">
        <div className="label">Net varlık</div>
        <div className="value">{data.hideNetWorth ? '••••••' : tl(assets)}</div>
      </section>

      <div className="grid2">
        <div className="metric">
          <div className="label">Toplam varlık</div>
          <div className="value">{data.hideNetWorth ? '••••' : tl(assets)}</div>
        </div>
        <div className="metric">
          <div className="label">Portföy</div>
          <div className="value">{data.hideNetWorth ? '••••' : tl(portfolio)}</div>
        </div>
        <div className="metric">
          <div className="label">Bu ay gelir</div>
          <div className="value pos">{tl(income)}</div>
        </div>
        <div className="metric">
          <div className="label">Bu ay gider</div>
          <div className="value neg">{tl(expense)}</div>
        </div>
        <div className="metric">
          <div className="label">Bu ay yatırım</div>
          <div className="value">{tl(invest)}</div>
        </div>
        <div className="metric">
          <div className="label">Tasarruf</div>
          <div className={`value ${save >= 0 ? 'pos' : 'neg'}`}>{tl(save)}</div>
        </div>
      </div>

      {savePct !== null && (
        <div className="insight">
          Bu ay geçen aya göre{' '}
          {savePct >= 0
            ? `%${Math.abs(savePct).toFixed(0)} daha fazla tasarruf ettin.`
            : `%${Math.abs(savePct).toFixed(0)} daha az tasarruf ettin.`}
        </div>
      )}

      <section className="panel">
        <h2>Yedek</h2>
        <p className="sub">
          Veriler telefonda tutulur. Ara sıra yedek al; silinirse geri yükle.
        </p>
        <div className="btn-row">
          <button className="btn" type="button" onClick={downloadBackup}>
            Yedek al
          </button>
          <button className="btn secondary" type="button" onClick={() => fileRef.current?.click()}>
            Yedekten yükle
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => onImportFile(e.target.files?.[0])}
        />
        {msg && <p className="empty" style={{ color: 'var(--teal-2)' }}>{msg}</p>}
        {err && <div className="insight">{err}</div>}
      </section>
    </div>
  )
}
