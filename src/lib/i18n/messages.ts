import enGB from './locales/en-GB.json'
import enUS from './locales/en-US.json'

export type MessageKey =
  | 'back'
  | 'next'
  | 'complete'
  | 'thanksTitle'
  | 'thanksHint'
  | 'selectPlaceholder'
  | 'wordCount'

export type Messages = Record<MessageKey, string>

export type Locale = 'en-US' | 'en-GB'

const LOCALES: Record<Locale, Messages> = {
  'en-US': enUS as Messages,
  'en-GB': enGB as Messages,
}

export function getLocaleMessages(locale?: string): Messages {
  const key = (locale ?? 'en-US') as Locale
  return LOCALES[key] ?? LOCALES['en-US']
}

export function createTranslator({
  locale,
  messages,
}: {
  locale?: string
  messages?: Partial<Messages>
}): (key: MessageKey, vars?: Record<string, string | number>) => string {
  const base = getLocaleMessages(locale)
  const dict: Messages = { ...base, ...(messages ?? {}) }

  return (key, vars) => {
    let s = dict[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replaceAll(`{${k}}`, String(v))
      }
    }
    return s
  }
}
