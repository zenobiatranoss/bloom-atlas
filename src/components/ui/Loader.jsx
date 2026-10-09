import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoaded } from '../../store/slices/uiSlice'

export default function Loader() {
  const dispatch = useDispatch()
  const loaded = useSelector((s) => s.ui.loaded)

  useEffect(() => {
    const id = setTimeout(() => dispatch(setLoaded(true)), 3200)
    return () => clearTimeout(id)
  }, [dispatch])

  return (
    <div className={`loader${loaded ? ' is-done' : ''}`}>
      <span className="loader__mark">Bloom Atlas</span>
      <span className="loader__line" />
    </div>
  )
}
