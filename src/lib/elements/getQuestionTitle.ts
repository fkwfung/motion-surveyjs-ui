import type { Question } from 'survey-core'
import type { RenderOptions } from '../ui/types'

export function getQuestionTitle(question: Question, opts: RenderOptions): string {
  const base = question.title || question.name

  if (opts.showQuestionNumbers === 'off') return base

  if (opts.showQuestionNumbers === 'on' && opts.globalQuestionIndex < 0) return base
  if (opts.showQuestionNumbers === 'onPage' && opts.questionIndex < 0) return base

  const n = opts.showQuestionNumbers === 'on' ? opts.globalQuestionIndex + 1 : opts.questionIndex + 1
  return `${n}. ${base}`
}
