import { useMemo, useState } from 'react'
import {
  savings,
  sumExpense,
  sumIncome,
  sumInvestment,
} from '../calc'
import { tl } from '../format'
import {
  categoriesFor,
  entryMeta,
  goldLabels,
  goldUnits,
  kindLabels,
} from '../labels'
import { useStore } from '../store'
import type { EntryKind, GoldType } from '../types'

const goldTypes = Object.keys(goldLabels) as GoldType[]

export function Monthly() {
  const { data, monthKey, setMonthKey, addEntry, removeEntry } = useStore()
  const [kind, setKind] = useState<EntryKind>('income')
  const [category, setCategory] = useState<string>(categoriesFor('income')[0])
  const [goldType, setGoldType] = useState<GoldType>('ceyrek')
  const [quantity, setQuantity] = useState('1')
  const [unitPrice, setUnitPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const cats = categoriesFor(kind)
  const isGoldInvest = kind === 'investment' && category === 'Altın'
  const qty = Number(quantity) || 0
  const price = Number(unitPrice) || 0
  const goldTotal = qty > 0 && price > 0 ? qty * price : 0

  const list = useMemo(
    () =>
      data.entries
        .filter((e) => e.month === monthKey && e.kind === kind)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data.entries, monthKey, kind],
  )

  const switchKind = (k: EntryKind) => {
    setKind(k)
    setCategory(categoriesFor(k)[0])
  }

  const submit = () => {
    if (isGoldInvest) {
      if (qty <= 0 || price <= 0) return
      addEntry({
        month: monthKey,
        kind: 'investment',
        category: goldLabels[goldType],
        amount: goldTotal,
        note: note.trim(),
        goldType,
        quantity: qty,
        unitPrice: price,
      })
      setQuantity('1')
      setUnitPrice('')
      setNote('')
      return
    }

    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return
    addEntry({
      month: monthKey,
      kind,
      category,
      amount: n,
      note: note.trim(),
    })
    setAmount('')
    setNote('')
  }

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Aylık Finans</h1>
          <p>Gelir, gider ve yatırımı ayrı ayrı ekle.</p>
        </div>
      </header>

      <div className="field">
        <label>Ay</label>
        <input
          type="month"
          value={monthKey}
          onChange={(e) => e.target.value && setMonthKey(e.target.value)}
        />
      </div>

      <div className="grid2">
        <div className="metric">
          <div className="label">Gelir</div>
          <div className="value pos">{tl(sumIncome(data.entries, monthKey))}</div>
        </div>
        <div className="metric">
          <div className="label">Gider</div>
          <div className="value neg">{tl(sumExpense(data.entries, monthKey))}</div>
        </div>
        <div className="metric">
          <div className="label">Yatırım</div>
          <div className="value">{tl(sumInvestment(data.entries, monthKey))}</div>
        </div>
        <div className="metric">
          <div className="label">Tasarruf</div>
          <div className={`value ${savings(data.entries, monthKey) >= 0 ? 'pos' : 'neg'}`}>
            {tl(savings(data.entries, monthKey))}
          </div>
        </div>
      </div>

      <div className="seg">
        {(Object.keys(kindLabels) as EntryKind[]).map((k) => (
          <button
            key={k}
            type="button"
            className={kind === k ? 'active' : undefined}
            onClick={() => switchKind(k)}
          >
            {kindLabels[k]}
          </button>
        ))}
      </div>

      <section className="panel">
        <h2>{kindLabels[kind]} ekle</h2>
        <p className="sub">
          {isGoldInvest
            ? 'Altın türünü seç, adet/gram ve alış fiyatını gir.'
            : 'Tek kayıt ekle.'}
        </p>
        <div className="stack">
          <div className="field">
            <label>Kategori</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {isGoldInvest ? (
            <>
              <div className="field">
                <label>Altın türü</label>
                <select
                  value={goldType}
                  onChange={(e) => setGoldType(e.target.value as GoldType)}
                >
                  {goldTypes.map((t) => (
                    <option key={t} value={t}>
                      {goldLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Miktar ({goldUnits[goldType]})</label>
                <input
                  inputMode="decimal"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="field">
                <label>Alış fiyatı / birim (TL)</label>
                <input
                  inputMode="decimal"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="Örn. 10900"
                />
              </div>
              <div className="metric">
                <div className="label">Toplam tutar</div>
                <div className="value">{tl(goldTotal)}</div>
              </div>
            </>
          ) : (
            <div className="field">
              <label>Tutar (TL)</label>
              <input
                inputMode="decimal"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
          )}

          <div className="field">
            <label>Not (opsiyonel)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn. kuyumcu / banka"
            />
          </div>
          <button className="btn" type="button" onClick={submit}>
            {kindLabels[kind]} ekle
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Bu ay · {kindLabels[kind]}</h2>
        {list.length === 0 ? (
          <p className="empty">Kayıt yok.</p>
        ) : (
          <div className="list">
            {list.map((e) => (
              <div className="row" key={e.id}>
                <div>
                  <div className="title">{e.category}</div>
                  <div className="meta">{entryMeta(e)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>{tl(e.amount)}</strong>
                  <div>
                    <button className="btn ghost" type="button" onClick={() => removeEntry(e.id)}>
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
