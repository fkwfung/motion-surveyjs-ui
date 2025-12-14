import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { RenderOptions } from './types'

export function BaseQuestion({
  opts,
  children,
}: {
  opts: RenderOptions
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.25, once: true })

  return (
    <motion.div
      ref={ref}
      className="msj__question"
      initial={opts.animate ? { opacity: 0, y: 12 } : false}
      animate={
        opts.animate
          ? inView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 12 }
          : undefined
      }
      transition={{ duration: opts.duration }}
    >
      <div className="msj__questionInner">{children}</div>
    </motion.div>
  )
}
