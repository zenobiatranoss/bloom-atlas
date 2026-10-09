import { useDispatch, useSelector } from 'react-redux'
import { setLoaded, setSound } from '../../store/slices/uiSlice'
import { startMusic } from '../../utils/audio'

export default function Loader() {
  const dispatch = useDispatch()
  const ready = useSelector((s) => s.ui.ready)
  const loaded = useSelector((s) => s.ui.loaded)

  const enter = () => {
    startMusic()
    dispatch(setSound(true))
    dispatch(setLoaded(true))
  }

  return (
    <div className={`loader${loaded ? ' is-done' : ''}`}>
      <span className="loader__mark">Bloom Atlas</span>
      {ready ? (
        <button type="button" className="loader__enter" onClick={enter}>
          Enter the garden
        </button>
      ) : (
        <span className="loader__line" />
      )}
      <span className={`loader__hint${ready ? ' is-on' : ''}`}>Best with sound</span>
    </div>
  )
}
