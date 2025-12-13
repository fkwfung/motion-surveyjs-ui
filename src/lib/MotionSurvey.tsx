import { useEffect, useMemo, useReducer } from 'react'
import { Model } from 'survey-core'
import type { ChoiceItem, Question, SurveyError } from 'survey-core'
import * as Label from '@radix-ui/react-label'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Select from '@radix-ui/react-select'
import { AnimatePresence, motion } from 'motion/react'

export type MotionSurveyProps = {
  /** SurveyJS JSON schema. Prefer this if you don't need to manage the model instance yourself. */
  json?: ConstructorParameters<typeof Model>[0]
  /** Provide your own SurveyJS model instance (advanced use). */
  model?: Model
  /** Initial data for the survey model (applied only when `model` is not provided). */
  data?: Record<string, unknown>
  /** Called when the survey completes successfully. */
  onComplete?: (data: Record<string, unknown>, model: Model) => void

  /** Enables motion.dev transitions for page/content changes. Default: true */
  animate?: boolean
  /** Animation duration in milliseconds. Default: 180 */
  animationDurationMs?: number

  /** Built-in theme presets (CSS variables). */
  theme?: 'modern' | 'business' | 'school' | 'fashion' | 'cyber'

  className?: string
}

export function MotionSurvey({
  json,
  model,
  data,
  onComplete,
  animate = true,
  animationDurationMs = 180,
  theme = 'modern',
  className,
}: MotionSurveyProps) {
  const survey = useMemo(() => {
    if (model) return model
    const m = new Model(json ?? {})
    if (data) m.data = data
    return m
  }, [model, json, data])

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const duration = animationDurationMs / 1000
  const rootClassName = [
    'msj',
    theme ? `msj--theme-${theme}` : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    const rerender = () => forceUpdate()
    const handleComplete = () => {
      onComplete?.(survey.data as Record<string, unknown>, survey)
      rerender()
    }

    survey.onValueChanged.add(rerender)
    survey.onCurrentPageChanged.add(rerender)
    survey.onComplete.add(handleComplete)

    return () => {
      survey.onValueChanged.remove(rerender)
      survey.onCurrentPageChanged.remove(rerender)
      survey.onComplete.remove(handleComplete)
    }
  }, [survey, onComplete])

  if (survey.state === 'completed') {
    return (
      <div className={rootClassName}>
        <div className="msj__card">
          <h2 className="msj__title">Thanks!</h2>
          <div className="msj__hint">Your responses have been recorded.</div>
        </div>
      </div>
    )
  }

  const page = survey.currentPage
  const questions = (page?.questions ?? []) as Question[]

  return (
    <div className={rootClassName}>
      <div className="msj__card">
        {survey.title ? <h2 className="msj__title">{survey.title}</h2> : null}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page?.name ?? 'page'}
            initial={animate ? { opacity: 0, y: 8 } : false}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            exit={animate ? { opacity: 0, y: -8 } : undefined}
            transition={{ duration }}
          >
            {questions.map((q) => (
              <div key={q.name} className="msj__question">
                {renderQuestion(q, { animate, duration })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="msj__actions">
          <button
            type="button"
            className="msj__button"
            disabled={survey.isFirstPage}
            onClick={() => {
              survey.prevPage()
              forceUpdate()
            }}
          >
            Back
          </button>

          {survey.isLastPage ? (
            <button
              type="button"
              className="msj__button msj__button--primary"
              onClick={() => {
                if (survey.validateCurrentPage()) survey.tryComplete()
                forceUpdate()
              }}
            >
              Complete
            </button>
          ) : (
            <button
              type="button"
              className="msj__button msj__button--primary"
              onClick={() => {
                if (survey.validateCurrentPage()) survey.nextPage()
                forceUpdate()
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

type RenderOptions = {
  animate: boolean
  duration: number
}

function renderQuestion(question: Question, opts: RenderOptions) {
  const type = question.getType()
  const title = question.title || question.name

  const errors = (
    ((question as unknown as { errors?: SurveyError[] }).errors ?? []).map((e) => e.text) as string[]
  ).filter(Boolean)

  switch (type) {
    case 'comment':
      return (
        <>
          <Label.Root className="msj__label" htmlFor={question.id}>
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </Label.Root>
          <textarea
            id={question.id}
            className="msj__textarea"
            value={(question.value ?? '') as string}
            onChange={(e) => (question.value = e.currentTarget.value)}
          />
          {renderErrors(errors, opts)}
        </>
      )

    case 'boolean':
      return (
        <>
          <label className="msj__choice">
            <Checkbox.Root
              className="msj__checkbox"
              checked={Boolean(question.value)}
              onCheckedChange={(v) => (question.value = v === true)}
            >
              <Checkbox.Indicator className="msj__checkboxIndicator">
                ✓
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="msj__labelInline">
              {title}
              {question.isRequired ? <span aria-hidden> *</span> : null}
            </span>
          </label>
          {renderErrors(errors, opts)}
        </>
      )

    case 'radiogroup':
    case 'checkbox': {
      const choices =
        (question as unknown as { visibleChoices?: ChoiceItem[] }).visibleChoices ?? []
      const isMulti = type === 'checkbox'
      const current = question.value

      if (!isMulti) {
        const currentStr = current == null ? '' : String(current)
        return (
          <>
            <div className="msj__label">
              {title}
              {question.isRequired ? <span aria-hidden> *</span> : null}
            </div>
            <RadioGroup.Root
              className="msj__choiceList"
              value={currentStr}
              onValueChange={(v) => {
                const found = choices.find((c) => String(c.value) === v)
                question.value = found ? found.value : undefined
              }}
            >
              {choices.map((c) => {
                const valueStr = String(c.value)
                const text = c.text ?? valueStr
                return (
                  <Label.Root key={valueStr} className="msj__choice">
                    <RadioGroup.Item value={valueStr} className="msj__radioItem">
                      <RadioGroup.Indicator className="msj__radioIndicator" />
                    </RadioGroup.Item>
                    <span>{text}</span>
                  </Label.Root>
                )
              })}
            </RadioGroup.Root>
            {renderErrors(errors, opts)}
          </>
        )
      }

      const set = new Set(Array.isArray(current) ? current : [])
      return (
        <>
          <div className="msj__label">
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </div>
          <div className="msj__choiceList">
            {choices.map((c) => {
              const value = c.value
              const valueStr = String(value)
              const text = c.text ?? valueStr
              const checked = set.has(value)

              return (
                <label key={valueStr} className="msj__choice">
                  <Checkbox.Root
                    className="msj__checkbox"
                    checked={checked}
                    onCheckedChange={(v) => {
                      const next = new Set(Array.isArray(question.value) ? question.value : [])
                      if (v === true) next.add(value)
                      else next.delete(value)
                      question.value = Array.from(next)
                    }}
                  >
                    <Checkbox.Indicator className="msj__checkboxIndicator">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span>{text}</span>
                </label>
              )
            })}
          </div>
          {renderErrors(errors, opts)}
        </>
      )
    }

    case 'dropdown': {
      const choices =
        (question as unknown as { visibleChoices?: ChoiceItem[] }).visibleChoices ?? []

      const currentStr = question.value == null ? '' : String(question.value)

      return (
        <>
          <div className="msj__label">
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </div>

          <Select.Root
            value={currentStr}
            onValueChange={(v) => {
              if (!v) {
                question.value = undefined
                return
              }
              const found = choices.find((c) => String(c.value) === v)
              question.value = found ? found.value : v
            }}
          >
            <Select.Trigger className="msj__selectTrigger" aria-label={title}>
              <Select.Value placeholder="Select…" />
              <Select.Icon className="msj__selectIcon">▾</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="msj__selectContent" position="popper">
                <Select.Viewport className="msj__selectViewport">
                  <Select.Item value="" className="msj__selectItem">
                    <Select.ItemText>Select…</Select.ItemText>
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

          {renderErrors(errors, opts)}
        </>
      )
    }

    case 'text':
    default:
      return (
        <>
          <Label.Root className="msj__label" htmlFor={question.id}>
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </Label.Root>
          <input
            id={question.id}
            className="msj__input"
            value={(question.value ?? '') as string}
            onChange={(e) => (question.value = e.currentTarget.value)}
          />
          {renderErrors(errors, opts)}
        </>
      )
  }
}

function renderErrors(errors: string[], opts: RenderOptions) {
  if (errors.length === 0) return null

  return (
    <AnimatePresence initial={false}>
      {errors.map((t) => (
        <motion.div
          key={t}
          className="msj__error"
          layout
          initial={opts.animate ? { opacity: 0, y: -2 } : false}
          animate={opts.animate ? { opacity: 1, y: 0 } : undefined}
          exit={opts.animate ? { opacity: 0, y: -2 } : undefined}
          transition={{ duration: opts.duration * 0.75 }}
        >
          {t}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
