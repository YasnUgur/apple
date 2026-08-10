import { useState } from 'react'
import { assetValueTl } from '../calc'
import { num, tl } from '../format'
import { useStore } from '../store'

export function Market() {
  const { data, updateMarket } = useStore()
  const [altin, setAltin] = useState(String(data.market.altinGram))
  const [usd, setUsd] = useState(String(data.market.usd))
  const [eur, setEur] = useState(String(data.market.eur))

  const priced = data.assets.filter((a) =>
    ['altin', 'usd', 'eur', 'hisse', 'fon'].includes(a.type),
  )

  const save = () => {
    updateMarket({
      altinGram: Number(altin) || 0,
      usd: Number(usd) || 0,
      eur: Number(eur) || 0,
    })
  }

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Piyasa</h1>
          <p>Fiyatları sen güncellersin — internete bağlı değil.</p>
        </div>
      </header>

      <section className="panel">
        <h2>Güncel fiyatlar</h2>
        <p className="sub">Altın gram, USD ve EUR kurlarını elle gir.</p>
        <div className="stack">
          <div className="field">
            <label>Gram altın (TL)</label>
            <input inputMode="decimal" type="number" value={altin} onChange={(e) => setAltin(e.target.value)} />
          </div>
          <div className="field">
            <label>USD / TL</label>
            <input inputMode="decimal" type="number" value={usd} onChange={(e) => setUsd(e.target.value)} />
          </div>
          <div className="field">
            <label>EUR / TL</label>
            <input inputMode="decimal" type="number" value={eur} onChange={(e) => setEur(e.target.value)} />
          </div>
          <button className="btn" type="button" onClick={save}>
            Fiyatları kaydet
          </button>
        </div>
      </section>

      <div className="grid2">
        <div className="metric">
          <div className="label">Altın</div>
          <div className="value">{tl(data.market.altinGram, true)}</div>
        </div>
        <div className="metric">
          <div className="label">USD</div>
          <div className="value">{num(data.market.usd)}</div>
        </div>
        <div className="metric">
          <div className="label">EUR</div>
          <div className="value">{num(data.market.eur)}</div>
        </div>
      </div>

      <section className="panel">
        <h2>Portföyün × piyasa</h2>
        <p className="sub">Sahip olduğun miktar × güncel fiyat.</p>
        {priced.length === 0 ? (
          <p className="empty">Piyasa varlıkların yok. Varlıklar ekranından ekle.</p>
        ) : (
          <div className="list">
            {priced.map((a) => (
              <div className="row" key={a.id}>
                <div>
                  <div className="title">{a.name}</div>
                  <div className="meta">
                    {a.type === 'altin'
                      ? `${num(a.amount)} gr altın`
                      : a.type === 'usd'
                        ? `${num(a.amount)} USD`
                        : a.type === 'eur'
                          ? `${num(a.amount)} EUR`
                          : `${tl(a.amount)}`}
                  </div>
                </div>
                <strong>{tl(assetValueTl(a, data.market))}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
