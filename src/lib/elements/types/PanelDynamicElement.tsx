import type { ReactNode } from 'react'
import type { IElement, Question } from 'survey-core'
import { AnimatePresence, motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'

export function PanelDynamicElement({
  question,
  opts,
  render,
}: {
  question: Question
  opts: RenderOptions
  render: (el: IElement, opts: RenderOptions) => ReactNode
}) {
  const q = question as unknown as {
    panels?: IElement[]
    addPanel?: () => void
    removePanel?: (p: IElement) => void
    panelCount?: number
  }

  const title = getQuestionTitle(question, opts)
  const panels = q.panels ?? []

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">{title}</div>

      <div className="msj__panelDynamic">
        <AnimatePresence mode="popLayout">
          {panels.map((p, idx) => (
            <motion.div
              key={(p as unknown as { name?: string }).name ?? idx}
              className="msj__panelDynamicItem"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            >
              <div className="msj__panelDynamicHeader">
                <div className="msj__panelDynamicTitle">Item {idx + 1}</div>
                {q.removePanel ? (
                  <motion.button
                    type="button"
                    className="msj__miniButton"
                    onClick={() => q.removePanel?.(p)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove
                  </motion.button>
                ) : null}
              </div>
              {render(p as unknown as IElement, opts)}
            </motion.div>
          ))}
        </AnimatePresence>

        {q.addPanel ? (
          <motion.button
            type="button"
            className="msj__button"
            onClick={() => q.addPanel?.()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            Add item
          </motion.button>
        ) : null}
      </div>
    </BaseElement>
  )
}
