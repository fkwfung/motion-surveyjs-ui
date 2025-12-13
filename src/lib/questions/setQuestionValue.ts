import type { Question } from 'survey-core'

export function setQuestionValue(question: Question, value: unknown) {
  Reflect.set(question as object, 'value', value)
}
