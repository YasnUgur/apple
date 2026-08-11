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

export function Dashboard() {
  const { data, monthKey, setHideNetWorth } = useStore()
  const assets = totalAssets(data.assets, data.market)
  const income = sumIncome(data.entries, monthKey)
  const expense = sumExpense(data.entries, monthKey)
  const invest = sumInvestment(data.entries, monthKey)
  const save = savings(data.entries, monthKey)
  const portfolio = investmentPortfolioValue(data.assets, data.market)
  const prev = prevMonthKey(monthKey)
  const savePct = pctChange(save, savings(data.entries, prev))

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
        <h2>Kısa not</h2>
        <p className="sub" style={{ marginBottom: 0 }}>
          Borç / taksit ödemelerini Aylık → Gider altında ekleyebilirsin.
        </p>
      </section>
    </div>
  )
}
