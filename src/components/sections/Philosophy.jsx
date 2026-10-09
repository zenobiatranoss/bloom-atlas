import { useDispatch } from 'react-redux'
import { flowers } from '../../data/flowers'
import { notes } from '../../data/notes'
import { selectFlower } from '../../store/slices/flowersSlice'
import { scrollToTop } from '../../utils/scroll'

export default function Philosophy() {
  const dispatch = useDispatch()

  const open = (id) => {
    dispatch(selectFlower(id))
    scrollToTop()
  }

  return (
    <section className="questions" id="questions">
      <div className="questions__intro" data-reveal>
        <p className="eyebrow">Seven questions</p>
        <h2 className="questions__title">A garden is an argument about how to live.</h2>
        <p className="questions__lede">
          Each of these flowers has been carried by some culture as an answer to something people keep
          asking. Pick a question and the flower that answers it will open.
        </p>
      </div>

      <ol className="questions__list">
        {flowers.map((f, i) => (
          <li key={f.id} data-reveal style={{ '--i': i % 3, '--flower': f.colors.primary }}>
            <button type="button" className="question" data-cursor="Open" onClick={() => open(f.id)}>
              <span className="question__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="question__text">{notes[f.id].question}</span>
              <span className="question__answer">
                <b>{f.name}</b>
                <span>{f.meaning}</span>
              </span>
              <span className="question__arrow">→</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
