import type { Question } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

type MultipleTextItem = { name: string; title?: string }

export function MultipleTextElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { items?: MultipleTextItem[]; value?: unknown }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const items = q.items ?? []
  const current = (question.value ?? {}) as Record<string, string>

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>
      <div className="msj__multipleText">
        {items.map((it, idx) => {
          const id = `${question.id}-${it.name}`
          return (
            <motion.div
              key={it.name}
              className="msj__multipleTextRow"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: opts.duration }}
            >
              <Label.Root className="msj__labelInline" htmlFor={id}>
                {it.title ?? it.name}
              </Label.Root>
              <input
                id={id}
                className="msj__input"
                value={current[it.name] ?? ''}
                onChange={(e) => {
                  setQuestionValue(question, { ...current, [it.name]: e.currentTarget.value })
                }}
              />
            </motion.div>
          )
        })}
      </div>
      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
