import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Specimen from '../ui/Specimen'
import { flowers } from '../../data/flowers'
import { structureOf, recordOf } from '../../data/lab'
import { selectSelectedFlower } from '../../store/slices/flowersSlice'
import useInView from '../../hooks/useInView'
import LabScene from './LabScene'

const pad = (n) => String(n).padStart(2, '0')

export default function Lab() {
  const selected = useSelector(selectSelectedFlower)
  const [index, setIndex] = useState(() => Math.max(0, flowers.findIndex((f) => f.id === selected.id)))
  const [explode, setExplode] = useState(0)
  const [bloom, setBloom] = useState(1)
  const [spin, setSpin] = useState(false)
  const [labels, setLabels] = useState(true)
  const [active, setActive] = useState(null)
  const [resetKey, setResetKey] = useState(0)
  const [viewRef, inView, seen] = useInView()

  const flower = flowers[index]
  const parts = structureOf(flower)
  const record = recordOf(flower)
  const activePart = parts.find((p) => p.id === active)

  useEffect(() => {
    setActive(null)
    setResetKey((k) => k + 1)
  }, [index])

  const pick = (i) => setIndex(i)
  const reset = () => setResetKey((k) => k + 1)

  return (
    <section className="lab" id="lab" style={{ '--flower': flower.colors.primary }}>
      <header className="lab__head" data-reveal>
        <div>
          <p className="eyebrow">The specimen lab</p>
          <h2 className="lab__title">Take one apart.</h2>
        </div>
        <p className="lab__lede">
          Bloom Atlas grows its flowers, it does not model them. Pick a specimen, turn it in your hands, and
          pull it open part by part to see how a petal, a seed head or a stamen is actually built.
        </p>
      </header>

      <div className="lab__picker" data-reveal>
        {flowers.map((f, i) => (
          <button
            key={f.id}
            type="button"
            className={`lab__chip${i === index ? ' is-active' : ''}`}
            style={{ '--flower': f.colors.primary }}
            onClick={() => pick(i)}
          >
            <Specimen flower={f} size={34} />
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      <div className="lab__body">
        <div className="lab__viewer" ref={viewRef} data-reveal>
          {seen && (
            <LabScene
              flower={flower}
              explode={explode}
              bloom={bloom}
              active={active}
              showLabels={labels}
              spin={spin}
              onPart={setActive}
              resetKey={resetKey}
              frameloop={inView ? 'always' : 'never'}
            />
          )}
          <span className="lab__plate">
            Plate {pad(index + 1)} <em>/ {pad(flowers.length)}</em>
          </span>
          <span className="lab__hint">Drag to turn · Scroll to zoom · Right-drag to pan</span>
        </div>

        <aside className="lab__panel" data-reveal>
          <div className="lab__controls">
            <label className="lab__slider">
              <span>Explode</span>
              <input type="range" min="0" max="1" step="0.01" value={explode} onChange={(e) => setExplode(Number(e.target.value))} />
              <b>{Math.round(explode * 100)}</b>
            </label>
            <label className="lab__slider">
              <span>Bloom</span>
              <input type="range" min="0" max="1" step="0.01" value={bloom} onChange={(e) => setBloom(Number(e.target.value))} />
              <b>{Math.round(bloom * 100)}</b>
            </label>
            <div className="lab__toggles">
              <button type="button" className={`lab__toggle${spin ? ' is-on' : ''}`} onClick={() => setSpin((v) => !v)}>
                Spin
              </button>
              <button type="button" className={`lab__toggle${labels ? ' is-on' : ''}`} onClick={() => setLabels((v) => !v)}>
                Labels
              </button>
              <button type="button" className="lab__toggle" onClick={reset}>
                Reset view
              </button>
            </div>
          </div>

          <div className="lab__record">
            <p className="lab__no">
              No. {pad(index + 1)} <span>·</span> {record.form}
            </p>
            <h3 className="lab__name">{flower.name}</h3>
            <p className="lab__latin">{flower.latin}</p>
            <p className="lab__meaning">{flower.meaning}</p>
            <p className="lab__structure">{record.structure}</p>
          </div>

          <ol className="lab__parts">
            {parts.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`lab__part${active === p.id ? ' is-active' : ''}`}
                  onClick={() => setActive(active === p.id ? null : p.id)}
                >
                  <span className="lab__part-dot" />
                  <span className="lab__part-label">{p.label}</span>
                </button>
              </li>
            ))}
          </ol>

          <p className="lab__part-text">
            {activePart ? activePart.detail : 'Tap a part on the model, or in this list, to read what it does.'}
          </p>

          <dl className="lab__facts">
            <div>
              <dt>Origin</dt>
              <dd>{record.origin}</dd>
            </div>
            <div>
              <dt>Season</dt>
              <dd>{record.season}</dd>
            </div>
            <div>
              <dt>Habitat</dt>
              <dd>{record.habitat}</dd>
            </div>
            <div>
              <dt>Petals</dt>
              <dd>{record.petals}</dd>
            </div>
          </dl>

          <p className="lab__ask">{record.question}</p>
          <p className="lab__trait">{record.trait}</p>
          <p className="lab__practice">
            <b>Try this</b>
            {record.practice}
          </p>
        </aside>
      </div>
    </section>
  )
}
