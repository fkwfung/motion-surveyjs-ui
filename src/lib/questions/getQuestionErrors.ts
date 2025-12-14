import type { SurveyError } from 'survey-core'
import type { Question } from 'survey-core'

function getErrorText(e: SurveyError): string {
  const maybe = e as unknown as { getText?: () => string; text?: string }
  return (typeof maybe.getText === 'function' ? maybe.getText() : maybe.text) ?? ''
}

export function getQuestionErrors(question: Question): string[] {
  const errs = (question as unknown as { errors?: SurveyError[] }).errors ?? []
  return errs.map(getErrorText).filter(Boolean)
}
