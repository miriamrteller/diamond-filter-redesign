export type GradeSpan = [number, number] | null

interface Props {
  label: string
  grades: readonly string[]
  value: GradeSpan
  onChange: (v: GradeSpan) => void
  describe?: (span: GradeSpan) => string
}

/**
 * Contiguous-range grade selector (color, clarity).
 * Traders think in spans ("G or better"), not individual checkboxes:
 * click one grade to select it, click another to extend the span,
 * click inside the current span to start over from that grade.
 */
export function GradeRange({ label, grades, value, onChange, describe }: Props) {
  const inSpan = (i: number) => value !== null && i >= value[0] && i <= value[1]

  const pick = (i: number) => {
    if (value === null) onChange([i, i])
    else if (inSpan(i)) onChange(value[0] === value[1] && value[0] === i ? null : [i, i])
    else onChange([Math.min(value[0], i), Math.max(value[1], i)])
  }

  const spanText =
    value === null
      ? 'Any'
      : value[0] === value[1]
        ? grades[value[0]]
        : `${grades[value[0]]} – ${grades[value[1]]}`

  return (
    <div role="group" aria-label={label}>
      <div className="grade-row">
        {grades.map((g, i) => (
          <button
            key={g}
            type="button"
            className="grade-cell"
            aria-pressed={inSpan(i)}
            onClick={() => pick(i)}
          >
            {g}
          </button>
        ))}
      </div>
      <p className="grade-value" aria-live="polite">
        {label}: <b>{describe ? describe(value) : spanText}</b>
      </p>
    </div>
  )
}

interface MultiProps {
  label: string
  options: readonly string[]
  value: string[]
  onChange: (v: string[]) => void
}

/** Independent multi-select toggle row (fluorescence, finish grades). */
export function GradeMulti({ label, options, value, onChange }: MultiProps) {
  const toggle = (g: string) =>
    onChange(value.includes(g) ? value.filter((x) => x !== g) : [...value, g])

  return (
    <div className="grade-row" role="group" aria-label={label}>
      {options.map((g) => (
        <button
          key={g}
          type="button"
          className="grade-cell"
          aria-pressed={value.includes(g)}
          onClick={() => toggle(g)}
        >
          {g}
        </button>
      ))}
    </div>
  )
}
