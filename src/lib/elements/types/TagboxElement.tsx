import type { ChoiceItem, Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

export function TagboxElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { visibleChoices?: ChoiceItem[] }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const choices = q.visibleChoices ?? []
  const set = new Set(Array.isArray(question.value) ? (question.value as unknown[]) : [])

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <div className="msj__tagbox">
        {choices.map((c) => {
          const value = c.value
          const valueStr = String(value)
          const selected = set.has(value)
          return (
            <button
              key={valueStr}
              type="button"
              className={selected ? 'msj__tag msj__tag--active' : 'msj__tag'}
              onClick={() => {
                const next = new Set(Array.isArray(question.value) ? (question.value as unknown[]) : [])
                if (next.has(value)) next.delete(value)
                else next.add(value)
                setQuestionValue(question, Array.from(next))
              }}
            >
              {c.text ?? valueStr}
            </button>
          )
        })}
      </div>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
