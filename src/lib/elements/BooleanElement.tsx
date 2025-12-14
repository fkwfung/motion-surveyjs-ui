import type { Question } from 'survey-core'
import * as Checkbox from '@radix-ui/react-checkbox'
import { motion } from 'motion/react'
import { BaseElement } from '../ui/BaseElement'
import { getQuestionTitle } from './getQuestionTitle'
import { Checkmark } from '../ui/Checkmark'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function BooleanElement({
  question,
  opts,
}: {
  question: Question
  opts: RenderOptions
}) {
  const q = question
  const title = getQuestionTitle(q, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []

  return (
    <BaseElement element={q} opts={opts}>
      <label className="msj__choice">
        <Checkbox.Root
          className="msj__checkbox"
          checked={Boolean(q.value)}
          onCheckedChange={(v) => setQuestionValue(q, v === true)}
        >
          <Checkbox.Indicator forceMount asChild>
            <motion.span
              className="msj__checkboxIndicator"
              initial={false}
              animate={
                q.value
                  ? { opacity: 1, scale: [0.9, 1.1, 1] }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: Math.max(0.18, opts.duration * 0.7) }}
            >
              <Checkmark active={Boolean(q.value)} duration={Math.max(0.22, opts.duration * 1.2)} />
            </motion.span>
          </Checkbox.Indicator>
        </Checkbox.Root>
        <span className="msj__labelInline">
          {title}
          {q.isRequired ? <span aria-hidden> *</span> : null}
        </span>
      </label>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
