import type { ChoiceItem, Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

export function RankingElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { visibleChoices?: ChoiceItem[] }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const choices = q.visibleChoices ?? []

  const current = Array.isArray(question.value) ? (question.value as unknown[]) : []
  const all = [...new Set([...current, ...choices.map((c) => c.value)])]

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...all]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    const t = next[idx]
    next[idx] = next[swap]
    next[swap] = t
    setQuestionValue(question, next)
  }

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <motion.ul className="msj__ranking" layout>
        {all.map((v, idx) => {
          const valueStr = String(v)
          const text = choices.find((c) => c.value === v)?.text ?? valueStr
          return (
            <motion.li key={valueStr} className="msj__rankingItem" layout transition={{ duration: opts.duration }}>
              <span className="msj__rankingLabel">{text}</span>
              <span className="msj__rankingControls">
                <button type="button" className="msj__miniButton" onClick={() => move(idx, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className="msj__miniButton" onClick={() => move(idx, 1)} aria-label="Move down">
                  ↓
                </button>
              </span>
            </motion.li>
          )
        })}
      </motion.ul>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
