import ThemeSwitcher from '../ui/ThemeSwitcher'
import SoundToggle from '../ui/SoundToggle'
import { scrollToId, scrollToTop } from '../../utils/scroll'

const links = [
  { id: 'garden', label: 'Garden' },
  { id: 'questions', label: 'Questions' },
  { id: 'herbarium', label: 'Herbarium' },
  { id: 'lab', label: 'Specimen lab' },
  { id: 'notes', label: 'Field notes' }
]

const go = (id) => (id === 'garden' ? scrollToTop() : scrollToId(id))

export default function Navbar() {
  return (
    <nav className="atlas-nav">
      <button type="button" className="atlas-nav__brand" onClick={scrollToTop}>
        Bloom Atlas
      </button>
      <ul className="atlas-nav__links">
        {links.map((l) => (
          <li key={l.id}>
            <button type="button" className="atlas-nav__link" data-target={l.id} onClick={() => go(l.id)}>
              {l.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="atlas-nav__tools">
        <SoundToggle />
        <ThemeSwitcher />
      </div>
    </nav>
  )
}
