import { useDispatch, useSelector } from 'react-redux'
import { setSound } from '../../store/slices/uiSlice'
import { startMusic, stopMusic } from '../../utils/audio'

export default function SoundToggle() {
  const dispatch = useDispatch()
  const on = useSelector((s) => s.ui.soundOn)

  const toggle = () => {
    if (on) stopMusic()
    else startMusic()
    dispatch(setSound(!on))
  }

  return (
    <button
      type="button"
      className={`sound-toggle${on ? ' is-on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Turn music off' : 'Turn music on'}
      onClick={toggle}
    >
      <span className="sound-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="sound-toggle__label">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
