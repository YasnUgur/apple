import { useEffect, useState } from 'react'
import {
  savings,
  sumExpense,
  sumIncome,
  sumInvestment,
} from '../calc'
import { tl } from '../format'
import { useStore } from '../store'
import { emptyMonth } from '../storage'
import type { MonthlyFinance } from '../types'

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        inputMode="decimal"
        type="number"
        value={value || ''}
        placeholder="0"
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  )
}

export function Monthly() {
  const { monthKey, setMonthKey, currentMonth, saveMonth, data } = useStore()
  const [draft, setDraft] = useState<MonthlyFinance>(currentMonth)

  useEffect(() => {
    setDraft(currentMonth)
  }, [currentMonth])

  const patchIncome = (k: keyof MonthlyFinance['income'], n: number) =>
    setDraft((d) => ({ ...d, income: { ...d.income, [k]: n } }))
  const patchExpense = (k: keyof MonthlyFinance['expense'], n: number) =>
    setDraft((d) => ({ ...d, expense: { ...d.expense, [k]: n } }))
  const patchInvest = (k: keyof MonthlyFinance['investment'], n: number) =>
    setDraft((d) => ({ ...d, investment: { ...d.investment, [k]: n } }))

  return (
    <div className="stack install">
      <header className="brand">
        <div>
          <h1>Aylık Finans</h1>
          <p>Ay sonunda toplamları gir.</p>
        </div>
      </header>

      <div className="field">
        <label>Ay</label>
        <input
          type="month"
          value={monthKey}
          onChange={(e) => {
            const k = e.target.value
            if (!k) return
            setMonthKey(k)
            setDraft(data.months.find((m) => m.month === k) ?? emptyMonth(k))
          }}
        />
      </div>

      <div className="grid2">
        <div className="metric">
          <div className="label">Gelir</div>
          <div className="value pos">{tl(sumIncome(draft))}</div>
        </div>
        <div className="metric">
          <div className="label">Gider</div>
          <div className="value neg">{tl(sumExpense(draft))}</div>
        </div>
        <div className="metric">
          <div className="label">Yatırım</div>
          <div className="value">{tl(sumInvestment(draft))}</div>
        </div>
        <div className="metric">
          <div className="label">Tasarruf</div>
          <div className={`value ${savings(draft) >= 0 ? 'pos' : 'neg'}`}>
            {tl(savings(draft))}
          </div>
        </div>
      </div>

      <section className="panel">
        <h2>Gelir</h2>
        <p className="sub">Maaş, ek gelir ve diğer.</p>
        <div className="stack">
          <MoneyInput label="Maaş" value={draft.income.maas} onChange={(n) => patchIncome('maas', n)} />
          <MoneyInput label="Ek gelir" value={draft.income.ek} onChange={(n) => patchIncome('ek', n)} />
          <MoneyInput label="Diğer" value={draft.income.diger} onChange={(n) => patchIncome('diger', n)} />
        </div>
      </section>

      <section className="panel">
        <h2>Gider</h2>
        <p className="sub">Tek tek fiş değil — ay sonu toplamları.</p>
        <div className="stack">
          <MoneyInput label="Kredi kartı" value={draft.expense.krediKarti} onChange={(n) => patchExpense('krediKarti', n)} />
          <MoneyInput label="Nakit harcama" value={draft.expense.nakit} onChange={(n) => patchExpense('nakit', n)} />
          <MoneyInput label="Kira" value={draft.expense.kira} onChange={(n) => patchExpense('kira', n)} />
          <MoneyInput label="Faturalar" value={draft.expense.faturalar} onChange={(n) => patchExpense('faturalar', n)} />
          <MoneyInput label="Diğer" value={draft.expense.diger} onChange={(n) => patchExpense('diger', n)} />
        </div>
      </section>

      <section className="panel">
        <h2>Yatırım</h2>
        <p className="sub">Bu ay yatırılan tutarlar (TL).</p>
        <div className="stack">
          <MoneyInput label="Altın" value={draft.investment.altin} onChange={(n) => patchInvest('altin', n)} />
          <MoneyInput label="Döviz" value={draft.investment.doviz} onChange={(n) => patchInvest('doviz', n)} />
          <MoneyInput label="Hisse" value={draft.investment.hisse} onChange={(n) => patchInvest('hisse', n)} />
          <MoneyInput label="Fon" value={draft.investment.fon} onChange={(n) => patchInvest('fon', n)} />
          <MoneyInput label="Diğer" value={draft.investment.diger} onChange={(n) => patchInvest('diger', n)} />
        </div>
      </section>

      <button className="btn" type="button" onClick={() => saveMonth({ ...draft, month: monthKey })}>
        Ayı kaydet
      </button>
    </div>
  )
}
