import { useState } from 'react'
import { fetchMarketRates } from '../marketApi'
import { num, tl } from '../format'
import { useStore } from '../store'
import { assetValueTl } from '../calc'

export function Market() {
  const { data, updateMarket, setMarket } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [altin, setAltin] = useState(String(data.market.altinGram))
  const [ceyrek, setCeyrek] = useState(String(data.market.ceyrek))
  const [yarim, setYarim] = useState(String(data.market.yarim))
  const [tam, setTam] = useState(String(data.market.tam))
  const [usd, setUsd] = useState(String(data.market.usd))
  const [eur, setEur] = useState(String(data.market.eur))

  const syncFields = (m: typeof data.market) => {
    setAltin(String(m.altinGram))
    setCeyrek(String(m.ceyrek))
    setYarim(String(m.yarim))
    setTam(String(m.tam))
    setUsd(String(m.usd))
    setEur(String(m.eur))
  }

  const refresh = async () => {
    setLoading(true)
    setError('')
    try {
      const rates = await fetchMarketRates()
      setMarket(rates)
      syncFields(rates)
    } catch {
      setError('Güncel kurlar alınamadı. İnternet bağlantını kontrol et.')
    } finally {
      setLoading(false)
    }
  }

  const saveManual = () => {
    updateMarket({
      altinGram: Number(altin) || 0,
      ceyrek: Number(ceyrek) || 0,
      yarim: Number(yarim) || 0,
      tam: Number(tam) || 0,
      usd: Number(usd) || 0,
      eur: Number(eur) || 0,
    })
  }

  const priced = data.assets.filter((a) =>
    ['altin', 'ceyrek', 'yarim', 'tam', 'usd', 'eur', 'hisse', 'fon'].includes(a.type),
  )

  const updated = data.market.updatedAt
    ? new Date(data.market.updatedAt).toLocaleString('tr-TR')
    : '—'

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Piyasa</h1>
          <p>Güncel kur ve altın fiyatları.</p>
        </div>
      </header>

      <button className="btn" type="button" onClick={refresh} disabled={loading}>
        {loading ? 'Güncelleniyor…' : 'Güncel kurları çek'}
      </button>
      {error && <div className="insight">{error}</div>}
      <p className="empty">Son güncelleme: {updated}</p>

      <div className="grid2">
        <div className="metric">
          <div className="label">Gram altın</div>
          <div className="value">{tl(data.market.altinGram, true)}</div>
        </div>
        <div className="metric">
          <div className="label">Çeyrek</div>
          <div className="value">{tl(data.market.ceyrek, true)}</div>
        </div>
        <div className="metric">
          <div className="label">Yarım</div>
          <div className="value">{tl(data.market.yarim, true)}</div>
        </div>
        <div className="metric">
          <div className="label">Tam</div>
          <div className="value">{tl(data.market.tam, true)}</div>
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
        <h2>Elle düzelt</h2>
        <p className="sub">İstersen fiyatları kendin değiştir.</p>
        <div className="stack">
          <div className="field">
            <label>Gram altın (TL)</label>
            <input inputMode="decimal" type="number" value={altin} onChange={(e) => setAltin(e.target.value)} />
          </div>
          <div className="field">
            <label>Çeyrek altın (TL)</label>
            <input inputMode="decimal" type="number" value={ceyrek} onChange={(e) => setCeyrek(e.target.value)} />
          </div>
          <div className="field">
            <label>Yarım altın (TL)</label>
            <input inputMode="decimal" type="number" value={yarim} onChange={(e) => setYarim(e.target.value)} />
          </div>
          <div className="field">
            <label>Tam altın (TL)</label>
            <input inputMode="decimal" type="number" value={tam} onChange={(e) => setTam(e.target.value)} />
          </div>
          <div className="field">
            <label>USD / TL</label>
            <input inputMode="decimal" type="number" value={usd} onChange={(e) => setUsd(e.target.value)} />
          </div>
          <div className="field">
            <label>EUR / TL</label>
            <input inputMode="decimal" type="number" value={eur} onChange={(e) => setEur(e.target.value)} />
          </div>
          <button className="btn secondary" type="button" onClick={saveManual}>
            Elle kaydet
          </button>
        </div>
      </section>

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
                      ? `${num(a.amount)} gr`
                      : a.type === 'ceyrek'
                        ? `${num(a.amount)} çeyrek`
                        : a.type === 'yarim'
                          ? `${num(a.amount)} yarım`
                          : a.type === 'tam'
                            ? `${num(a.amount)} tam`
                            : a.type === 'usd'
                              ? `${num(a.amount)} USD`
                              : a.type === 'eur'
                                ? `${num(a.amount)} EUR`
                                : tl(a.amount)}
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
