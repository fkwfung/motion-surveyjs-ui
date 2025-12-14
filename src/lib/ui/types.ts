import type { MessageKey } from '../i18n/messages'

export type Translator = (key: MessageKey, vars?: Record<string, string | number>) => string

export type RenderOptions = {
  animate: boolean
  duration: number
  t: Translator
  /** Increments when the user attempts to proceed and validation fails (used for invalid animations). */
  validationSeq: number
}
