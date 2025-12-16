import { useEffect } from 'react'
import { Question, type IElement } from 'survey-core'
import { motion, useAnimationControls } from 'motion/react'
import type { RenderOptions } from './types'

export function BaseElement({
  element,
  opts,
  children,
}: {
  element: IElement
  opts: RenderOptions
  children: React.ReactNode
}) {
  const isQuestion = element instanceof Question
  const question = isQuestion ? (element as Question) : null

  const invalid =
    opts.validationSeq > 0 && question && typeof question.hasErrors === 'function'
      ? question.hasErrors()
      : false

  const controls = useAnimationControls()

  useEffect(() => {
    if (!opts.animate) return
    if (!invalid) return

    controls.start({
      x: [0, -6, 6, -4, 0],
      transition: { duration: 0.32, ease: 'easeInOut' },
    })
  }, [controls, invalid, opts.animate, opts.validationSeq])

  const elementName = (element as unknown as { name?: string }).name

  return (
    <motion.div
      className={invalid ? 'msj__question msj__question--invalid' : 'msj__question'}
      data-msj-element={elementName}
      data-msj-question={question?.name}
      initial={opts.animate ? { opacity: 0.85, y: 12 } : false}
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
