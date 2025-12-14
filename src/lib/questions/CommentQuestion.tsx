import type { Question } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import { BaseQuestion } from '../ui/BaseQuestion'
import { getQuestionTitle } from './getQuestionTitle'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function CommentQuestion({
  question,
  opts,
}: {
  question: Question
  opts: RenderOptions
}) {
  const q = question
  const title = getQuestionTitle(q, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []

  const raw = String(q.value ?? '')

  const maxWords =
    (q as unknown as { maxWordCount?: number }).maxWordCount ??
    (q as unknown as { maxWords?: number }).maxWords ??
    200

  const words = raw.trim() ? raw.trim().split(/\s+/).filter(Boolean) : []
  const wordCount = words.length

  return (
    <BaseQuestion question={q} opts={opts}>
      <Label.Root className="msj__label" htmlFor={q.id}>
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </Label.Root>
      <div className="msj__textareaWrap">
        <textarea
          id={q.id}
          className="msj__textarea"
          value={raw}
          onChange={(e) => {
            const nextRaw = e.currentTarget.value
            const nextWords = nextRaw.trim()
              ? nextRaw.trim().split(/\s+/).filter(Boolean)
              : []
            if (nextWords.length <= maxWords) {
              setQuestionValue(q, nextRaw)
              return
            }
            setQuestionValue(q, `${nextWords.slice(0, maxWords).join(' ')} `)
          }}
        />
        <div className="msj__counter">
          {opts.t('wordCount', { count: wordCount, max: maxWords })}
        </div>
      </div>
      <Errors errors={errors} opts={opts} />
    </BaseQuestion>
  )
}
