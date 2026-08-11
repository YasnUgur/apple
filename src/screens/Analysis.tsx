import {
  assetValueTl,
  monthKeys,
  pctChange,
  prevMonthKey,
  savings,
  sumExpense,
  sumIncome,
} from '../calc'
import { monthLabel, tl } from '../format'
import { assetLabels } from '../labels'
import { useStore } from '../store'
import type { AssetType } from '../types'

export function Analysis() {
  const { data, monthKey } = useStore()
  const keys = [...new Set([monthKey, ...monthKeys(data.entries)])].sort()
  const series = keys.slice(-6)

  const maxVal = Math.max(
    1,
    ...series.flatMap((m) => [sumIncome(data.entries, m), sumExpense(data.entries, m)]),
  )

  const byType = data.assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + assetValueTl(a, data.market)
    return acc
  }, {})
  const assetTotal = Object.values(byType).reduce((s, n) => s + n, 0) || 1

  const savePct = pctChange(
    savings(data.entries, monthKey),
    savings(data.entries, prevMonthKey(monthKey)),
  )
  const expPct = pctChange(
    sumExpense(data.entries, monthKey),
    sumExpense(data.entries, prevMonthKey(monthKey)),
  )

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Analiz</h1>
          <p>{monthLabel(monthKey)} özeti</p>
        </div>
      </header>

      {savePct !== null && (
        <div className="insight">
          Tasarruf:{' '}
          {savePct >= 0
            ? `geçen aya göre %${Math.abs(savePct).toFixed(0)} daha fazla.`
            : `geçen aya göre %${Math.abs(savePct).toFixed(0)} daha az.`}
        </div>
      )}
      {expPct !== null && (
        <div className="insight">
          Giderler:{' '}
          {expPct >= 0
            ? `geçen aya göre %${Math.abs(expPct).toFixed(0)} arttı.`
            : `geçen aya göre %${Math.abs(expPct).toFixed(0)} azaldı.`}
        </div>
      )}

      <section className="panel">
        <h2>Son aylar</h2>
        <p className="sub">Gelir / gider karşılaştırması.</p>
        {series.length === 0 ? (
          <p className="empty">Veri yok.</p>
        ) : (
          <div className="bars">
            {series.map((m) => (
              <div key={m}>
                <div className="section-title">{monthLabel(m)}</div>
                <div className="bar-row">
                  <span>Gelir</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(sumIncome(data.entries, m) / maxVal) * 100}%` }}
                    />
                  </div>
                  <span>{tl(sumIncome(data.entries, m))}</span>
                </div>
                <div className="bar-row">
                  <span>Gider</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill expense"
                      style={{ width: `${(sumExpense(data.entries, m) / maxVal) * 100}%` }}
                    />
                  </div>
                  <span>{tl(sumExpense(data.entries, m))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Varlık dağılımı</h2>
        <p className="sub">Portföy kırılımı.</p>
        {data.assets.length === 0 ? (
          <p className="empty">Varlık yok.</p>
        ) : (
          <div className="bars">
            {Object.entries(byType).map(([k, v]) => (
              <div className="bar-row" key={k}>
                <span>{assetLabels[k as AssetType] ?? k}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(v / assetTotal) * 100}%` }} />
                </div>
                <span>%{((v / assetTotal) * 100).toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
