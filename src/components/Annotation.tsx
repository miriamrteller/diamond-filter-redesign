import { useEffect, useId, useRef, useState } from 'react'

interface Props {
  n: number
  kind: 'issue' | 'fix'
  title: string
  children: React.ReactNode
  show: boolean
}

/**
 * Numbered annotation pin used by the case-study layer.
 * Red pins mark problems in the legacy reconstruction; green pins mark
 * decisions in the redesign. Fully keyboard operable (Esc closes).
 */
export function Annotation({ n, kind, title, children, show }: Props) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!show) return null
  return (
    <span className="pin-wrap" ref={ref}>
      <button
        type="button"
        className={`pin ${kind === 'issue' ? 'pin-issue' : ''}`}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Annotation ${n}: ${title}`}
        onClick={() => setOpen((v) => !v)}
      >
        {n}
      </button>
      {open && (
        <span id={id} role="note" className={`pin-pop ${kind === 'issue' ? 'pin-pop-issue' : ''}`}>
          <strong>{title}.</strong> {children}
        </span>
      )}
    </span>
  )
}
