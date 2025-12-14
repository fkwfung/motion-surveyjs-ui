import type { ChoiceItem, Question } from 'survey-core'
import * as Select from '@radix-ui/react-select'
import { BaseQuestion } from '../ui/BaseQuestion'
import { getQuestionTitle } from './getQuestionTitle'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function DropdownQuestion({
  question,
  opts,
}: {
  question: Question
  opts: RenderOptions
}) {
  const q = question
  const title = getQuestionTitle(q, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []
  const choices =
    (q as unknown as { visibleChoices?: ChoiceItem[] }).visibleChoices ?? []

  const currentStr = q.value == null ? '' : String(q.value)

  return (
    <BaseQuestion question={q} opts={opts}>
      <div className="msj__label">
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <Select.Root
        value={currentStr}
        onValueChange={(v) => {
          if (!v) {
            setQuestionValue(q, undefined)
            return
          }
          const found = choices.find((c) => String(c.value) === v)
          setQuestionValue(q, found ? found.value : v)
        }}
      >
        <Select.Trigger className="msj__selectTrigger" aria-label={title}>
          <Select.Value placeholder={opts.t('selectPlaceholder')} />
          <Select.Icon className="msj__selectIcon">▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="msj__selectContent" position="popper">
            <Select.Viewport className="msj__selectViewport">
              <Select.Item value="" className="msj__selectItem">
                <Select.ItemText>{opts.t('selectPlaceholder')}</Select.ItemText>
              </Select.Item>
              {choices.map((c) => {
                const valueStr = String(c.value)
                return (
                  <Select.Item key={valueStr} value={valueStr} className="msj__selectItem">
                    <Select.ItemText>{c.text ?? valueStr}</Select.ItemText>
                  </Select.Item>
                )
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <Errors errors={errors} opts={opts} />
    </BaseQuestion>
  )
}
