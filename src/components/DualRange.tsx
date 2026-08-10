import { useId } from 'react'

interface Props {
  label: string
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (v: [number, number]) => void
  format?: (n: number) => string
  parse?: (s: string) => number
}

/**
 * Dual-thumb range with paired numeric inputs.
 * Native <input type=range> thumbs keep full keyboard/AT support for free.
 */
export function DualRange({ label, min, max, step, value, onChange, format }: Props) {
  const id = useId()
  const [lo, hi] = value
  const pct = (n: number) => ((n - min) / (max - min)) * 100

  const setLo = (n: number) => onChange([Math.min(Math.max(n, min), hi), hi])
  const setHi = (n: number) => onChange([lo, Math.max(Math.min(n, max), lo)])

  return (
    <div className="dual" role="group" aria-label={label}>
      <div className="dual-track">
        <div className="dual-rail" />
        <div className="dual-fill" style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <input
          type="range"
          aria-label={`${label} minimum`}
          min={min} max={max} step={step} value={lo}
          onChange={(e) => setLo(Number(e.target.value))}
        />
        <input
          type="range"
          aria-label={`${label} maximum`}
          min={min} max={max} step={step} value={hi}
          onChange={(e) => setHi(Number(e.target.value))}
        />
      </div>
      <div className="dual-inputs">
        <label className="visually-hidden" htmlFor={`${id}-lo`}>{label} from</label>
        <input
          id={`${id}-lo`} type="number" inputMode="decimal"
          min={min} max={max} step={step} value={lo}
          onChange={(e) => setLo(Number(e.target.value) || min)}
        />
        <span aria-hidden="true">to</span>
        <label className="visually-hidden" htmlFor={`${id}-hi`}>{label} to</label>
        <input
          id={`${id}-hi`} type="number" inputMode="decimal"
          min={min} max={max} step={step} value={hi}
          onChange={(e) => setHi(Number(e.target.value) || max)}
        />
      </div>
      {format && (
        <p className="grade-value" aria-live="polite">
          {label}: <b>{format(lo)} – {format(hi)}</b>
        </p>
      )}
    </div>
  )
}
