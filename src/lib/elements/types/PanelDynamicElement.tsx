import type { ReactNode } from 'react'
import type { IElement, Question } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'

export function PanelDynamicElement({
  question,
  opts,
  render,
}: {
  question: Question
  opts: RenderOptions
  render: (el: IElement, opts: RenderOptions) => ReactNode
}) {
  const q = question as unknown as {
    panels?: IElement[]
    addPanel?: () => void
    removePanel?: (p: IElement) => void
    panelCount?: number
  }

  const title = getQuestionTitle(question, opts)
  const panels = q.panels ?? []

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">{title}</div>

      <div className="msj__panelDynamic">
        {panels.map((p, idx) => (
          <div key={(p as unknown as { name?: string }).name ?? idx} className="msj__panelDynamicItem">
            <div className="msj__panelDynamicHeader">
              <div className="msj__panelDynamicTitle">Item {idx + 1}</div>
              {q.removePanel ? (
                <button type="button" className="msj__miniButton" onClick={() => q.removePanel?.(p)}>
                  Remove
                </button>
              ) : null}
            </div>
            {render(p as unknown as IElement, opts)}
          </div>
        ))}

        {q.addPanel ? (
          <button type="button" className="msj__button" onClick={() => q.addPanel?.()}>
            Add item
          </button>
        ) : null}
      </div>
    </BaseElement>
  )
}
