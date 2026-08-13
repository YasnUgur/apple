const tr = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

const trDec = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

export function tl(n: number, decimals = false): string {
  return decimals ? trDec.format(n) : tr.format(n)
}

export function num(n: number, digits = 2): string {
  return new Intl.NumberFormat('tr-TR', {
    maximumFractionDigits: digits,
  }).format(n)
}

export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, 1))
}

export function shortDate(iso: string): string {
  const value = iso.length === 10 ? `${iso}T12:00:00` : iso
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function entryDateKey(e: { date?: string; createdAt: string; month: string }): string {
  if (e.date) return e.date
  if (e.createdAt) return e.createdAt.slice(0, 10)
  return `${e.month}-01`
}

export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}
