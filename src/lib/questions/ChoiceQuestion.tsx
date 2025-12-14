import type { ChoiceItem, Question } from 'survey-core'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'motion/react'
import { BaseQuestion } from '../ui/BaseQuestion'
import { Checkmark } from '../ui/Checkmark'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function ChoiceQuestion({
  question,
  isMulti,
  opts,
}: {
  question: Question
  isMulti: boolean
  opts: RenderOptions
}) {
  const q = question
  const title = q.title || q.name
  const errors = getQuestionErrors(q)
  const choices =
    (q as unknown as { visibleChoices?: ChoiceItem[] }).visibleChoices ?? []

  if (!isMulti) {
    const currentStr = q.value == null ? '' : String(q.value)

    return (
      <BaseQuestion opts={opts}>
        <div className="msj__label">
          {title}
          {q.isRequired ? <span aria-hidden> *</span> : null}
        </div>
        <RadioGroup.Root
          className="msj__choiceList"
          value={currentStr}
          onValueChange={(v) => {
            const found = choices.find((c) => String(c.value) === v)
            setQuestionValue(q, found ? found.value : undefined)
          }}
        >
          {choices.map((c) => {
            const valueStr = String(c.value)
            const text = c.text ?? valueStr
            const selected = currentStr === valueStr
            const bgLayoutId = `msj-radio-bg-${q.id}`

            return (
              <RadioGroup.Item key={valueStr} value={valueStr} asChild>
                <motion.button
                  type="button"
                  className="msj__choiceOption"
                  layout
                  transition={{ duration: opts.duration }}
                >
                  {selected ? (
                    <motion.span
                      className="msj__choiceOptionBg"
                      layoutId={bgLayoutId}
                      transition={{ type: 'spring', stiffness: 700, damping: 40 }}
                    />
                  ) : null}
                  <span className="msj__choiceOptionContent">
                    <span className="msj__radioItem">
                      <RadioGroup.Indicator forceMount asChild>
                        <motion.span
                          className="msj__radioIndicator"
                          initial={false}
                          animate={selected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                          transition={
                            selected
                              ? { type: 'spring', stiffness: 900, damping: 45 }
                              : { duration: Math.max(0.12, opts.duration * 0.4) }
                          }
                        />
                      </RadioGroup.Indicator>

                      {selected ? (
                        <motion.span
                          key={`${valueStr}-pulse`}
                          className="msj__radioPulse"
                          initial={{ scale: 0.8, opacity: 0.28 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: Math.max(0.22, opts.duration * 1.4) }}
                        />
                      ) : null}
                    </span>
                    <span>{text}</span>
                  </span>
                </motion.button>
              </RadioGroup.Item>
            )
          })}
        </RadioGroup.Root>
        <Errors errors={errors} opts={opts} />
      </BaseQuestion>
    )
  }

  const set = new Set(Array.isArray(q.value) ? q.value : [])

  return (
    <BaseQuestion opts={opts}>
      <div className="msj__label">
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </div>
      <div className="msj__choiceList">
        {choices.map((c) => {
          const value = c.value
          const valueStr = String(value)
          const text = c.text ?? valueStr
          const checked = set.has(value)

          return (
            <label
              key={valueStr}
              className="msj__choiceOption"
              data-state={checked ? 'checked' : 'unchecked'}
            >
              <motion.span
                className="msj__choiceOptionBg"
                aria-hidden
                animate={{ opacity: checked ? 1 : 0 }}
                transition={{ duration: opts.duration }}
              />

              <span className="msj__choiceOptionContent">
                <Checkbox.Root
                  className="msj__checkbox"
                  checked={checked}
                  onCheckedChange={(v) => {
                    const next = new Set(Array.isArray(q.value) ? q.value : [])
                    if (v === true) next.add(value)
                    else next.delete(value)
                    setQuestionValue(q, Array.from(next))
                  }}
                >
                  <Checkbox.Indicator forceMount asChild>
                    <motion.span
                      className="msj__checkboxIndicator"
                      initial={false}
                      animate={checked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: Math.max(0.12, opts.duration * 0.5) }}
                    >
                      <Checkmark active={checked} duration={Math.max(0.22, opts.duration * 1.2)} />
                    </motion.span>
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span>{text}</span>
              </span>
            </label>
          )
        })}
      </div>
      <Errors errors={errors} opts={opts} />
    </BaseQuestion>
  )
}
