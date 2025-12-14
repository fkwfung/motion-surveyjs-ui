import type { Question } from 'survey-core'
import type { RenderOptions } from '../../ui/types'

export function EmptyElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  void question
  void opts
  return null
}
