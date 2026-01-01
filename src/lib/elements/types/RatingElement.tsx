import type { Question, QuestionRatingModel } from 'survey-core'
import { motion } from 'motion/react'
import { Star, Frown, Meh, Smile, Laugh, Angry } from 'lucide-react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { QuestionTitle } from '../../ui/QuestionTitle'
import { getQuestionErrors } from '../getQuestionErrors'
import { setQuestionValue } from '../setQuestionValue'

function StarIcon({ active }: { active: boolean }) {
  return <Star size={24} fill={active ? 'currentColor' : 'none'} strokeWidth={2} />
}

function SmileyIcon({ idx, total }: { idx: number; total: number }) {
  const normalized = total > 1 ? idx / (total - 1) : 0.5
  
  if (normalized < 0.2) return <Angry size={24} />
  if (normalized < 0.4) return <Frown size={24} />
  if (normalized < 0.6) return <Meh size={24} />
  if (normalized < 0.8) return <Smile size={24} />
  return <Laugh size={24} />
}

export function RatingElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as QuestionRatingModel
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const values = q.visibleRateValues ?? []
  const current = question.value == null ? '' : String(question.value)
  const bgLayoutId = `msj-rating-bg-${question.id}`
  const rateType = q.rateType ?? 'labels'
  const scaleColorMode = q.scaleColorMode
  
  const minDescription = q.minRateDescription
  const maxDescription = q.maxRateDescription
  const displayAsExtreme = q.displayRateDescriptionsAsExtremeItems

  const selectedIdx = values.findIndex((iv) => String(iv.value) === current)

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        <QuestionTitle element={question} opts={opts} />
      </div>
      <div className="msj__rating" data-type={rateType} data-color-mode={scaleColorMode}>
        {minDescription && !displayAsExtreme ? (
          <span className="msj__ratingDescription msj__ratingDescription--min">{minDescription}</span>
        ) : null}

        {values.map((iv, idx) => {
          const valueStr = String(iv.value)
          let text = iv.text ?? valueStr
          
          if (displayAsExtreme) {
            if (idx === 0 && minDescription) text = minDescription
            if (idx === values.length - 1 && maxDescription) text = maxDescription
          }

          const selected = current === valueStr
          const highlighted = rateType === 'stars' && selectedIdx >= 0 ? idx <= selectedIdx : selected
          
          let style: React.CSSProperties | undefined
          if (scaleColorMode === 'colored') {
             const hue = values.length > 1 ? (idx / (values.length - 1)) * 120 : 60
             style = { '--msj-rating-color': `hsl(${hue}, 70%, 50%)` } as React.CSSProperties
          }

          return (
            <motion.button
              key={valueStr}
              type="button"
              className="msj__ratingItem"
              onClick={() => setQuestionValue(question, iv.value)}
              layout
              transition={{ duration: opts.duration }}
              aria-label={text}
              style={style}
            >
              {selected ? (
                <motion.span
                  className="msj__ratingItemBg"
                  layoutId={bgLayoutId}
                  transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                />
              ) : null}

              <span className="msj__ratingItemContent">
                {rateType === 'stars' ? <StarIcon active={highlighted} /> : null}
                {rateType === 'smileys' ? <SmileyIcon idx={idx} total={values.length} /> : null}
                {rateType === 'labels' ? text : null}
              </span>
            </motion.button>
          )
        })}

        {maxDescription && !displayAsExtreme ? (
          <span className="msj__ratingDescription msj__ratingDescription--max">{maxDescription}</span>
        ) : null}
      </div>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
