import { Question, type IElement } from 'survey-core'

export function setQuestionValue(element: IElement, value: unknown) {
  if (element instanceof Question) {
    const q = element
    const survey = q.survey

    if (survey && typeof (survey as unknown as { setValue: unknown }).setValue === 'function' && q.name) {
      (survey as unknown as { setValue: (n: string, v: unknown) => void }).setValue(q.name, value)
      return
    }
  }

  Reflect.set(element as object, 'value', value)
}
