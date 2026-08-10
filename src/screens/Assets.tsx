import { useState } from 'react'
import { assetValueTl } from '../calc'
import { num, tl } from '../format'
import { assetLabels, assetUnits } from '../labels'
import { useStore } from '../store'
import type { AssetType } from '../types'

const types = Object.keys(assetLabels) as AssetType[]

export function Assets() {
  const { data, addAsset, removeAsset } = useStore()
  const [type, setType] = useState<AssetType>('banka')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const submit = () => {
    const n = Number(amount)
    if (!name.trim() || !Number.isFinite(n) || n <= 0) return
    addAsset({ type, name: name.trim(), amount: n })
    setName('')
    setAmount('')
  }

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Varlıklar</h1>
          <p>Sahip oldukların — güncel TL karşılığı.</p>
        </div>
      </header>

      <section className="panel">
        <h2>Varlık ekle</h2>
        <p className="sub">Altın/döviz miktarı; banka/nakit TL olarak.</p>
        <div className="stack">
          <div className="field">
            <label>Tür</label>
            <select value={type} onChange={(e) => setType(e.target.value as AssetType)}>
              {types.map((t) => (
                <option key={t} value={t}>
                  {assetLabels[t]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Ad</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn. Ziraat vadesiz" />
          </div>
          <div className="field">
            <label>Miktar ({assetUnits[type]})</label>
            <input
              inputMode="decimal"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <button className="btn" type="button" onClick={submit}>
            Ekle
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Listem</h2>
        <p className="sub">Piyasa fiyatlarıyla değerlenir.</p>
        {data.assets.length === 0 ? (
          <p className="empty">Henüz varlık yok.</p>
        ) : (
          <div className="list">
            {data.assets.map((a) => (
              <div className="row" key={a.id}>
                <div>
                  <div className="title">{a.name}</div>
                  <div className="meta">
                    {assetLabels[a.type]} · {num(a.amount)} {assetUnits[a.type]}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>{tl(assetValueTl(a, data.market))}</strong>
                  <div>
                    <button className="btn ghost" type="button" onClick={() => removeAsset(a.id)}>
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
