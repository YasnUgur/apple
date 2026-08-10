import { useState } from 'react'
import { upcomingDebts } from '../calc'
import { shortDate, tl } from '../format'
import { debtLabels } from '../labels'
import { useStore } from '../store'
import type { DebtType } from '../types'

const types = Object.keys(debtLabels) as DebtType[]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function Debts() {
  const { data, addDebt, removeDebt } = useStore()
  const [type, setType] = useState<DebtType>('kredi_karti')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState(todayISO)

  const upcoming = upcomingDebts(data.debts, 15)
  const upcomingTotal = upcoming.reduce((s, d) => s + d.amount, 0)

  const submit = () => {
    const n = Number(amount)
    if (!name.trim() || !Number.isFinite(n) || n <= 0 || !dueDate) return
    addDebt({ type, name: name.trim(), amount: n, dueDate })
    setName('')
    setAmount('')
  }

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Borçlar</h1>
          <p>Ödemeler ve vadeler.</p>
        </div>
      </header>

      <div className="insight">
        Önümüzdeki 15 gün içerisinde {tl(upcomingTotal)} ödeme var.
      </div>

      <section className="panel">
        <h2>Ödeme / borç ekle</h2>
        <div className="stack">
          <div className="field">
            <label>Tür</label>
            <select value={type} onChange={(e) => setType(e.target.value as DebtType)}>
              {types.map((t) => (
                <option key={t} value={t}>
                  {debtLabels[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Ad</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn. Elektrik faturası" />
          </div>
          <div className="field">
            <label>Tutar (TL)</label>
            <input inputMode="decimal" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="field">
            <label>Son ödeme</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <button className="btn" type="button" onClick={submit}>
            Ekle
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Tümü</h2>
        {data.debts.length === 0 ? (
          <p className="empty">Borç kaydı yok.</p>
        ) : (
          <div className="list">
            {[...data.debts]
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((d) => (
                <div className="row" key={d.id}>
                  <div>
                    <div className="title">{d.name}</div>
                    <div className="meta">
                      {debtLabels[d.type]} · {shortDate(d.dueDate)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>{tl(d.amount)}</strong>
                    <div>
                      <button className="btn ghost" type="button" onClick={() => removeDebt(d.id)}>
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
