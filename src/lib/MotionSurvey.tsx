import { useEffect, useMemo, useReducer } from 'react'
import { Model, Question } from 'survey-core'
import type { ChoiceItem, SurveyError } from 'survey-core'

export type MotionSurveyProps = {
  /** SurveyJS JSON schema. Prefer this if you don't need to manage the model instance yourself. */
  json?: ConstructorParameters<typeof Model>[0]
  /** Provide your own SurveyJS model instance (advanced use). */
  model?: Model
  /** Initial data for the survey model (applied only when `model` is not provided). */
  data?: Record<string, unknown>
  /** Called when the survey completes successfully. */
  onComplete?: (data: Record<string, unknown>, model: Model) => void
  className?: string
}

export function MotionSurvey({ json, model, data, onComplete, className }: MotionSurveyProps) {
  const survey = useMemo(() => {
    if (model) return model
    const m = new Model(json ?? {})
    if (data) m.data = data
    return m
  }, [model, json, data])

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

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
      <div className={['msj', className].filter(Boolean).join(' ')}>
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
    <div className={['msj', className].filter(Boolean).join(' ')}>
      <div className="msj__card">
        {survey.title ? <h2 className="msj__title">{survey.title}</h2> : null}

        {questions.map((q) => (
          <div key={q.name} className="msj__question">
            {renderQuestion(q)}
          </div>
        ))}

        <div className="msj__actions">
          <button
            type="button"
            className="msj__button"
            disabled={survey.isFirstPage}
            onClick={() => survey.prevPage()}
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

function renderQuestion(question: Question) {
  const type = question.getType()
  const title = question.title || question.name

  const errors = (
    ((question as unknown as { errors?: SurveyError[] }).errors ?? []).map((e) => e.text) as string[]
  ).filter(Boolean)

  switch (type) {
    case 'comment':
      return (
        <>
          <label className="msj__label" htmlFor={question.id}>
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </label>
          <textarea
            id={question.id}
            className="msj__textarea"
            value={(question.value ?? '') as string}
            onChange={(e) => (question.value = e.currentTarget.value)}
          />
          {errors.map((t) => (
            <div key={t} className="msj__error">
              {t}
            </div>
          ))}
        </>
      )

    case 'boolean':
      return (
        <>
          <div className="msj__choice">
            <input
              id={question.id}
              type="checkbox"
              checked={Boolean(question.value)}
              onChange={(e) => (question.value = e.currentTarget.checked)}
            />
            <label className="msj__label" htmlFor={question.id}>
              {title}
              {question.isRequired ? <span aria-hidden> *</span> : null}
            </label>
          </div>
          {errors.map((t) => (
            <div key={t} className="msj__error">
              {t}
            </div>
          ))}
        </>
      )

    case 'radiogroup':
    case 'checkbox': {
      const choices =
        (question as unknown as { visibleChoices?: ChoiceItem[] }).visibleChoices ?? []
      const isMulti = type === 'checkbox'
      const current = question.value

      return (
        <>
          <div className="msj__label">
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </div>
          <div className="msj__choiceList">
            {choices.map((c) => {
              const value = c.value
              const text = c.text ?? String(value)
              const checked = isMulti
                ? Array.isArray(current) && current.includes(value)
                : current === value

              return (
                <label key={String(value)} className="msj__choice">
                  <input
                    type={isMulti ? 'checkbox' : 'radio'}
                    name={question.name}
                    checked={checked}
                    onChange={(e) => {
                      if (!isMulti) {
                        question.value = value
                        return
                      }
                      const next = new Set(Array.isArray(current) ? current : [])
                      if (e.currentTarget.checked) next.add(value)
                      else next.delete(value)
                      question.value = Array.from(next)
                    }}
                  />
                  <span>{text}</span>
                </label>
              )
            })}
          </div>
          {errors.map((t) => (
            <div key={t} className="msj__error">
              {t}
            </div>
          ))}
        </>
      )
    }

    case 'dropdown': {
      const choices =
        (question as unknown as { visibleChoices?: ChoiceItem[] }).visibleChoices ?? []
      return (
        <>
          <label className="msj__label" htmlFor={question.id}>
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </label>
          <select
            id={question.id}
            className="msj__select"
            value={(question.value ?? '') as string | number}
            onChange={(e) => (question.value = e.currentTarget.value)}
          >
            <option value="">Select…</option>
            {choices.map((c) => (
              <option key={String(c.value)} value={c.value}>
                {c.text ?? String(c.value)}
              </option>
            ))}
          </select>
          {errors.map((t) => (
            <div key={t} className="msj__error">
              {t}
            </div>
          ))}
        </>
      )
    }

    case 'text':
    default:
      return (
        <>
          <label className="msj__label" htmlFor={question.id}>
            {title}
            {question.isRequired ? <span aria-hidden> *</span> : null}
          </label>
          <input
            id={question.id}
            className="msj__input"
            value={(question.value ?? '') as string}
            onChange={(e) => (question.value = e.currentTarget.value)}
          />
          {errors.map((t) => (
            <div key={t} className="msj__error">
              {t}
            </div>
          ))}
        </>
      )
  }
}
