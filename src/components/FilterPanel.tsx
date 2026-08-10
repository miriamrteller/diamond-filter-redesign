import { useState } from 'react'
import {
  CLARITIES, COLORS, FINISH_GRADES, FLUOR, LABS, SHAPES, fmtNum, fmtPrice,
} from '../data'
import {
  CARAT_MAX, CARAT_MIN, PRICE_MAX, PRICE_MIN, type Filters, defaultFilters,
} from '../filters'
import { Annotation } from './Annotation'
import { DualRange } from './DualRange'
import { GradeMulti, GradeRange } from './GradeRange'
import { ShapeIcon } from './ShapeIcon'

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  resultCount: number
  annotate: boolean
  sheetOpen: boolean
  onCloseSheet: () => void
}

function Accordion({ title, defaultOpen, children, pin }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  pin?: React.ReactNode
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="acc">
      <button type="button" className="acc-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>{title}{pin}</span>
        <span className="chev" aria-hidden="true">▾</span>
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  )
}

export function FilterPanel({ filters, onChange, resultCount, annotate, sheetOpen, onCloseSheet }: Props) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...filters, [k]: v })

  const toggleShape = (s: (typeof SHAPES)[number]) =>
    set('shapes', filters.shapes.includes(s)
      ? filters.shapes.filter((x) => x !== s)
      : [...filters.shapes, s])

  const toggleLab = (l: string) =>
    set('labs', filters.labs.includes(l)
      ? filters.labs.filter((x) => x !== l)
      : [...filters.labs, l])

  return (
    <aside className={`filters ${sheetOpen ? 'sheet-open' : ''}`} aria-label="Diamond filters">
      <div className="filters-head">
        <h2>
          Filters
          <Annotation n={3} kind="fix" title="Progressive disclosure" show={annotate}>
            The handful of filters behind most searches stays always visible.
            Finish grades and specialist criteria live in collapsed groups below —
            present, but no longer competing for attention with every query.
          </Annotation>
        </h2>
        <button type="button" className="btn-link" onClick={() => onChange(defaultFilters)}>
          Clear all
        </button>
      </div>

      <fieldset className="fgroup">
        <legend>
          Shape
          <Annotation n={1} kind="fix" title="Recognition over recall" show={annotate}>
            Shape outlines replace a text-only checkbox list. Selected chips get a
            filled state that passes contrast — not just a subtle border change.
          </Annotation>
        </legend>
        <div className="shape-grid">
          {SHAPES.map((s) => (
            <button
              key={s}
              type="button"
              className="shape-chip"
              aria-pressed={filters.shapes.includes(s)}
              onClick={() => toggleShape(s)}
            >
              <ShapeIcon shape={s} />
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="fgroup">
        <legend>Carat</legend>
        <DualRange
          label="Carat"
          min={CARAT_MIN} max={CARAT_MAX} step={0.05}
          value={filters.carat}
          onChange={(v) => set('carat', v)}
        />
      </fieldset>

      <fieldset className="fgroup">
        <legend>
          Color
          <Annotation n={4} kind="fix" title="Ranges match the mental model" show={annotate}>
            Traders ask for “G or better”, not five separate checkboxes. Pick one
            grade, then a second to select the whole span — two clicks instead of
            five, and the selection reads back as a range (“D – G”).
          </Annotation>
        </legend>
        <GradeRange
          label="Color"
          grades={COLORS}
          value={filters.color}
          onChange={(v) => set('color', v)}
        />
      </fieldset>

      <fieldset className="fgroup">
        <legend>Clarity</legend>
        <GradeRange
          label="Clarity"
          grades={CLARITIES}
          value={filters.clarity}
          onChange={(v) => set('clarity', v)}
        />
      </fieldset>

      <fieldset className="fgroup">
        <legend>Price</legend>
        <DualRange
          label="Price"
          min={PRICE_MIN} max={PRICE_MAX} step={500}
          value={filters.price}
          onChange={(v) => set('price', v)}
          format={fmtPrice}
        />
      </fieldset>

      <Accordion title="Finish" defaultOpen>
        {([['cut', 'Cut'], ['polish', 'Polish'], ['symmetry', 'Symmetry']] as const).map(
          ([key, label]) => (
            <div className="seg-row" key={key}>
              <span className="seg-label" id={`seg-${key}`}>{label}</span>
              <div style={{ flex: 1 }}>
                <GradeMulti
                  label={label}
                  options={FINISH_GRADES}
                  value={filters[key]}
                  onChange={(v) => set(key, v)}
                />
              </div>
            </div>
          ),
        )}
      </Accordion>

      <Accordion
        title="More filters"
        pin={
          <Annotation n={5} kind="fix" title="Specialist criteria, on demand" show={annotate}>
            Fluorescence and grading lab matter for specific buys, not most of
            them. Collapsing them cut the visible control count from 60+ to 26
            without removing a single capability.
          </Annotation>
        }
      >
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <span className="fgroup-legend">Fluorescence</span>
          <GradeMulti
            label="Fluorescence"
            options={FLUOR}
            value={filters.fluor}
            onChange={(v) => set('fluor', v)}
          />
        </div>
        <div>
          <span className="fgroup-legend">Grading lab</span>
          <div className="check-row">
            {LABS.map((l) => (
              <label className="check" key={l}>
                <input
                  type="checkbox"
                  checked={filters.labs.includes(l)}
                  onChange={() => toggleLab(l)}
                />
                {l}
              </label>
            ))}
          </div>
        </div>
      </Accordion>

      {sheetOpen && (
        <div className="sheet-footer">
          <button type="button" className="close-x" aria-label="Close filters" onClick={onCloseSheet}>
            ✕
          </button>
          <button type="button" className="btn-primary" onClick={onCloseSheet}>
            Show {fmtNum(resultCount)} diamonds
          </button>
        </div>
      )}
    </aside>
  )
}
