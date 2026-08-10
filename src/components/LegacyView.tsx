import { type Diamond, CLARITIES, COLORS, FINISH_GRADES, FLUOR, LABS, SHAPES } from '../data'
import { Annotation } from './Annotation'

/**
 * Illustrative "before" exhibit — a composite of the class of problems the
 * legacy filter had, not a replica of the real RapNet UI. Every violation
 * here is deliberate: 8–9px type, ~2.4:1 contrast, 60+ flat controls,
 * 10px hit targets, a fixed 1120px layout, and results only after pressing
 * Search. Not a real search UI — the checkboxes are inert props.
 */
export function LegacyView({ annotate, sample }: { annotate: boolean; sample: Diamond[] }) {
  return (
    <div>
      <p className="legacy-note">
        <b>Illustrative, not a replica.</b> This view recreates the <i>class</i> of problems the
        legacy filter had — sub-readable type, checkbox walls, no feedback loop — not the actual
        RapNet interface. All listings are generated. Toggle <b>Annotations</b> for the audit.
      </p>
      <div className="legacy-scroll">
        <div className="legacy">
          <h2>
            Diamond Search — Advanced
            <Annotation n={1} kind="issue" title="Sub-readable type" show={annotate}>
              Body text is 9px and group labels are 8px — under any recognized
              minimum, and the first thing every new user squinted at. The
              redesign sets a 12px floor and 14px body via design tokens.
            </Annotation>
            <Annotation n={2} kind="issue" title="Contrast ≈ 2.4:1" show={annotate}>
              Grey-on-grey text (#9a9a9a on #f4f4f4) fails WCAG AA (4.5:1)
              across the whole panel — hardest on the traders using this screen
              eight hours a day.
            </Annotation>
          </h2>
          <div className="legacy-grid">
            <div className="legacy-box">
              <h3>
                Shape
                <Annotation n={3} kind="issue" title="60+ flat controls" show={annotate}>
                  Every filter is a wall of checkboxes with equal visual weight —
                  no hierarchy, no grouping by frequency of use. Finding the one
                  control you need means scanning all of them.
                </Annotation>
              </h3>
              {SHAPES.map((s) => (
                <label key={s}><input type="checkbox" tabIndex={-1} readOnly checked={false} />{s}</label>
              ))}
            </div>
            <div className="legacy-box">
              <h3>
                Color
                <Annotation n={4} kind="issue" title="Checkbox ≠ range" show={annotate}>
                  Selecting “D to H” takes five precise 10px clicks. Traders
                  think in spans (“G or better”); the UI forces enumeration —
                  and misclicking silently changes the query.
                </Annotation>
              </h3>
              {COLORS.map((c) => (
                <label key={c}><input type="checkbox" tabIndex={-1} readOnly checked={false} />{c}</label>
              ))}
            </div>
            <div className="legacy-box">
              <h3>Clarity</h3>
              {CLARITIES.map((c) => (
                <label key={c}><input type="checkbox" tabIndex={-1} readOnly checked={false} />{c}</label>
              ))}
            </div>
            <div className="legacy-box">
              <h3>Cut / Polish / Sym</h3>
              {(['Cut', 'Polish', 'Symmetry'] as const).map((g) => (
                <div key={g}>
                  <h3>{g}</h3>
                  {FINISH_GRADES.map((f) => (
                    <label key={f}><input type="checkbox" tabIndex={-1} readOnly checked={false} />{f}</label>
                  ))}
                </div>
              ))}
            </div>
            <div className="legacy-box">
              <h3>Fluor / Lab</h3>
              {FLUOR.map((f) => (
                <label key={f}><input type="checkbox" tabIndex={-1} readOnly checked={false} />{f}</label>
              ))}
              <h3>Lab</h3>
              {LABS.map((l) => (
                <label key={l}><input type="checkbox" tabIndex={-1} readOnly checked={false} />{l}</label>
              ))}
            </div>
            <div className="legacy-box">
              <h3>
                Measurements
                <Annotation n={5} kind="issue" title="Everything, always" show={annotate}>
                  Specialist fields (depth %, table %, ratio…) sit at the same
                  level as carat and price, although most searches never touch
                  them. In the redesign they collapse into “More filters”.
                </Annotation>
              </h3>
              {['Carat', 'Price', 'Depth %', 'Table %', 'Ratio', 'Disc %'].map((f) => (
                <div className="legacy-fieldrow" key={f}>
                  <span style={{ width: 38 }}>{f}</span>
                  <input type="text" tabIndex={-1} readOnly placeholder="min" />
                  <input type="text" tabIndex={-1} readOnly placeholder="max" />
                </div>
              ))}
            </div>
          </div>
          <div className="legacy-actions">
            <button type="button" tabIndex={-1}>Search</button>
            <button type="button" tabIndex={-1}>Reset</button>
            <span className="legacy-hint">
              Results update after Search
              <Annotation n={6} kind="issue" title="No feedback loop" show={annotate}>
                The result count only appears after pressing Search — users guess
                at filter combinations, submit, get zero results, loosen a filter,
                and submit again. The redesign shows a live count while filtering.
              </Annotation>
              <Annotation n={7} kind="issue" title="Desktop-only, 1120px fixed" show={annotate}>
                The layout is a fixed-width table: on a phone or a narrow window
                it horizontally scrolls (try it — this reconstruction preserves
                that). No focus indicators, no fieldsets, ~10px hit targets.
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
