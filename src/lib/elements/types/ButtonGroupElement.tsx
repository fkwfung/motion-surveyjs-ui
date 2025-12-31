import type { ChoiceItem, Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

export function ButtonGroupElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { visibleChoices?: ChoiceItem[] }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const choices = q.visibleChoices ?? []
  const currentStr = question.value == null ? '' : String(question.value)
  const bgLayoutId = `msj-btnGroup-bg-${question.id}`

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <div className="msj__buttonGroup">
        {choices.map((c) => {
          const valueStr = String(c.value)
          const selected = currentStr === valueStr
          return (
            <motion.button
              key={valueStr}
              type="button"
              className={selected ? 'msj__buttonGroupItem msj__buttonGroupItem--active' : 'msj__buttonGroupItem'}
              onClick={() => setQuestionValue(question, c.value)}
              layout
              transition={{ duration: opts.duration }}
            >
              {selected ? (
                <motion.span
                  className="msj__buttonGroupItemBg"
                  layoutId={bgLayoutId}
                  transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                />
              ) : null}
              <span className="msj__buttonGroupItemContent">{c.text ?? valueStr}</span>
            </motion.button>
          )
        })}
      </div>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
