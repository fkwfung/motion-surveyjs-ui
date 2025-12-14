import type { ItemValue, Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

export function RatingElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { visibleRateValues?: ItemValue[]; value?: unknown; isRequired?: boolean }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const values = q.visibleRateValues ?? []
  const current = question.value == null ? '' : String(question.value)
  const bgLayoutId = `msj-rating-bg-${question.id}`

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>
      <div className="msj__rating">
        {values.map((iv) => {
          const valueStr = String(iv.value)
          const text = iv.text ?? valueStr
          const selected = current === valueStr
          return (
            <motion.button
              key={valueStr}
              type="button"
              className="msj__ratingItem"
              onClick={() => setQuestionValue(question, iv.value)}
              layout
              transition={{ duration: opts.duration }}
            >
              {selected ? (
                <motion.span
                  className="msj__ratingItemBg"
                  layoutId={bgLayoutId}
                  transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                />
              ) : null}
              <span className="msj__ratingItemContent">{text}</span>
            </motion.button>
          )
        })}
      </div>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
