import type { Shape } from '../data'

const PATHS: Record<Shape, JSX.Element> = {
  Round: <circle cx="12" cy="12" r="8.5" />,
  Princess: <rect x="4.5" y="4.5" width="15" height="15" />,
  Cushion: <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" />,
  Oval: <ellipse cx="12" cy="12" rx="6.5" ry="9" />,
  Emerald: (
    <>
      <rect x="5.5" y="3.5" width="13" height="17" />
      <rect x="8" y="6.5" width="8" height="11" />
    </>
  ),
  Pear: <path d="M12 3.5c3 4 6.5 6.5 6.5 11a6.5 6.5 0 0 1-13 0c0-4.5 3.5-7 6.5-11Z" />,
  Marquise: <path d="M12 3c3.5 3 5.5 6 5.5 9s-2 6-5.5 9c-3.5-3-5.5-6-5.5-9s2-6 5.5-9Z" />,
  Radiant: <path d="M8 4.5h8l3.5 3.5v8L16 19.5H8L4.5 16V8L8 4.5Z" />,
  Asscher: (
    <>
      <path d="M8 4.5h8l3.5 3.5v8L16 19.5H8L4.5 16V8L8 4.5Z" />
      <path d="M9.5 7.5h5L17 10v4l-2.5 2.5h-5L7 14v-4l2.5-2.5Z" />
    </>
  ),
  Heart: <path d="M12 20 5.5 13.2A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 6.5 5.8L12 20Z" />,
}

export function ShapeIcon({ shape }: { shape: Shape }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[shape]}
    </svg>
  )
}
