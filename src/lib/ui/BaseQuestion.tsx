import { motion } from 'motion/react'
import type { RenderOptions } from './types'

export function BaseQuestion({
  opts,
  children,
}: {
  opts: RenderOptions
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="msj__question"
      initial={opts.animate ? { opacity: 0, y: 12 } : false}
      whileInView={opts.animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ amount: 0.25, once: true }}
      transition={{ duration: opts.duration }}
    >
      <div className="msj__questionInner">{children}</div>
    </motion.div>
  )
}
