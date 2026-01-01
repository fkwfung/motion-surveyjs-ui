import { useState } from 'react'
import type { Question } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import { Errors } from '../../ui/Errors'
import type { RenderOptions } from '../../ui/types'
import { QuestionTitle } from '../../ui/QuestionTitle'
import { getQuestionErrors } from '../getQuestionErrors'
import { setQuestionValue } from '../setQuestionValue'

export function TextElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []
  const [focused, setFocused] = useState(false)

  return (
    <BaseElement element={q} opts={opts}>
      <Label.Root className="msj__label" htmlFor={q.id}>
        <QuestionTitle element={q} opts={opts} />
      </Label.Root>
      <motion.div
        className="msj__inputWrap"
        initial={false}
        animate={focused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <input
          id={q.id}
          className="msj__input"
          value={(q.value ?? '') as string}
          onChange={(e) => setQuestionValue(q, e.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </motion.div>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
