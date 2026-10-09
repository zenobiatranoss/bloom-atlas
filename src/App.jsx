import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import Scene from './components/three/Scene'
import Loader from './components/ui/Loader'
import RevealText from './components/ui/RevealText'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Philosophy from './components/sections/Philosophy'
import Gallery from './components/sections/Gallery'
import Detail from './components/sections/Detail'
import useScrollProgress from './hooks/useScrollProgress'
import useReveal from './hooks/useReveal'
import { flowers } from './data/flowers'
import { forms } from './data/notes'
import { selectFlower, nextFlower, prevFlower, selectSelectedFlower } from './store/slices/flowersSlice'
import { scrollToId } from './utils/scroll'

export default function App() {
  const dispatch = useDispatch()
  const flower = useSelector(selectSelectedFlower)
  const theme = useSelector((s) => s.theme.current)
  const index = flowers.findIndex((f) => f.id === flower.id)

  useScrollProgress()
  useReveal()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target && e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') dispatch(nextFlower())
      if (e.key === 'ArrowLeft') dispatch(prevFlower())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dispatch])

  return (
    <>
      <div className="stage" style={{ '--flower': flower.colors.primary }}>
        <div className="stage__canvas">
          <Scene />
        </div>
        <div className="stage__scrim" />

        <Navbar />

        <div className="hero-ui">
          <main className="plate">
            <AnimatePresence mode="wait">
              <motion.section
                key={flower.id}
                className="plate__body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <p className="plate__no">
                  Plate {String(index + 1).padStart(2, '0')}
                  <span>/ {String(flowers.length).padStart(2, '0')}</span>
                </p>
                <h1 className="plate__name">
                  <RevealText text={flower.name} />
                </h1>
                <p className="plate__latin">{flower.latin}</p>
                <h2 className="plate__meaning">{flower.meaning}</h2>
                <p className="plate__text">{flower.philosophy}</p>
                <blockquote className="plate__quote">{flower.quote}</blockquote>
              </motion.section>
            </AnimatePresence>
          </main>

          <motion.dl
            key={flower.id}
            className="facts"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <dt>Origin</dt>
              <dd>{flower.origin}</dd>
            </div>
            <div>
              <dt>Petals</dt>
              <dd>{flower.cluster ? `${flower.petals} per floret` : flower.petals}</dd>
            </div>
            <div>
              <dt>Form</dt>
              <dd>{forms[flower.petalShape]}</dd>
            </div>
          </motion.dl>

          <button type="button" className="cue" onClick={() => scrollToId('questions')}>
            Scroll
          </button>

          <footer className="index">
            <ol className="index__list">
              {flowers.map((f, i) => (
                <li key={f.id}>
                  <button
                    type="button"
                    className={`index__item${f.id === flower.id ? ' is-active' : ''}`}
                    onClick={() => dispatch(selectFlower(f.id))}
                  >
                    <span className="index__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="index__name">{f.name}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="pager">
              <button type="button" aria-label="Previous flower" onClick={() => dispatch(prevFlower())}>
                ←
              </button>
              <button type="button" aria-label="Next flower" onClick={() => dispatch(nextFlower())}>
                →
              </button>
            </div>
          </footer>
        </div>

        <Loader />
      </div>

      <div className="chapters">
        <Philosophy />
        <Gallery />
        <Detail />
        <Footer />
      </div>

    </>
  )
}
