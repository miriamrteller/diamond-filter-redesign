import {
  CLARITIES, COLORS, type Diamond, FINISH_GRADES, FLUOR, LABS, type Shape, fmtPrice,
} from './data'
import type { GradeSpan } from './components/GradeRange'

export const CARAT_MIN = 0.2
export const CARAT_MAX = 5
export const PRICE_MIN = 0
export const PRICE_MAX = 120000

export interface Filters {
  shapes: Shape[]
  carat: [number, number]
  price: [number, number]
  color: GradeSpan
  clarity: GradeSpan
  cut: string[]
  polish: string[]
  symmetry: string[]
  fluor: string[]
  labs: string[]
}

export const defaultFilters: Filters = {
  shapes: [],
  carat: [CARAT_MIN, CARAT_MAX],
  price: [PRICE_MIN, PRICE_MAX],
  color: null,
  clarity: null,
  cut: [],
  polish: [],
  symmetry: [],
  fluor: [],
  labs: [],
}

export function applyFilters(diamonds: Diamond[], f: Filters): Diamond[] {
  return diamonds.filter((d) => {
    if (f.shapes.length && !f.shapes.includes(d.shape)) return false
    if (d.carat < f.carat[0] || d.carat > f.carat[1]) return false
    if (d.price < f.price[0] || d.price > f.price[1]) return false
    if (f.color) {
      const i = COLORS.indexOf(d.color)
      if (i < f.color[0] || i > f.color[1]) return false
    }
    if (f.clarity) {
      const i = CLARITIES.indexOf(d.clarity)
      if (i < f.clarity[0] || i > f.clarity[1]) return false
    }
    if (f.cut.length && !f.cut.includes(d.cut)) return false
    if (f.polish.length && !f.polish.includes(d.polish)) return false
    if (f.symmetry.length && !f.symmetry.includes(d.symmetry)) return false
    if (f.fluor.length && !f.fluor.includes(d.fluor)) return false
    if (f.labs.length && !f.labs.includes(d.lab)) return false
    return true
  })
}

export interface AppliedChip {
  key: string
  label: string
  clear: (f: Filters) => Filters
}

/** Applied-filter chips: one removable chip per active constraint. */
export function chipsFor(f: Filters): AppliedChip[] {
  const chips: AppliedChip[] = []
  if (f.shapes.length)
    chips.push({
      key: 'shapes',
      label: f.shapes.length <= 2 ? f.shapes.join(', ') : `${f.shapes.length} shapes`,
      clear: (x) => ({ ...x, shapes: [] }),
    })
  if (f.carat[0] !== CARAT_MIN || f.carat[1] !== CARAT_MAX)
    chips.push({
      key: 'carat',
      label: `${f.carat[0]}–${f.carat[1]} ct`,
      clear: (x) => ({ ...x, carat: [CARAT_MIN, CARAT_MAX] }),
    })
  if (f.price[0] !== PRICE_MIN || f.price[1] !== PRICE_MAX)
    chips.push({
      key: 'price',
      label: `${fmtPrice(f.price[0])}–${fmtPrice(f.price[1])}`,
      clear: (x) => ({ ...x, price: [PRICE_MIN, PRICE_MAX] }),
    })
  if (f.color)
    chips.push({
      key: 'color',
      label: `Color ${COLORS[f.color[0]]}${f.color[0] !== f.color[1] ? `–${COLORS[f.color[1]]}` : ''}`,
      clear: (x) => ({ ...x, color: null }),
    })
  if (f.clarity)
    chips.push({
      key: 'clarity',
      label: `Clarity ${CLARITIES[f.clarity[0]]}${f.clarity[0] !== f.clarity[1] ? `–${CLARITIES[f.clarity[1]]}` : ''}`,
      clear: (x) => ({ ...x, clarity: null }),
    })
  for (const [key, label] of [['cut', 'Cut'], ['polish', 'Polish'], ['symmetry', 'Symmetry']] as const) {
    const sel = f[key]
    if (sel.length && sel.length < FINISH_GRADES.length)
      chips.push({ key, label: `${label} ${sel.join('/')}`, clear: (x) => ({ ...x, [key]: [] }) })
  }
  if (f.fluor.length && f.fluor.length < FLUOR.length)
    chips.push({ key: 'fluor', label: `Fluor. ${f.fluor.join('/')}`, clear: (x) => ({ ...x, fluor: [] }) })
  if (f.labs.length && f.labs.length < LABS.length)
    chips.push({ key: 'labs', label: f.labs.join(', '), clear: (x) => ({ ...x, labs: [] }) })
  return chips
}
