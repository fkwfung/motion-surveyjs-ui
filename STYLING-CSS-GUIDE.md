# Styling & CSS Overrides Guide

This library ships with a default stylesheet (`dist/style.css`). It is designed to be customized primarily via **CSS custom properties** (variables) and stable classnames.

> You can either rely on the library auto-importing its CSS (default) or explicitly load it with:
>
> ```ts
> import 'motion-surveyjs-ui/styles.css'
> ```

---

## 1) Where to put overrides

You can scope overrides globally or to a container.

### Scoped override (recommended)

```css
.mySurveyContainer {
  /* override tokens here */
}
```

Then pass a className:

```tsx
<MotionSurvey className="mySurveyContainer" json={...} />
```

### Global override

```css
.msj {
  /* affects all surveys */
}
```

---

## 2) Theming model

`MotionSurvey` renders a root element with the `msj` class and an optional theme class:

- `.msj` (always)
- `.msj--theme-modern` (default)
- `.msj--theme-business`
- `.msj--theme-school`
- `.msj--theme-fashion`
- `.msj--theme-cyber`

You can override tokens at either level:

```css
/* apply to all themes */
.msj {
  --msj-primary: #7c3aed;
}

/* apply only to cyber theme */
.msj--theme-cyber {
  --msj-primary: #22d3ee;
}
```

---

## 3) Core design tokens (CSS variables)

These are the primary tokens currently used by the default theme:

```css
.msj {
  --msj-font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  --msj-text: #0f172a;
  --msj-muted: #475569;
  --msj-border: #e2e8f0;
  --msj-surface: #ffffff;
  --msj-bg: #f8fafc;
  --msj-primary: #2563eb;
  --msj-primary-contrast: #ffffff;
  --msj-radius: 10px;
}
```

Tip: Use these tokens to implement your own “brand theme” without rewriting components.

---

## 4) Choice-based questions (radio/checkbox) customization

Choice options are rendered using a shared option wrapper class and support both hover and selected animations.

### 4.1 Turn choice borders on/off

```css
.msj {
  --msj-choice-option-border: none;
}
```

Or set a custom border:

```css
.msj {
  --msj-choice-option-border: 2px dashed rgba(0, 0, 0, 0.1);
}
```

### 4.2 Adjust hover treatment (distinct from selected)

Hover is intentionally lighter than the selected highlight.
To customize, override the option pseudo-element:

```css
.msj .msj__choiceOption::before {
  background: color-mix(in srgb, var(--msj-primary) 3%, transparent);
}

.msj .msj__choiceOption:hover::before {
  opacity: 0.6;
}
```

---

## 5) Per-question background effects (image/opacity)

Each question is wrapped by `.msj__question` and `.msj__questionInner`.
`BaseQuestion` provides a `::before` layer on `.msj__questionInner` that can be controlled via CSS variables:

- `--msj-question-bg-image`
- `--msj-question-bg-opacity`

Example:

```css
.msj {
  --msj-question-bg-image: radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.20), transparent 60%);
  --msj-question-bg-opacity: 1;
}
```

To scope to only one survey instance, apply overrides on the container className.

---

## 6) Motion/transition considerations

- Page transitions are handled in `MotionSurvey` (motion.dev `AnimatePresence` + `motion.div`).
- Per-question “reveal on scroll” is handled by `BaseQuestion` via `useInView`.

If you want to reduce motion globally, you can disable animations:

```tsx
<MotionSurvey animate={false} json={...} />
```

Or slow them down:

```tsx
<MotionSurvey animationDurationMs={320} json={...} />
```

---

## 7) Stable classnames (override surface)

These are commonly useful selectors:

- `.msj` (root)
- `.msj__card`
- `.msj__title`
- `.msj__label`
- `.msj__input`, `.msj__textarea`
- `.msj__choiceList`
- `.msj__choiceOption` (radio/checkbox option wrapper)
- `.msj__selectTrigger`, `.msj__selectContent`, `.msj__selectItem`
- `.msj__error`

When overriding styles, prefer:
1) tokens (CSS variables), then
2) class-based overrides.

---

## 8) Keeping this guide current

This guide should be updated whenever:

- new CSS variables are added/renamed
- classnames change
- the styling system changes (new theme model, new override API)
- motion/transition behavior changes in a way that affects CSS customization
