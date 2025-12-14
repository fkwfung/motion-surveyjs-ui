import type { IElement, SurveyError } from 'survey-core'

function getErrorText(e: SurveyError): string {
  const maybe = e as unknown as { getText?: () => string; text?: string }
  return (typeof maybe.getText === 'function' ? maybe.getText() : maybe.text) ?? ''
}

export function getQuestionErrors(element: IElement): string[] {
  const errs = (element as unknown as { errors?: SurveyError[] }).errors ?? []
  return errs.map(getErrorText).filter(Boolean)
}
