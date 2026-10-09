import { motion } from 'framer-motion'
import { hash, seeded } from '../../utils/math'

export default function RevealText({ text, delay = 0 }) {
  const rand = seeded(hash(text))

  return (
    <span className="reveal" aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span className="reveal__mask" key={i} aria-hidden="true">
          <motion.span
            className="reveal__char"
            initial={{ y: '115%', rotate: 4 + rand() * 4 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.045 + rand() * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
