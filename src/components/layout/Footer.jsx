import { scrollToTop } from '../../utils/scroll'

export default function Footer() {
  return (
    <footer className="colophon">
      <p className="colophon__brand">Bloom Atlas</p>
      <p className="colophon__note">
        Seven flowers built from geometry in code. No models, no textures. Every petal is a curve that was
        bent, rippled and tinted by hand.
      </p>
      <button type="button" className="btn-atlas" onClick={scrollToTop}>
        Back to the garden
      </button>
      <div className="dev-signature" style={{ position: "absolute", left: "2rem", bottom: "1.5rem", fontSize: "0.85rem", opacity: 0.7, letterSpacing: "1px", fontFamily: "inherit" }}>
    dev by zenobia
  </div>
</footer>
  )
}
