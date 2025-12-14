import type { Question } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import { BaseQuestion } from '../ui/BaseQuestion'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function TextQuestion({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question
  const title = q.title || q.name
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []

  return (
    <BaseQuestion question={q} opts={opts}>
      <Label.Root className="msj__label" htmlFor={q.id}>
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </Label.Root>
      <input
        id={q.id}
        className="msj__input"
        value={(q.value ?? '') as string}
        onChange={(e) => setQuestionValue(q, e.currentTarget.value)}
      />
      <Errors errors={errors} opts={opts} />
    </BaseQuestion>
  )
}
