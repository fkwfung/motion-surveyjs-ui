import { useEffect } from 'react'
import type { Question } from 'survey-core'
import { motion, useAnimationControls } from 'motion/react'
import type { RenderOptions } from './types'

export function BaseQuestion({
  question,
  opts,
  children,
}: {
  question: Question
  opts: RenderOptions
  children: React.ReactNode
}) {
  const invalid =
    opts.validationSeq > 0 && typeof question.hasErrors === 'function' ? question.hasErrors() : false
  const controls = useAnimationControls()

  useEffect(() => {
    if (!opts.animate) return
    if (!invalid) return

    controls.start({
      x: [0, -6, 6, -4, 0],
      transition: { duration: 0.32, ease: 'easeInOut' },
    })
  }, [controls, invalid, opts.animate, opts.validationSeq])

  return (
    <motion.div
      className={invalid ? 'msj__question msj__question--invalid' : 'msj__question'}
      data-msj-question={question.name}
      initial={opts.animate ? { opacity: 0, y: 12 } : false}
      whileInView={opts.animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ amount: 0.25, once: true }}
      transition={{ duration: opts.duration }}
    >
      <motion.div className="msj__questionInner" animate={controls}>
        {children}
      </motion.div>
    </motion.div>
  )
}
