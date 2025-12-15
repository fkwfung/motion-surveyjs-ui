import type { Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'

export function ImageElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { imageLink?: string; title?: string; name: string }
  const src = q.imageLink ?? ''
  const alt = q.title ?? q.name

  return (
    <BaseElement element={question} opts={opts}>
      {q.title ? <div className="msj__label">{getQuestionTitle(question, opts)}</div> : null}
      {src ? <img className="msj__image" src={src} alt={alt} /> : null}
    </BaseElement>
  )
}
