import {
  investmentPortfolioValue,
  netWorth,
  pctChange,
  savings,
  sumExpense,
  sumIncome,
  sumInvestment,
  totalAssets,
  totalDebts,
  upcomingDebts,
} from '../calc'
import { monthLabel, shortDate, tl } from '../format'
import { useStore } from '../store'
import { emptyMonth } from '../storage'

export function Dashboard() {
  const { data, currentMonth, monthKey } = useStore()
  const assets = totalAssets(data.assets, data.market)
  const debts = totalDebts(data.debts)
  const net = netWorth(data.assets, data.debts, data.market)
  const income = sumIncome(currentMonth)
  const expense = sumExpense(currentMonth)
  const invest = sumInvestment(currentMonth)
  const save = savings(currentMonth)
  const portfolio = investmentPortfolioValue(data.assets, data.market)
  const upcoming = upcomingDebts(data.debts, 15)
  const upcomingTotal = upcoming.reduce((s, d) => s + d.amount, 0)

  const prevKey = (() => {
    const [y, m] = monthKey.split('-').map(Number)
    const d = new Date(y, m - 2, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })()
  const prev = data.months.find((m) => m.month === prevKey) ?? emptyMonth(prevKey)
  const savePct = pctChange(save, savings(prev))

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Apple</h1>
          <p>{monthLabel(monthKey)}</p>
        </div>
      </header>

      <section className="hero-metric">
        <div className="label">Net varlık</div>
        <div className="value">{tl(net)}</div>
      </section>

      <div className="grid2">
        <div className="metric">
          <div className="label">Toplam varlık</div>
          <div className="value">{tl(assets)}</div>
        </div>
        <div className="metric">
          <div className="label">Toplam borç</div>
          <div className="value neg">{tl(debts)}</div>
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
        <h2>Yaklaşan ödemeler</h2>
        <p className="sub">
          Önümüzdeki 15 gün içerisinde {tl(upcomingTotal)} ödeme var.
        </p>
        {upcoming.length === 0 ? (
          <p className="empty">Yaklaşan ödeme yok.</p>
        ) : (
          <div className="list">
            {upcoming.map((d) => (
              <div className="row" key={d.id}>
                <div>
                  <div className="title">{d.name}</div>
                  <div className="meta">{shortDate(d.dueDate)}</div>
                </div>
                <strong>{tl(d.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Yatırım portföyü</h2>
        <p className="sub">Güncel piyasa değerleriyle.</p>
        <div className="metric">
          <div className="label">Portföy değeri</div>
          <div className="value">{tl(portfolio)}</div>
        </div>
      </section>
    </div>
  )
}
