import { useEffect, useMemo, useReducer } from 'react'
import { Model } from 'survey-core'
import type { Question } from 'survey-core'
import { AnimatePresence, motion } from 'motion/react'
import { renderQuestion } from './questions/renderQuestion'
import { createTranslator } from './i18n/messages'
import type { Messages } from './i18n/messages'
import type { RenderOptions } from './ui/types'

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

  /** Override built-in UI text (buttons/placeholders/etc.) */
  messages?: Partial<Messages>

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
  messages,
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
  const t = useMemo(() => createTranslator({ messages }), [messages])
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
          <h2 className="msj__title">{t('thanksTitle')}</h2>
          <div className="msj__hint">{t('thanksHint')}</div>
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
              <div key={q.name}>
                {renderQuestion(q, { animate, duration, t } satisfies RenderOptions)}
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
            {t('back')}
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
              {t('complete')}
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
              {t('next')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
