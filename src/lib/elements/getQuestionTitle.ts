import type { IElement } from 'survey-core'
import type { RenderOptions } from '../ui/types'

export function getQuestionTitle(element: IElement, opts: RenderOptions): string {
  const base = ((element as unknown as { title?: string }).title ?? '') || element.name

  if (opts.showQuestionNumbers === 'off') return base

  if (opts.showQuestionNumbers === 'on' && opts.globalQuestionIndex < 0) return base
  if (opts.showQuestionNumbers === 'onPage' && opts.questionIndex < 0) return base

  const n = opts.showQuestionNumbers === 'on' ? opts.globalQuestionIndex + 1 : opts.questionIndex + 1
  return `${n}. ${base}`
}
