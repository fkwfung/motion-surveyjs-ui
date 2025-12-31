import type { Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'

export function MatrixDynamicElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const title = getQuestionTitle(question, opts)
  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">{title}</div>
      <div className="msj__unsupported">Matrix Dynamic is not yet fully supported.</div>
    </BaseElement>
  )
}
