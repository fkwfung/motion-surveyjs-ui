import type { SurveyError } from 'survey-core'
import type { Question } from 'survey-core'

export function getQuestionErrors(question: Question): string[] {
  return (
    ((question as unknown as { errors?: SurveyError[] }).errors ?? []).map((e) => e.text) as string[]
  ).filter(Boolean)
}
