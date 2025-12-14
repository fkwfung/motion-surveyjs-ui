export type MessageKey =
  | 'back'
  | 'next'
  | 'complete'
  | 'thanksTitle'
  | 'thanksHint'
  | 'selectPlaceholder'
  | 'wordCount'

export type Messages = Record<MessageKey, string>

const EN: Messages = {
  back: 'Back',
  next: 'Next',
  complete: 'Complete',
  thanksTitle: 'Thanks!',
  thanksHint: 'Your responses have been recorded.',
  selectPlaceholder: 'Select…',
  wordCount: '{count}/{max} words',
}

export function createTranslator({
  messages,
}: {
  messages?: Partial<Messages>
}): (key: MessageKey, vars?: Record<string, string | number>) => string {
  const dict: Messages = { ...EN, ...(messages ?? {}) }

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
