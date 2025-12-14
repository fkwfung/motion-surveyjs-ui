# motion-surveyjs-ui

A modern, TypeScript-first React library for rendering SurveyJS JSON models.

## Install

```bash
npm i motion-surveyjs-ui
```

## Usage

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
