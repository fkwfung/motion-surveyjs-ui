import type { Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'

export function ExpressionElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { displayValue?: unknown; value?: unknown; title?: string; name: string }
  const title = getQuestionTitle(question, opts)
  const v = q.displayValue ?? q.value

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">{title}</div>
      <div className="msj__expression">{v == null ? '' : String(v)}</div>
    </BaseElement>
  )
}
