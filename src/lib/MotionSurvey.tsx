import { useEffect, useMemo, useReducer } from 'react'
import { Model } from 'survey-core'
import type { Question } from 'survey-core'
import { AnimatePresence, motion } from 'motion/react'
import { renderQuestion } from './questions/renderQuestion'
import { createTranslator } from './i18n/messages'
import type { Messages } from './i18n/messages'
import type { RenderOptions } from './ui/types'

function ChevronLeftIcon() {
  return (
    <svg
      className="msj__navIcon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M10 3.5 6 8l4 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      className="msj__navIcon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M6 3.5 10 8l-4 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

  /** Built-in locale for internal UI text. Default: en-US (also supports en-GB). */
  locale?: 'en-US' | 'en-GB'
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
  locale = 'en-US',
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
  const t = useMemo(() => createTranslator({ locale, messages }), [locale, messages])
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

  const navLocation =
    ((survey as unknown as { navigationButtonsLocation?: string }).navigationButtonsLocation as
      | 'top'
      | 'bottom'
      | 'topBottom'
      | undefined) ?? 'bottom'

  const globalShowNav =
    (survey as unknown as { showNavigationButtons?: boolean }).showNavigationButtons !== false

  const pageNavVisibility =
    (page as unknown as { navigationButtonsVisibility?: string })?.navigationButtonsVisibility ??
    'inherit'

  const showNav =
    pageNavVisibility === 'hide'
      ? false
      : pageNavVisibility === 'show'
        ? true
        : globalShowNav

  const showPrevGlobal = (survey as unknown as { showPrevButton?: boolean }).showPrevButton !== false
  const showPrev = showNav && showPrevGlobal && !survey.isFirstPage
  const showNext = showNav && !survey.isLastPage
  const showComplete = showNav && survey.isLastPage

  const renderNav = (position: 'top' | 'bottom') => {
    const shouldRender = navLocation === 'topBottom' || navLocation === position
    if (!shouldRender) return null

    return (
      <div className={position === 'top' ? 'msj__nav msj__nav--top' : 'msj__nav'}>
        <div className="msj__navSlot msj__navSlot--left">
          <AnimatePresence initial={false}>
            {showPrev ? (
              <motion.button
                key="prev"
                type="button"
                className="msj__button msj__button--nav"
                onClick={() => {
                  survey.prevPage()
                  forceUpdate()
                }}
                initial={animate ? { opacity: 0, x: -6 } : false}
                animate={animate ? { opacity: 1, x: 0 } : undefined}
                exit={animate ? { opacity: 0, x: -6 } : undefined}
                transition={{ duration }}
                whileHover={animate ? { x: -2 } : undefined}
                whileTap={animate ? { scale: 0.98 } : undefined}
              >
                <ChevronLeftIcon />
                {t('back')}
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="msj__navSlot msj__navSlot--center">
          <AnimatePresence initial={false}>
            {showComplete ? (
              <motion.button
                key="complete"
                type="button"
                className="msj__button msj__button--primary msj__button--complete"
                onClick={() => {
                  if (survey.validateCurrentPage()) survey.tryComplete()
                  forceUpdate()
                }}
                initial={animate ? { opacity: 0, y: 6, scale: 0.98 } : false}
                animate={animate ? { opacity: 1, y: 0, scale: 1 } : undefined}
                exit={animate ? { opacity: 0, y: 6, scale: 0.98 } : undefined}
                transition={{
                  duration,
                  x: { type: 'tween', duration: 0.32, ease: 'easeInOut' },
                  rotate: { type: 'tween', duration: 0.32, ease: 'easeInOut' },
                }}
                whileHover={
                  animate
                    ? {
                        x: [0, -2, 2, -2, 0],
                        rotate: [0, -1.2, 1.2, -1.2, 0],
                      }
                    : undefined
                }
                whileTap={animate ? { scale: 0.98 } : undefined}
              >
                {t('complete')}
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="msj__navSlot msj__navSlot--right">
          <AnimatePresence initial={false}>
            {showNext ? (
              <motion.button
                key="next"
                type="button"
                className="msj__button msj__button--primary msj__button--navPrimary"
                onClick={() => {
                  if (survey.validateCurrentPage()) survey.nextPage()
                  forceUpdate()
                }}
                initial={animate ? { opacity: 0, x: 6 } : false}
                animate={animate ? { opacity: 1, x: 0 } : undefined}
                exit={animate ? { opacity: 0, x: 6 } : undefined}
                transition={{ duration }}
                whileHover={animate ? { x: 2 } : undefined}
                whileTap={animate ? { scale: 0.98 } : undefined}
              >
                {t('next')}
                <ChevronRightIcon />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className={rootClassName}>
      <div className="msj__card">
        {survey.title ? <h2 className="msj__title">{survey.title}</h2> : null}

        {renderNav('top')}

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

        {renderNav('bottom')}
      </div>
    </div>
  )
}
