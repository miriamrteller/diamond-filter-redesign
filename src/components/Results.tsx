import { useMemo, useState } from 'react'
import { type Diamond, fmtNum, fmtPrice } from '../data'
import { type AppliedChip, type Filters } from '../filters'
import { Annotation } from './Annotation'
import { ShapeIcon } from './ShapeIcon'

type SortKey = 'price' | 'carat' | 'pricePerCt'
type SortDir = 'asc' | 'desc'
const PAGE = 25

interface Props {
  diamonds: Diamond[]
  total: number
  chips: AppliedChip[]
  filters: Filters
  onChange: (f: Filters) => void
  annotate: boolean
}

export function Results({ diamonds, total, chips, filters, onChange, annotate }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('price')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const val = (d: Diamond) => (sortKey === 'pricePerCt' ? d.price / d.carat : d[sortKey])
    return [...diamonds].sort((a, b) => (sortDir === 'asc' ? val(a) - val(b) : val(b) - val(a)))
  }, [diamonds, sortKey, sortDir])

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE))
  const safePage = Math.min(page, pages - 1)
  const rows = sorted.slice(safePage * PAGE, safePage * PAGE + PAGE)

  const sortBy = (k: SortKey) => {
    if (k === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
    setPage(0)
  }
  const ariaSort = (k: SortKey) =>
    k === sortKey ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined
  const arrow = (k: SortKey) => (k === sortKey ? (sortDir === 'asc' ? '↑' : '↓') : '')

  return (
    <section className="results" aria-label="Search results">
      <div className="results-bar">
        <p className="results-count" aria-live="polite">
          {fmtNum(sorted.length)} diamonds{' '}
          <span className="muted">of {fmtNum(total)}</span>
          <Annotation n={6} kind="fix" title="Live feedback" show={annotate}>
            The count and the results update as filters change — no “Search”
            round-trip, no dead-end zero-result submissions. Screen-reader users
            hear the same update via a polite live region.
          </Annotation>
        </p>
        <div className="sort-wrap">
          <label htmlFor="sort">Sort</label>
          <select
            id="sort"
            value={`${sortKey}:${sortDir}`}
            onChange={(e) => {
              const [k, d] = e.target.value.split(':') as [SortKey, SortDir]
              setSortKey(k); setSortDir(d); setPage(0)
            }}
          >
            <option value="price:asc">Price — low to high</option>
            <option value="price:desc">Price — high to low</option>
            <option value="carat:asc">Carat — low to high</option>
            <option value="carat:desc">Carat — high to low</option>
            <option value="pricePerCt:asc">$/ct — low to high</option>
            <option value="pricePerCt:desc">$/ct — high to low</option>
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="chips" aria-label="Active filters" style={{ listStyle: 'none', padding: 0, margin: '0 0 12px' }}>
          {chips.map((c) => (
            <li key={c.key} className="chip">
              {c.label}
              <button
                type="button"
                aria-label={`Remove filter ${c.label}`}
                onClick={() => onChange(c.clear(filters))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {sorted.length === 0 ? (
        <div className="table-card">
          <div className="empty">
            <h3>No diamonds match these filters</h3>
            <p>Try widening the carat or price range, or removing a filter chip above.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="table-card">
            <table className="dtable">
              <thead>
                <tr>
                  <th scope="col">Shape</th>
                  <th scope="col" className="num" aria-sort={ariaSort('carat')}>
                    <button type="button" onClick={() => sortBy('carat')}>Carat {arrow('carat')}</button>
                  </th>
                  <th scope="col">Color</th>
                  <th scope="col">Clarity</th>
                  <th scope="col">Cut</th>
                  <th scope="col">Pol</th>
                  <th scope="col">Sym</th>
                  <th scope="col">Fluor</th>
                  <th scope="col">Lab</th>
                  <th scope="col" className="num" aria-sort={ariaSort('pricePerCt')}>
                    <button type="button" onClick={() => sortBy('pricePerCt')}>$/ct {arrow('pricePerCt')}</button>
                  </th>
                  <th scope="col" className="num" aria-sort={ariaSort('price')}>
                    <button type="button" onClick={() => sortBy('price')}>Price {arrow('price')}</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td><span className="shape-cell"><ShapeIcon shape={d.shape} />{d.shape}</span></td>
                    <td className="num">{d.carat.toFixed(2)}</td>
                    <td>{d.color}</td>
                    <td>{d.clarity}</td>
                    <td>{d.cut}</td>
                    <td>{d.polish}</td>
                    <td>{d.symmetry}</td>
                    <td>{d.fluor}</td>
                    <td><span className="lab-tag">{d.lab}</span></td>
                    <td className="num">{fmtPrice(Math.round(d.price / d.carat))}</td>
                    <td className="num price-strong">{fmtPrice(d.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pager">
              <button type="button" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                ← Prev
              </button>
              <span>Page {safePage + 1} of {pages}</span>
              <button type="button" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>
                Next →
              </button>
            </div>
          </div>

          <div className="cards" aria-hidden="false">
            {rows.map((d) => (
              <article className="dcard" key={d.id}>
                <div className="dcard-top">
                  <span className="dcard-title"><ShapeIcon shape={d.shape} />{d.carat.toFixed(2)} ct {d.shape}</span>
                  <span className="dcard-price">{fmtPrice(d.price)}</span>
                </div>
                <div className="dcard-meta">
                  <span>{d.color} · {d.clarity}</span>
                  <span>Cut {d.cut}</span>
                  <span>Pol {d.polish} · Sym {d.symmetry}</span>
                  <span>Fluor {d.fluor}</span>
                  <span>{d.lab}</span>
                  <span>{fmtPrice(Math.round(d.price / d.carat))}/ct</span>
                </div>
              </article>
            ))}
            <div className="pager">
              <button type="button" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                ← Prev
              </button>
              <span>Page {safePage + 1} of {pages}</span>
              <button type="button" disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)}>
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
