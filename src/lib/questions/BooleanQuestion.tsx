import type { Question } from 'survey-core'
import * as Checkbox from '@radix-ui/react-checkbox'
import { BaseQuestion } from '../ui/BaseQuestion'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function BooleanQuestion({
  question,
  opts,
}: {
  question: Question
  opts: RenderOptions
}) {
  const q = question
  const title = q.title || q.name
  const errors = getQuestionErrors(q)

  return (
    <BaseQuestion opts={opts}>
      <label className="msj__choice">
        <Checkbox.Root
          className="msj__checkbox"
          checked={Boolean(q.value)}
          onCheckedChange={(v) => setQuestionValue(q, v === true)}
        >
          <Checkbox.Indicator className="msj__checkboxIndicator">✓</Checkbox.Indicator>
        </Checkbox.Root>
        <span className="msj__labelInline">
          {title}
          {q.isRequired ? <span aria-hidden> *</span> : null}
        </span>
      </label>
      <Errors errors={errors} opts={opts} />
    </BaseQuestion>
  )
}
