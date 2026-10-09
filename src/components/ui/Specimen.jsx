import { useMemo } from 'react'
import { hash, seeded } from '../../utils/math'

const outlines = {
  pointed: 'M0 0C9 -12 10 -34 0 -50C-10 -34 -9 -12 0 0Z',
  round: 'M0 0C17 -9 18 -36 0 -46C-18 -36 -17 -9 0 0Z',
  notched: 'M0 0C14 -12 17 -34 7 -48L0 -42L-7 -48C-17 -34 -14 -12 0 0Z',
  curled: 'M0 0C5 -16 13 -32 24 -44C10 -43 1 -26 0 0Z'
}

export default function Specimen({ flower, size, spin = false, className = '' }) {
  const clustered = Boolean(flower.cluster)
  const coreRadius = clustered ? 0 : flower.id === 'sunflower' ? 15 : 5

  const petals = useMemo(() => {
    const rand = seeded(hash(flower.id))

    if (flower.cluster) {
      const total = flower.cluster
      const list = []
      for (let k = 0; k < total; k++) {
        const r = 42 * Math.sqrt((k + 0.5) / total)
        const a = k * 2.39996
        const spinAngle = rand() * 90
        const s = 0.2 + rand() * 0.05
        for (let q = 0; q < 4; q++) {
          list.push({
            tx: Math.cos(a) * r,
            ty: Math.sin(a) * r,
            angle: spinAngle + q * 90,
            sx: s,
            sy: s,
            fill: (k + q) % 3 === 0 ? flower.colors.secondary : flower.colors.primary,
            alpha: 0.96
          })
        }
      }
      return list
    }

    const n = flower.petals
    const narrow = n > 12 ? 0.5 : 1
    const ring = (scale, offset, fill, alpha) =>
      Array.from({ length: n }, (_, i) => ({
        tx: 0,
        ty: 0,
        angle: (i / n) * 360 + offset + (rand() - 0.5) * 7,
        sx: scale * narrow * (0.9 + rand() * 0.2),
        sy: scale * (0.88 + rand() * 0.24),
        fill,
        alpha
      }))
    return [
      ...ring(1, 0, flower.colors.secondary, 0.92),
      ...ring(0.72, 180 / n, flower.colors.primary, 0.96)
    ]
  }, [flower])

  const dots = useMemo(() => {
    if (clustered) return []
    if (flower.id === 'sunflower') {
      return Array.from({ length: 55 }, (_, i) => {
        const r = coreRadius * 0.92 * Math.sqrt((i + 0.5) / 55)
        const a = i * 2.39996
        return { x: Math.cos(a) * r, y: Math.sin(a) * r, r: 0.9 }
      })
    }
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2
      return { x: Math.cos(a) * (coreRadius + 6), y: Math.sin(a) * (coreRadius + 6), r: 1.3 }
    })
  }, [flower, coreRadius, clustered])

  return (
    <svg
      className={`specimen ${className}`.trim()}
      viewBox="-60 -60 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={`${flower.name}, drawn from above`}
    >
      <circle className="specimen__ring" r="57" />
      <g>
        {spin && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="140s"
            repeatCount="indefinite"
          />
        )}
        {petals.map((p, i) => (
          <path
            key={i}
            className="specimen__petal"
            d={outlines[flower.petalShape]}
            transform={`translate(${p.tx.toFixed(2)} ${p.ty.toFixed(2)}) rotate(${p.angle.toFixed(2)}) scale(${p.sx.toFixed(3)} ${p.sy.toFixed(3)})`}
            fill={p.fill}
            fillOpacity={p.alpha}
          />
        ))}
      </g>
      {coreRadius > 0 && <circle className="specimen__core" r={coreRadius} fill={flower.colors.core} />}
      {dots.map((d, i) => (
        <circle key={i} className="specimen__dot" cx={d.x} cy={d.y} r={d.r} />
      ))}
    </svg>
  )
}
