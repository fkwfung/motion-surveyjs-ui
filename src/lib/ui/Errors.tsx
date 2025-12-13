import { AnimatePresence, motion } from 'motion/react'
import type { RenderOptions } from './types'

export function Errors({ errors, opts }: { errors: string[]; opts: RenderOptions }) {
  if (errors.length === 0) return null

  return (
    <AnimatePresence initial={false}>
      {errors.map((t) => (
        <motion.div
          key={t}
          className="msj__error"
          layout
          initial={opts.animate ? { opacity: 0, y: -2 } : false}
          animate={opts.animate ? { opacity: 1, y: 0 } : undefined}
          exit={opts.animate ? { opacity: 0, y: -2 } : undefined}
          transition={{ duration: opts.duration * 0.75 }}
        >
          {t}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
