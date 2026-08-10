import { useState } from 'react'
import { type Diamond, CLARITIES, COLORS, FLUOR, LABS, SHAPES } from '../data'
import { Annotation } from './Annotation'

/**
 * "Before" exhibit — reconstructed from memory of the classic RapNet filter
 * pattern: a grid of grey ~2-inch tiles, each holding a white scrollable
 * checklist with navy selection highlights and a small pill box of selected
 * values above the list. Details are approximate; the audit points it
 * demonstrates (9px type, low contrast, scroll-within-scroll, enumeration
 * clicks, no live feedback, fixed-width layout) are the real ones.
 */

const FINISH_OPTS = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
const LOCATIONS = ['Israel', 'USA', 'Belgium', 'India', 'Hong Kong', 'UAE', 'UK', 'South Africa']

function LegacyTile({ title, options, initial, pin }: {
  title: string
  options: readonly string[]
  initial?: string[]
  pin?: React.ReactNode
}) {
  const [sel, setSel] = useState<string[]>(initial ?? [])
  const toggle = (o: string) =>
    setSel(sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o])

  return (
    <div className="legacy-tile">
      <h3>{title}{pin}</h3>
      <div className="legacy-pillbox">
        {sel.map((s) => (
          <span className="legacy-pill" key={s}>
            {s}
            <button type="button" aria-label={`Remove ${s}`} onClick={() => toggle(s)}>×</button>
          </span>
        ))}
      </div>
      <div className="legacy-list">
        {options.map((o) => (
          <label key={o} className={sel.includes(o) ? 'sel' : ''}>
            <input type="checkbox" checked={sel.includes(o)} onChange={() => toggle(o)} />
            {o}
          </label>
        ))}
      </div>
    </div>
  )
}

export function LegacyView({ annotate, sample }: { annotate: boolean; sample: Diamond[] }) {
  const [advOpen, setAdvOpen] = useState(false)
  return (
    <div>
      <p className="legacy-note">
        <b>Reconstructed from memory.</b> The classic RapNet filter pattern — grey tiles, each
        with a scrollable white checklist, navy selection highlights, and a pill box of selected
        values. Details are approximate and all listings are generated. Toggle{' '}
        <b>Annotations</b> for the audit.
      </p>
      <div className="legacy-scroll">
        <div className="legacy">
          <h2>
            Diamond Search
            <Annotation n={1} kind="issue" title="Sub-readable type" show={annotate}>
              List items are 9px and tile titles smaller still — below any
              recognized minimum, and the first thing every new user squinted
              at. The concept sets a 12px floor and 14px body via design tokens.
            </Annotation>
            <Annotation n={2} kind="issue" title="Contrast fails AA" show={annotate}>
              Grey-on-grey labels on grey tiles sit far under WCAG AA&apos;s
              4.5:1 — hardest on the traders using this screen eight hours a
              day.
            </Annotation>
          </h2>
          <div className="legacy-tiles">
            <LegacyTile
              title="Shape"
              options={SHAPES}
              initial={['Round', 'Oval']}
              pin={
                <Annotation n={5} kind="issue" title="Selection state in a 30px box" show={annotate}>
                  Selected values collect as tiny pills in a ~30px input above
                  each list. Pick more than a few and the pills overflow out of
                  sight — the current query is never fully visible, and the ×
                  targets are a few pixels wide.
                </Annotation>
              }
            />
            <LegacyTile
              title="Color"
              options={COLORS}
              initial={['D', 'E', 'F', 'G', 'H']}
              pin={
                <Annotation n={4} kind="issue" title="Checkbox ≠ range" show={annotate}>
                  Traders think in spans (“G or better”), but selecting D–H
                  means five separate clicks inside a scrolling list — and a
                  misclick silently changes the query. The concept replaces
                  enumeration with two-tap range selection.
                </Annotation>
              }
            />
            <LegacyTile
              title="Clarity"
              options={CLARITIES}
              pin={
                <Annotation n={3} kind="issue" title="Scroll-within-scroll" show={annotate}>
                  Each checklist shows ~6 of its options through a 2-inch
                  window with its own mini scrollbar, inside a page that also
                  scrolls. Finding “VS2” means scrolling a tile; checked items
                  scroll out of view — which is why the pill box exists at all.
                </Annotation>
              }
            />
            <LegacyTile title="Cut" options={FINISH_OPTS} />
            <LegacyTile title="Polish" options={FINISH_OPTS} />
            <LegacyTile title="Symmetry" options={FINISH_OPTS} />
            <LegacyTile title="Fluorescence" options={FLUOR} />
            <LegacyTile title="Lab" options={LABS} />
            <LegacyTile title="Location" options={LOCATIONS} />
          </div>
          <div className="legacy-adv">
            <button type="button" className="legacy-adv-toggle" onClick={() => setAdvOpen(!advOpen)}>
              {advOpen ? '▼' : '►'} Advanced Options
            </button>
            {advOpen && (
              <div className="legacy-adv-body">
                {['Carat', 'Price $/Ct', 'Total Price', 'Depth %', 'Table %', 'L/W Ratio', 'Disc %'].map((f) => (
                  <div className="legacy-fieldrow" key={f}>
                    <span>{f}</span>
                    <input type="text" tabIndex={-1} readOnly placeholder="From" />
                    <input type="text" tabIndex={-1} readOnly placeholder="To" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="legacy-actions">
            <button type="button" tabIndex={-1}>Search</button>
            <button type="button" tabIndex={-1}>Reset</button>
            <span className="legacy-hint">
              Results update after Search
              <Annotation n={6} kind="issue" title="No feedback loop" show={annotate}>
                The result count only appears after pressing Search — users
                guess at filter combinations, submit, hit zero results, loosen
                something, and submit again. The concept shows a live count
                while filtering.
              </Annotation>
              <Annotation n={7} kind="issue" title="Desktop-only, fixed width" show={annotate}>
                The layout is a fixed-width grid: on a phone or a narrow window
                it horizontally scrolls (try it — this reconstruction preserves
                that). No focus indicators, no fieldset structure for screen
                readers, hit targets around 10px.
              </Annotation>
            </span>
          </div>
          <table>
            <thead>
              <tr>
                {['Stock #', 'Shape', 'Carat', 'Color', 'Clarity', 'Cut', 'Pol', 'Sym', 'Fluor', 'Lab', 'Loc', '$/ct', 'Price'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sample.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.shape}</td>
                  <td>{d.carat.toFixed(2)}</td>
                  <td>{d.color}</td>
                  <td>{d.clarity}</td>
                  <td>{d.cut}</td>
                  <td>{d.polish}</td>
                  <td>{d.symmetry}</td>
                  <td>{d.fluor}</td>
                  <td>{d.lab}</td>
                  <td>{d.location}</td>
                  <td>{Math.round(d.price / d.carat)}</td>
                  <td>{d.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
