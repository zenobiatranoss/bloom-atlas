import { useDispatch, useSelector } from 'react-redux'
import { setTheme, themes } from '../../store/slices/themeSlice'

export default function ThemeSwitcher() {
  const dispatch = useDispatch()
  const current = useSelector((s) => s.theme.current)

  return (
    <div className="theme-switcher">
      {themes.map((t) => (
        <button
          key={t}
          type="button"
          aria-label={t}
          className={`theme-dot theme-dot--${t}${current === t ? ' is-active' : ''}`}
          onClick={() => dispatch(setTheme(t))}
        />
      ))}
    </div>
  )
}
