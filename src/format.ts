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
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}
