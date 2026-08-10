export const SHAPES = [
  'Round', 'Princess', 'Cushion', 'Oval', 'Emerald',
  'Pear', 'Marquise', 'Radiant', 'Asscher', 'Heart',
] as const
export type Shape = (typeof SHAPES)[number]

export const COLORS = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'] as const
export type Color = (typeof COLORS)[number]

export const CLARITIES = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1'] as const
export type Clarity = (typeof CLARITIES)[number]

export const FINISH_GRADES = ['EX', 'VG', 'G', 'F'] as const
export type FinishGrade = (typeof FINISH_GRADES)[number]

export const FLUOR = ['None', 'Faint', 'Medium', 'Strong'] as const
export type Fluor = (typeof FLUOR)[number]

export const LABS = ['GIA', 'IGI', 'HRD'] as const
export type Lab = (typeof LABS)[number]

export interface Diamond {
  id: string
  shape: Shape
  carat: number
  color: Color
  clarity: Clarity
  cut: FinishGrade
  polish: FinishGrade
  symmetry: FinishGrade
  fluor: Fluor
  lab: Lab
  price: number
  location: string
}

// Deterministic PRNG so the dataset is identical on every load (stable demo, stable screenshots).
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted<T>(rnd: () => number, items: readonly T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rnd() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

const LOCATIONS = ['Ramat Gan', 'New York', 'Antwerp', 'Mumbai', 'Hong Kong', 'Dubai']

export function generateDiamonds(count = 240): Diamond[] {
  const rnd = mulberry32(20210614)
  const out: Diamond[] = []
  for (let i = 0; i < count; i++) {
    const shape = pickWeighted(rnd, SHAPES, [40, 8, 9, 12, 7, 8, 4, 5, 3, 4])
    // Skew carat toward smaller stones, occasional large ones.
    const carat = Math.round((0.3 + Math.pow(rnd(), 2.2) * 4.7) * 100) / 100
    const color = pickWeighted(rnd, COLORS, [6, 9, 11, 14, 14, 12, 10, 9, 8, 7])
    const clarity = pickWeighted(rnd, CLARITIES, [2, 4, 8, 10, 14, 16, 18, 16, 12])
    const cut = pickWeighted(rnd, FINISH_GRADES, [45, 35, 15, 5])
    const polish = pickWeighted(rnd, FINISH_GRADES, [50, 35, 12, 3])
    const symmetry = pickWeighted(rnd, FINISH_GRADES, [45, 38, 14, 3])
    const fluor = pickWeighted(rnd, FLUOR, [55, 22, 15, 8])
    const lab = pickWeighted(rnd, LABS, [70, 20, 10])

    // Rough price model: base $/ct scaled by color/clarity/cut quality, superlinear in carat.
    const colorFactor = 1 - COLORS.indexOf(color) * 0.07
    const clarityFactor = 1 - CLARITIES.indexOf(clarity) * 0.08
    const cutFactor = 1 - FINISH_GRADES.indexOf(cut) * 0.06
    const basePerCt = 5200 * colorFactor * clarityFactor * cutFactor
    const noise = 0.85 + rnd() * 0.3
    const price = Math.round((basePerCt * Math.pow(carat, 1.72) * noise) / 10) * 10

    out.push({
      id: `RD-${(100000 + i).toString()}`,
      shape, carat, color, clarity, cut, polish, symmetry, fluor, lab, price,
      location: LOCATIONS[Math.floor(rnd() * LOCATIONS.length)],
    })
  }
  return out
}

export const fmtPrice = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const fmtNum = (n: number) => n.toLocaleString('en-US')
