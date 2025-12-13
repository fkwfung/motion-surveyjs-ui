import type { Question } from 'survey-core'
import type { RenderOptions } from '../ui/types'
import { TextQuestion } from './TextQuestion'
import { CommentQuestion } from './CommentQuestion'
import { BooleanQuestion } from './BooleanQuestion'
import { ChoiceQuestion } from './ChoiceQuestion'
import { DropdownQuestion } from './DropdownQuestion'

export function renderQuestion(question: Question, opts: RenderOptions) {
  const type = question.getType()

  switch (type) {
    case 'comment':
      return <CommentQuestion question={question} opts={opts} />

    case 'boolean':
      return <BooleanQuestion question={question} opts={opts} />

    case 'radiogroup':
      return <ChoiceQuestion question={question} isMulti={false} opts={opts} />

    case 'checkbox':
      return <ChoiceQuestion question={question} isMulti={true} opts={opts} />

    case 'dropdown':
      return <DropdownQuestion question={question} opts={opts} />

    case 'text':
    default:
      return <TextQuestion question={question} opts={opts} />
  }
}
