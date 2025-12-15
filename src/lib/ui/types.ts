import type { MessageKey } from '../i18n/messages'

export type Translator = (key: MessageKey, vars?: Record<string, string | number>) => string

export type RenderOptions = {
  animate: boolean
  duration: number
  t: Translator
  /** Increments when the user attempts to proceed and validation fails (used for invalid animations). */
  validationSeq: number
  /** 0-based index in current page (used for `showQuestionNumbers: 'onPage'`). */
  questionIndex: number
  /** 0-based index across entire survey (used for `showQuestionNumbers: 'on'`). */
  globalQuestionIndex: number
  /** SurveyJS: 'off' | 'on' | 'onPage'. */
  showQuestionNumbers: 'off' | 'on' | 'onPage'
  /** Where Radix portals (e.g. dropdown) should render; keeps styles/overrides scoped. */
  portalContainer?: HTMLElement | null
}
