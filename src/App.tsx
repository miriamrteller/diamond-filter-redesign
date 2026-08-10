import { useMemo, useState } from 'react'
import { generateDiamonds, fmtNum } from './data'
import { applyFilters, chipsFor, defaultFilters, type Filters } from './filters'
import { Annotation } from './components/Annotation'
import { FilterPanel } from './components/FilterPanel'
import { LegacyView } from './components/LegacyView'
import { Results } from './components/Results'

const ALL = generateDiamonds()

export default function App() {
  const [view, setView] = useState<'legacy' | 'redesign'>('redesign')
  const [annotate, setAnnotate] = useState(true)
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sheetOpen, setSheetOpen] = useState(false)

  const results = useMemo(() => applyFilters(ALL, filters), [filters])
  const chips = chipsFor(filters)

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <h1>Diamond Filter Redesign</h1>
          <p className="sub">
            Interactive case study · a concept redesign informed by my front-end lead work at
            Rapaport — not a replica of the shipped product · generated data
          </p>
        </div>
        <div className="masthead-controls">
          <div className="view-toggle" role="group" aria-label="Choose version">
            <button
              type="button"
              aria-pressed={view === 'legacy'}
              onClick={() => setView('legacy')}
            >
              Before · legacy
            </button>
            <button
              type="button"
              aria-pressed={view === 'redesign'}
              onClick={() => setView('redesign')}
            >
              After · concept
            </button>
          </div>
          <button
            type="button"
            className="annot-toggle"
            aria-pressed={annotate}
            onClick={() => setAnnotate(!annotate)}
          >
            {annotate ? '● ' : '○ '}Annotations
          </button>
        </div>
      </header>

      {view === 'legacy' ? (
        <LegacyView annotate={annotate} sample={ALL.slice(0, 10)} />
      ) : (
        <main className="workspace">
          <div className="mobile-bar">
            <button
              type="button"
              className="mobile-filter-btn"
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen(true)}
            >
              Filters {chips.length > 0 && <span className="badge">{chips.length}</span>}
              <Annotation n={7} kind="fix" title="Mobile-first sheet" show={annotate}>
                On small screens the sidebar becomes a full-screen sheet with a
                sticky “Show N diamonds” action — filter, see the count move,
                commit. All targets are 44px minimum.
              </Annotation>
            </button>
          </div>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            resultCount={results.length}
            annotate={annotate && !sheetOpen}
            sheetOpen={sheetOpen}
            onCloseSheet={() => setSheetOpen(false)}
          />
          <Results
            diamonds={results}
            total={ALL.length}
            chips={chips}
            filters={filters}
            onChange={setFilters}
            annotate={annotate}
          />
        </main>
      )}

      <footer className="context-strip">
        <div className="inner">
          <b>{fmtNum(ALL.length)} generated listings</b> stand in for live inventory. This is a
          concept redesign built for my portfolio — informed by my years leading RapNet's front
          end, not a replica of the shipped product; no proprietary Rapaport code, data or assets
          are used. <a href="https://miriamrteller.com">miriamrteller.com</a>. Type floor 12px ·
          WCAG AA contrast · full keyboard support · 44px touch targets.
        </div>
      </footer>
    </div>
  )
}
