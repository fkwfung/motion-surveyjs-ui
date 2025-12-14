import type { ChoiceItem, Question } from 'survey-core'
import * as Select from '@radix-ui/react-select'
import { BaseElement } from '../ui/BaseElement'
import { getQuestionTitle } from './getQuestionTitle'
import { Errors } from '../ui/Errors'
import type { RenderOptions } from '../ui/types'
import { getQuestionErrors } from './getQuestionErrors'
import { setQuestionValue } from './setQuestionValue'

export function DropdownElement({
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

  const EMPTY = '__msj-empty__'
  const currentStr = q.value == null ? EMPTY : String(q.value)

  return (
    <BaseElement element={q} opts={opts}>
      <div className="msj__label">
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <Select.Root
        value={currentStr}
        onValueChange={(v) => {
          if (v === EMPTY) {
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
              <Select.Item value={EMPTY} className="msj__selectItem">
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
    </BaseElement>
  )
}
