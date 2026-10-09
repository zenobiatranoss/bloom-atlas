import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { sceneThemes } from '../utils/colors'

export default function useThemeRef() {
  const name = useSelector((s) => s.theme.current)
  const ref = useRef(sceneThemes[name])
  ref.current = sceneThemes[name]
  return ref
}
