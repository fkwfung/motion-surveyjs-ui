import type { Question } from 'survey-core'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Checkbox from '@radix-ui/react-checkbox'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { QuestionTitle } from '../../ui/QuestionTitle'
import { getQuestionErrors } from '../getQuestionErrors'
import { setQuestionValue } from '../setQuestionValue'
import { Checkmark } from '../../ui/Checkmark'
import { motion } from 'motion/react'

type MatrixRow = { value: unknown; text?: string }

type MatrixColumn = { value: unknown; text?: string }

export function MatrixElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as {
    visibleRows?: MatrixRow[]
    visibleColumns?: MatrixColumn[]
    cellType?: string
    isRequired?: boolean
  }

  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const rows = (q as unknown as { rows?: MatrixRow[] }).rows ?? q.visibleRows ?? []
  const cols = (q as unknown as { columns?: MatrixColumn[] }).columns ?? q.visibleColumns ?? []

  const valueObj = (question.value ?? {}) as Record<string, unknown>
  const isMulti = q.cellType === 'checkbox'

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        <QuestionTitle element={question} opts={opts} />
      </div>

      <div className="msj__matrix" style={{ ['--msj-matrix-cols' as never]: String(cols.length) } as never}>
        <div className="msj__matrixHeader" aria-hidden>
          <div className="msj__matrixHeaderCell msj__matrixCorner" />
          {cols.map((c) => {
            const colKey = String(c.value)
            return (
              <div key={colKey} className="msj__matrixHeaderCell">
                {c.text ?? colKey}
              </div>
            )
          })}
        </div>

        {rows.map((r) => {
          const rowKey = String(r.value)
          const rowText = r.text ?? rowKey

          return (
            <div key={rowKey} className="msj__matrixRow">
              <div className="msj__matrixRowTitle">{rowText}</div>

              {!isMulti ? (
                <RadioGroup.Root
                  className="msj__matrixRowChoices"
                  value={valueObj[rowKey] == null ? '' : String(valueObj[rowKey])}
                  onValueChange={(v) => {
                    setQuestionValue(question, { ...valueObj, [rowKey]: v })
                  }}
                >
                  {cols.map((c) => {
                    const colKey = String(c.value)
                    const colText = c.text ?? colKey
                    const selected = String(valueObj[rowKey] ?? '') === colKey
                    return (
                      <RadioGroup.Item key={`${rowKey}:${colKey}`} value={colKey} asChild>
                        <button
                          type="button"
                          className="msj__matrixCell"
                          aria-label={`${rowText}: ${colText}`}
                          data-state={selected ? 'checked' : 'unchecked'}
                        >
                          <span className="msj__radioItem" aria-hidden>
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
                                className="msj__radioPulse"
                                initial={{ scale: 0.8, opacity: 0.28 }}
                                animate={{ scale: 2.2, opacity: 0 }}
                                transition={{ duration: Math.max(0.22, opts.duration * 1.4) }}
                              />
                            ) : null}
                          </span>
                        </button>
                      </RadioGroup.Item>
                    )
                  })}
                </RadioGroup.Root>
              ) : (
                <div className="msj__matrixRowChoices">
                  {cols.map((c) => {
                    const colKey = String(c.value)
                    const currentArr = Array.isArray(valueObj[rowKey]) ? (valueObj[rowKey] as unknown[]) : []
                    const checked = currentArr.includes(c.value)
                    return (
                      <label key={colKey} className="msj__matrixCell" data-state={checked ? 'checked' : 'unchecked'}>
                        <Checkbox.Root
                          className="msj__checkbox"
                          checked={checked}
                          onCheckedChange={(v) => {
                            const nextSet = new Set(currentArr)
                            if (v === true) nextSet.add(c.value)
                            else nextSet.delete(c.value)
                            setQuestionValue(question, { ...valueObj, [rowKey]: Array.from(nextSet) })
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
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
