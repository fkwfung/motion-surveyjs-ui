import type { Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'

export function HtmlElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { html?: string; title?: string; name: string }
  const html = q.html ?? ''

  return (
    <BaseElement element={question} opts={opts}>
      {q.title ? <div className="msj__label">{getQuestionTitle(question, opts)}</div> : null}
      <div className="msj__html" dangerouslySetInnerHTML={{ __html: html }} />
    </BaseElement>
  )
}
