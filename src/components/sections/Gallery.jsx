import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Specimen from '../ui/Specimen'
import { flowers } from '../../data/flowers'
import {
  selectFlower,
  setQuery,
  toggleFavorite,
  selectFilteredFlowers,
  selectFavorites
} from '../../store/slices/flowersSlice'
import { scrollToId } from '../../utils/scroll'

export default function Gallery() {
  const dispatch = useDispatch()
  const found = useSelector(selectFilteredFlowers)
  const favorites = useSelector(selectFavorites)
  const query = useSelector((s) => s.flowers.query)
  const [pressedOnly, setPressedOnly] = useState(false)

  const shown = pressedOnly ? found.filter((f) => favorites.includes(f.id)) : found

  const open = (id) => {
    dispatch(selectFlower(id))
    scrollToId('notes')
  }

  return (
    <section className="herbarium" id="herbarium">
      <header className="herbarium__head" data-reveal>
        <div>
          <p className="eyebrow">The herbarium</p>
          <h2 className="herbarium__title">Press what you want to keep.</h2>
        </div>
        <div className="herbarium__tools">
          <input
            className="finder"
            type="search"
            placeholder="Search by name, meaning or Latin"
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            aria-label="Search the herbarium"
          />
          <button
            type="button"
            className={`toggle${pressedOnly ? ' is-on' : ''}`}
            onClick={() => setPressedOnly((v) => !v)}
          >
            Pressed only ({favorites.length})
          </button>
        </div>
      </header>

      {shown.length === 0 ? (
        <p className="herbarium__empty">Nothing in the herbarium matches that.</p>
      ) : (
        <div className="herbarium__grid">
          {shown.map((f, i) => {
            const no = flowers.findIndex((x) => x.id === f.id) + 1
            const pressed = favorites.includes(f.id)
            return (
              <article key={f.id} className="plate-card" data-reveal style={{ '--i': i % 3, '--flower': f.colors.primary }}>
                <button type="button" className="plate-card__main" onClick={() => open(f.id)}>
                  <span className="plate-card__no">No. {String(no).padStart(2, '0')}</span>
                  <Specimen flower={f} />
                  <span className="plate-card__name">{f.name}</span>
                  <span className="plate-card__latin">{f.latin}</span>
                  <span className="plate-card__meaning">{f.meaning}</span>
                </button>
                <button
                  type="button"
                  className={`plate-card__press${pressed ? ' is-on' : ''}`}
                  onClick={() => dispatch(toggleFavorite(f.id))}
                >
                  {pressed ? 'Pressed' : 'Press'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
