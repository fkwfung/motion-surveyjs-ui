import type { Question } from 'survey-core'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Checkbox from '@radix-ui/react-checkbox'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
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

  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const rows = q.visibleRows ?? []
  const cols = q.visibleColumns ?? []

  const valueObj = (question.value ?? {}) as Record<string, unknown>
  const isMulti = q.cellType === 'checkbox'

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <div className="msj__matrix">
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
                    return (
                      <RadioGroup.Item key={colKey} value={colKey} asChild>
                        <button type="button" className="msj__matrixCell">
                          {c.text ?? colKey}
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
                        <span>{c.text ?? colKey}</span>
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
