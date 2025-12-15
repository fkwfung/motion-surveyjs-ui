import type { ChoiceItem, Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

type ChoiceWithImage = ChoiceItem & { imageLink?: string }

export function ImagePickerElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { visibleChoices?: ChoiceWithImage[]; multiSelect?: boolean }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const choices = q.visibleChoices ?? []
  const isMulti = Boolean(q.multiSelect)

  const selectedSet = new Set(
    isMulti ? (Array.isArray(question.value) ? (question.value as unknown[]) : []) : [question.value]
  )

  const hoverBg = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
  }

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <div className="msj__imagePicker">
        {choices.map((c) => {
          const valueStr = String(c.value)
          const selected = selectedSet.has(c.value)
          const bgLayoutId = `msj-imagePicker-bg-${question.id}`

          return (
            <motion.button
              key={valueStr}
              type="button"
              className={selected ? 'msj__imagePickerItem msj__imagePickerItem--active' : 'msj__imagePickerItem'}
              onClick={() => {
                if (!isMulti) {
                  setQuestionValue(question, c.value)
                  return
                }
                const next = new Set(Array.isArray(question.value) ? (question.value as unknown[]) : [])
                if (next.has(c.value)) next.delete(c.value)
                else next.add(c.value)
                setQuestionValue(question, Array.from(next))
              }}
              layout
              initial="rest"
              whileHover={selected ? undefined : 'hover'}
              transition={{ duration: opts.duration }}
            >
              {!selected ? (
                <motion.span
                  className="msj__imagePickerHoverBg"
                  variants={hoverBg}
                  transition={{ type: 'spring', stiffness: 700, damping: 45 }}
                />
              ) : null}
              {selected ? (
                <motion.span
                  className="msj__imagePickerItemBg"
                  layoutId={bgLayoutId}
                  transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                />
              ) : null}
              {c.imageLink ? <img className="msj__imagePickerImg" src={c.imageLink} alt={c.text ?? valueStr} /> : null}
              {c.text ? <span className="msj__imagePickerLabel">{c.text}</span> : null}
            </motion.button>
          )
        })}
      </div>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
