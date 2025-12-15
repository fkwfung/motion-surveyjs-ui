import type { ItemValue, Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

function Star({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  )
}

function Smiley({ idx }: { idx: number }) {
  const labels = ['Bad', 'Poor', 'Okay', 'Good', 'Great']
  const faces = ['😡', '🙁', '😐', '🙂', '😄']
  return (
    <span aria-label={labels[Math.min(4, Math.max(0, idx))]}>{faces[Math.min(4, Math.max(0, idx))]}</span>
  )
}

export function RatingElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as {
    visibleRateValues?: ItemValue[]
    rateType?: 'labels' | 'stars' | 'smileys'
    value?: unknown
    isRequired?: boolean
  }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const values = q.visibleRateValues ?? []
  const current = question.value == null ? '' : String(question.value)
  const bgLayoutId = `msj-rating-bg-${question.id}`
  const rateType = q.rateType ?? 'labels'

  const selectedIdx = values.findIndex((iv) => String(iv.value) === current)

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>
      <div className="msj__rating" data-type={rateType}>
        {values.map((iv, idx) => {
          const valueStr = String(iv.value)
          const text = iv.text ?? valueStr
          const selected = current === valueStr
          const highlighted = rateType === 'stars' && selectedIdx >= 0 ? idx <= selectedIdx : selected

          return (
            <motion.button
              key={valueStr}
              type="button"
              className="msj__ratingItem"
              onClick={() => setQuestionValue(question, iv.value)}
              layout
              transition={{ duration: opts.duration }}
              aria-label={text}
            >
              {selected ? (
                <motion.span
                  className="msj__ratingItemBg"
                  layoutId={bgLayoutId}
                  transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                />
              ) : null}

              <span className="msj__ratingItemContent">
                {rateType === 'stars' ? <Star active={highlighted} /> : null}
                {rateType === 'smileys' ? <Smiley idx={idx} /> : null}
                {rateType === 'labels' ? text : null}
              </span>
            </motion.button>
          )
        })}
      </div>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
