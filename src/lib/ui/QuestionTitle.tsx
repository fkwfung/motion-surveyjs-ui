import type { IElement } from 'survey-core'
import type { RenderOptions } from './types'

export function QuestionTitle({ element, opts }: { element: IElement; opts: RenderOptions }) {
  const base = ((element as unknown as { title?: string }).title ?? '') || element.name
  const isRequired = (element as unknown as { isRequired?: boolean }).isRequired

  let numberPrefix: string | null = null

  if (opts.showQuestionNumbers !== 'off') {
    if (opts.showQuestionNumbers === 'on' && opts.globalQuestionIndex >= 0) {
      numberPrefix = `${opts.globalQuestionIndex + 1}.`
    } else if (opts.showQuestionNumbers === 'onPage' && opts.questionIndex >= 0) {
      numberPrefix = `${opts.questionIndex + 1}.`
    }
  }

  return (
    <span className="msj__titleContainer">
      {numberPrefix && <span className="msj__titleNumber">{numberPrefix}</span>}
      <span className="msj__titleText">
        {base}
        {isRequired && <span className="msj__required" aria-hidden> *</span>}
      </span>
    </span>
  )
}
