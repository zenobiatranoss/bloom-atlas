import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Specimen from '../ui/Specimen'
import { flowers } from '../../data/flowers'
import { notes, forms } from '../../data/notes'
import {
  nextFlower,
  prevFlower,
  toggleFavorite,
  selectSelectedFlower,
  selectFavorites
} from '../../store/slices/flowersSlice'
import { scrollToTop } from '../../utils/scroll'

const pad = (n) => String(n).padStart(2, '0')

export default function Detail() {
  const dispatch = useDispatch()
  const flower = useSelector(selectSelectedFlower)
  const favorites = useSelector(selectFavorites)
  const note = notes[flower.id]
  const index = flowers.findIndex((f) => f.id === flower.id)
  const pressed = favorites.includes(flower.id)

  const facts = [
    ['Season', note.season],
    ['Habitat', note.habitat],
    ['Native to', flower.origin],
    ['Petals', flower.cluster ? `${flower.petals} per floret` : flower.petals],
    ['Form', forms[flower.petalShape]],
    ['Plate', `${pad(index + 1)} of ${pad(flowers.length)}`]
  ]

  const swatches = [
    ['Petal', flower.colors.primary],
    ['Light', flower.colors.secondary],
    ['Glow', flower.colors.glow],
    ['Heart', flower.colors.core]
  ]

  return (
    <section className="notes" id="notes" style={{ '--flower': flower.colors.primary }}>
      <header className="notes__head" data-reveal>
        <p className="eyebrow">Field notes</p>
        <h2 className="notes__title">{flower.name}</h2>
      </header>

      <div className="notes__grid" data-reveal>
        <motion.figure
          key={`fig-${flower.id}`}
          className="notes__figure"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Specimen flower={flower} spin />
          <figcaption className="notes__caption">
            Fig. {index + 1}. {flower.name}, seen from above. Drawn from the same petal count and form as the
            model in the garden.
          </figcaption>
        </motion.figure>

        <motion.div
          key={`body-${flower.id}`}
          className="notes__body"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <dl className="notes__facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <p className="notes__ask">{note.question}</p>
          <p className="notes__text">{flower.philosophy}</p>
          <p className="notes__trait">{note.trait}</p>

          <div className="notes__practice">
            <h3>Try this</h3>
            <p>{note.practice}</p>
          </div>

          <ul className="notes__swatches">
            {swatches.map(([label, hex]) => (
              <li key={label} className="swatch" style={{ '--c': hex }}>
                <span className="swatch__chip" />
                <span>{label}</span>
                <span>{hex}</span>
              </li>
            ))}
          </ul>

          <div className="notes__actions">
            <button type="button" className="btn-atlas" onClick={scrollToTop}>
              See it bloom
            </button>
            <button type="button" className="btn-atlas" onClick={() => dispatch(toggleFavorite(flower.id))}>
              {pressed ? 'Pressed' : 'Press this flower'}
            </button>
            <button type="button" className="btn-atlas" onClick={() => dispatch(prevFlower())}>
              ← Previous
            </button>
            <button type="button" className="btn-atlas" onClick={() => dispatch(nextFlower())}>
              Next →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
