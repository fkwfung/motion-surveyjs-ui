import type { Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { QuestionTitle } from '../../ui/QuestionTitle'

export function MatrixDynamicElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        <QuestionTitle element={question} opts={opts} />
      </div>
      <div className="msj__unsupported">Matrix Dynamic is not yet fully supported.</div>
    </BaseElement>
  )
}
