import type { Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

type SurveyFileValue = { name: string; type: string; content: string }

async function fileToBase64(file: File): Promise<SurveyFileValue> {
  const content = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.readAsDataURL(file)
  })
  return { name: file.name, type: file.type, content }
}

export function FileElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { allowMultiple?: boolean }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <input
        className="msj__input"
        type="file"
        multiple={q.allowMultiple === true}
        onChange={async (e) => {
          const files = Array.from(e.currentTarget.files ?? [])
          const out = await Promise.all(files.map(fileToBase64))
          setQuestionValue(question, q.allowMultiple === true ? out : out[0] ?? undefined)
        }}
      />

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
