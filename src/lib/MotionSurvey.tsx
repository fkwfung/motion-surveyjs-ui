import { useEffect, useMemo, useReducer, useRef } from 'react'
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
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M10 3.5 6 8l4 4.5"
        stroke="currentColor"
        strokeWidth="2"
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
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M6 3.5 10 8l-4 4.5"
        stroke="currentColor"
        strokeWidth="2"
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

    const baseJson = (json ?? {}) as Record<string, unknown>
    const patchedJson =
      baseJson.showQuestionNumbers === undefined
        ? { ...baseJson, showQuestionNumbers: 'onPage' }
        : baseJson

    const m = new Model(patchedJson)
    if (data) m.data = data
    return m
  }, [model, json, data])

  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [validationState, dispatchValidation] = useReducer(
    (
      state: { pageName: string | null; seq: number },
      action: { type: 'bump' | 'setPage'; pageName: string | null }
    ) => {
      if (action.type === 'setPage') return { pageName: action.pageName, seq: 0 }
      if (state.pageName !== action.pageName) return { pageName: action.pageName, seq: 1 }
      return { pageName: state.pageName, seq: state.seq + 1 }
    },
    { pageName: null, seq: 0 }
  )
  const pendingFocusQuestionName = useRef<string | null>(null)

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
    const onPageChanged = () => {
      dispatchValidation({ type: 'setPage', pageName: survey.currentPage?.name ?? null })
      rerender()
    }
    const handleComplete = () => {
      onComplete?.(survey.data as Record<string, unknown>, survey)
      rerender()
    }

    survey.onValueChanged.add(rerender)
    survey.onCurrentPageChanged.add(onPageChanged)
    survey.onComplete.add(handleComplete)

    return () => {
      survey.onValueChanged.remove(rerender)
      survey.onCurrentPageChanged.remove(onPageChanged)
      survey.onComplete.remove(handleComplete)
    }
  }, [survey, onComplete])

  useEffect(() => {
    const name = pendingFocusQuestionName.current
    if (!name) return
    pendingFocusQuestionName.current = null

    const esc =
      typeof window !== 'undefined' && window.CSS && typeof window.CSS.escape === 'function'
        ? window.CSS.escape
        : (s: string) => s.replaceAll('"', '\\"')

    const wrap = document.querySelector<HTMLElement>(`[data-msj-question="${esc(name)}"]`)
    if (!wrap) return

    const focusEl = wrap.querySelector<HTMLElement>(
      'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
    )

    try {
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch {
      wrap.scrollIntoView()
    }

    focusEl?.focus({ preventScroll: true })
  })

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
  const validationSeq = validationState.pageName === (page?.name ?? null) ? validationState.seq : 0

  const showPageTitles = (survey as unknown as { showPageTitles?: boolean }).showPageTitles !== false
  const showPageNumbers = (survey as unknown as { showPageNumbers?: boolean }).showPageNumbers === true
  const rawShowQuestionNumbers = (survey as unknown as { showQuestionNumbers?: boolean | string })
    .showQuestionNumbers

  const showQuestionNumbers: 'off' | 'on' | 'onPage' =
    rawShowQuestionNumbers === true
      ? 'on'
      : rawShowQuestionNumbers === false
        ? 'off'
        : rawShowQuestionNumbers === 'off' || rawShowQuestionNumbers === 'on' || rawShowQuestionNumbers === 'onPage'
          ? rawShowQuestionNumbers
          : 'onPage'

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
                  let ok = false
                  try {
                    ok = survey.validateCurrentPage()
                  } catch {
                    ok = false
                  }

                  if (!ok) {
                    const firstInvalid = questions.find((q) => q.hasErrors())
                    pendingFocusQuestionName.current = firstInvalid?.name ?? null
                    dispatchValidation({ type: 'bump', pageName: page?.name ?? null })
                    forceUpdate()
                    return
                  }

                  survey.tryComplete()
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
                  let ok = false
                  try {
                    ok = survey.validateCurrentPage()
                  } catch {
                    ok = false
                  }

                  if (!ok) {
                    const firstInvalid = questions.find((q) => q.hasErrors())
                    pendingFocusQuestionName.current = firstInvalid?.name ?? null
                    dispatchValidation({ type: 'bump', pageName: page?.name ?? null })
                    forceUpdate()
                    return
                  }

                  survey.nextPage()
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
            {showPageTitles || showPageNumbers ? (
              <div className="msj__pageHeader">
                {showPageTitles && page?.title ? (
                  <div className="msj__pageTitle">{page.title}</div>
                ) : null}
                {showPageNumbers ? (
                  <div className="msj__pageNumber">
                    {t('pageXofY', {
                      current: (survey.currentPageNo ?? 0) + 1,
                      total: survey.pages?.length ?? 0,
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            {(() => {
              const globalStartIndex = (survey.pages ?? [])
                .slice(0, survey.currentPageNo ?? 0)
                .reduce((sum, p) => sum + ((p.questions ?? []) as Question[]).length, 0)

              return questions.map((q, i) => (
                <div key={q.name}>
                  {renderQuestion(
                    q,
                    {
                      animate,
                      duration,
                      t,
                      validationSeq,
                      questionIndex: i,
                      globalQuestionIndex: globalStartIndex + i,
                      showQuestionNumbers,
                    } satisfies RenderOptions
                  )}
                </div>
              ))
            })()}
          </motion.div>
        </AnimatePresence>

        {renderNav('bottom')}
      </div>
    </div>
  )
}
