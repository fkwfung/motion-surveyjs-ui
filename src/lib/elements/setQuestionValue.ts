import type { IElement } from 'survey-core'

export function setQuestionValue(element: IElement, value: unknown) {
  Reflect.set(element as object, 'value', value)
}
