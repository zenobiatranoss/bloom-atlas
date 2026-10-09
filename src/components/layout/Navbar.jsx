import ThemeSwitcher from '../ui/ThemeSwitcher'
import { scrollToId, scrollToTop } from '../../utils/scroll'

const links = [
  { id: 'garden', label: 'Garden' },
  { id: 'questions', label: 'Questions' },
  { id: 'herbarium', label: 'Herbarium' },
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
      <ThemeSwitcher />
    </nav>
  )
}
