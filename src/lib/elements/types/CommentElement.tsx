import { useState } from 'react'
import type { Question } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import { Errors } from '../../ui/Errors'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'
import { getQuestionErrors } from '../getQuestionErrors'
import { setQuestionValue } from '../setQuestionValue'

export function CommentElement({
  question,
  opts,
}: {
  question: Question
  opts: RenderOptions
}) {
  const q = question
  const title = getQuestionTitle(q, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []
  const [focused, setFocused] = useState(false)

  const raw = String(q.value ?? '')

  const maxWords =
    (q as unknown as { maxWordCount?: number }).maxWordCount ??
    (q as unknown as { maxWords?: number }).maxWords ??
    200

  const words = raw.trim() ? raw.trim().split(/\s+/).filter(Boolean) : []
  const wordCount = words.length
  const nearLimit = wordCount >= maxWords * 0.9

  return (
    <BaseElement element={q} opts={opts}>
      <Label.Root className="msj__label" htmlFor={q.id}>
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </Label.Root>
      <motion.div
        className="msj__textareaWrap"
        initial={false}
        animate={focused ? { scale: 1.005 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <textarea
          id={q.id}
          className="msj__textarea"
          value={raw}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
        <motion.div
          className="msj__counter"
          initial={false}
          animate={nearLimit ? { scale: 1.05, color: '#dc2626' } : { scale: 1, color: '#64748b' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {opts.t('wordCount', { count: wordCount, max: maxWords })}
        </motion.div>
      </motion.div>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
