# motion-surveyjs-ui

A modern, TypeScript-first React library for rendering SurveyJS JSON models.

## Install

```bash
npm i motion-surveyjs-ui
```

## Usage

Comment question word count:
- Default max word count is **200**.
- Override per-question via `maxWordCount` (or `maxWords`) in the Survey JSON.


```tsx
import { MotionSurvey } from 'motion-surveyjs-ui'

export function App() {
  return (
    <MotionSurvey
      theme="modern"
      animate
      json={{
        title: 'Feedback',
        pages: [
          {
            name: 'page1',
            elements: [{ type: 'text', name: 'name', title: 'Your name' }],
          },
        ],
      }}
      onComplete={(data) => console.log(data)}
    />
  )
}
```

- UI primitives: Radix UI
- Animations/transitions: motion.dev

## Localization

All built-in UI strings (buttons, placeholders, counters) can be customized:

```tsx
<MotionSurvey
  json={...}
  messages={{
    back: '返回',
    next: '下一步',
    complete: '提交',
    selectPlaceholder: '请选择…',
    wordCount: '{count}/{max} 字',
  }}
/>
```

## Styling overrides

See **[STYLING-CSS-GUIDE.md](./STYLING-CSS-GUIDE.md)** for the full list of supported CSS variables and classnames.

Quick example — disable borders on choice options (radio/checkbox items):

```css
.msj {
  --msj-choice-option-border: none;
}
```

> If you prefer explicit CSS loading, you can also import: `motion-surveyjs-ui/styles.css`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
