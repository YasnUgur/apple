import { useState } from 'react'
import {
  assetValueTl,
  assetsByType,
  entriesForMonth,
  goldBuysForMonth,
  monthKeys,
  pctChange,
  prevMonthKey,
  savings,
  sumExpense,
  sumIncome,
  sumInvestment,
} from '../calc'
import { monthLabel, num, shortDate, tl } from '../format'
import { assetLabels, assetUnits, entryMeta, kindLabels } from '../labels'
import { useStore } from '../store'
import type { AssetType, EntryKind } from '../types'

export function Analysis() {
  const { data, monthKey, setMonthKey } = useStore()
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [showAssetsDetail, setShowAssetsDetail] = useState(false)

  const keys = [...new Set([monthKey, ...monthKeys(data.entries)])].sort()
  const series = keys.slice(-8)

  const maxVal = Math.max(
    1,
    ...series.flatMap((m) => [sumIncome(data.entries, m), sumExpense(data.entries, m)]),
  )

  const byType = assetsByType(data.assets)
  const valueByType = data.assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + assetValueTl(a, data.market)
    return acc
  }, {})
  const assetTotal = Object.values(valueByType).reduce((s, n) => s + n, 0) || 1

  const savePct = pctChange(
    savings(data.entries, monthKey),
    savings(data.entries, prevMonthKey(monthKey)),
  )
  const expPct = pctChange(
    sumExpense(data.entries, monthKey),
    sumExpense(data.entries, prevMonthKey(monthKey)),
  )

  const detailMonth = selectedMonth
  const incomes = detailMonth ? entriesForMonth(data.entries, detailMonth, 'income') : []
  const expenses = detailMonth ? entriesForMonth(data.entries, detailMonth, 'expense') : []
  const golds = detailMonth ? goldBuysForMonth(data.entries, detailMonth) : []
  const investments = detailMonth
    ? entriesForMonth(data.entries, detailMonth, 'investment')
    : []

  const openMonth = (m: string) => {
    setSelectedMonth(m)
    setMonthKey(m)
    setShowAssetsDetail(false)
  }

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

      {detailMonth ? (
        <section className="panel">
          <div className="btn-row" style={{ marginBottom: 10 }}>
            <button className="btn secondary" type="button" onClick={() => setSelectedMonth(null)}>
              ← Aylara dön
            </button>
          </div>
          <h2>{monthLabel(detailMonth)}</h2>
          <p className="sub">Bu ayın gelir, gider ve altın alımları.</p>

          <div className="grid2" style={{ marginBottom: 12 }}>
            <div className="metric">
              <div className="label">Gelir</div>
              <div className="value pos">{tl(sumIncome(data.entries, detailMonth))}</div>
            </div>
            <div className="metric">
              <div className="label">Gider</div>
              <div className="value neg">{tl(sumExpense(data.entries, detailMonth))}</div>
            </div>
            <div className="metric">
              <div className="label">Yatırım</div>
              <div className="value">{tl(sumInvestment(data.entries, detailMonth))}</div>
            </div>
            <div className="metric">
              <div className="label">Tasarruf</div>
              <div className="value">{tl(savings(data.entries, detailMonth))}</div>
            </div>
          </div>

          <MonthSection title="Gelirler" kind="income" items={incomes} />
          <MonthSection title="Giderler" kind="expense" items={expenses} />
          <MonthSection title="Alınan altınlar" kind="investment" items={golds} empty="Bu ay altın alımı yok." />
          {investments.some((e) => !e.goldType) && (
            <MonthSection
              title="Diğer yatırımlar"
              kind="investment"
              items={investments.filter((e) => !e.goldType)}
            />
          )}
        </section>
      ) : (
        <section className="panel">
          <h2>Son aylar</h2>
          <p className="sub">Bir aya dokun — detayını gör.</p>
          {series.length === 0 ? (
            <p className="empty">Veri yok.</p>
          ) : (
            <div className="bars">
              {series.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="month-card"
                  onClick={() => openMonth(m)}
                >
                  <div className="section-title" style={{ marginTop: 0 }}>
                    {monthLabel(m)}
                  </div>
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
                  <div className="meta-line">Detay için dokun →</div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="panel">
        <button
          type="button"
          className="panel-hit"
          onClick={() => {
            setShowAssetsDetail((v) => !v)
            setSelectedMonth(null)
          }}
        >
          <h2>Varlık dağılımı</h2>
          <p className="sub" style={{ marginBottom: 0 }}>
            {showAssetsDetail ? 'Özeti gizle' : 'Adet / miktar detayı için dokun'}
          </p>
        </button>

        {data.assets.length === 0 ? (
          <p className="empty">Varlık yok.</p>
        ) : showAssetsDetail ? (
          <div className="list" style={{ marginTop: 12 }}>
            {[...byType.entries()].map(([type, info]) => {
              const t = type as AssetType
              const value = valueByType[t] ?? 0
              return (
                <div className="row" key={t}>
                  <div>
                    <div className="title">{assetLabels[t]}</div>
                    <div className="meta">
                      {num(info.qty)} {assetUnits[t]}
                      {info.items.length > 1 ? ` · ${info.items.length} kayıt` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>{tl(value)}</strong>
                    <div className="meta">%{((value / assetTotal) * 100).toFixed(0)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bars" style={{ marginTop: 12 }}>
            {Object.entries(valueByType).map(([k, v]) => (
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

function MonthSection({
  title,
  kind,
  items,
  empty = 'Kayıt yok.',
}: {
  title: string
  kind: EntryKind
  items: ReturnType<typeof entriesForMonth>
  empty?: string
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div className="section-title">
        {title} · {kindLabels[kind]}
      </div>
      {items.length === 0 ? (
        <p className="empty">{empty}</p>
      ) : (
        <div className="list">
          {items.map((e) => (
            <div className="row" key={e.id}>
              <div>
                <div className="title">{e.category}</div>
                <div className="meta">
                  {shortDate(e.date || e.createdAt)}
                  {entryMeta(e) !== '—' ? ` · ${entryMeta(e)}` : e.note ? ` · ${e.note}` : ''}
                </div>
              </div>
              <strong>{tl(e.amount)}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
