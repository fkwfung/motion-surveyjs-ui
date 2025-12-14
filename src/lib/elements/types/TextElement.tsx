import type { Question } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import { BaseElement } from '../../ui/BaseElement'
import { Errors } from '../../ui/Errors'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'
import { getQuestionErrors } from '../getQuestionErrors'
import { setQuestionValue } from '../setQuestionValue'

export function TextElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question
  const title = getQuestionTitle(q, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []

  return (
    <BaseElement element={q} opts={opts}>
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
    </BaseElement>
  )
}
