import type { ReactNode } from 'react'
import type { IElement } from 'survey-core'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'

export function FlowPanelElement({
  element,
  opts,
  render,
}: {
  element: IElement
  opts: RenderOptions
  render: (el: IElement, opts: RenderOptions) => ReactNode
}) {
  const panel = element as unknown as { title?: string; elements?: IElement[]; getType?: () => string }
  const children = panel.elements ?? []

  return (
    <BaseElement element={element} opts={opts}>
      {panel.title ? <div className="msj__label">{panel.title}</div> : null}
      <div className="msj__panel">
        {children.map((el, i) => {
          const type = typeof (el as unknown as { getType?: () => string }).getType === 'function'
            ? (el as unknown as { getType: () => string }).getType()
            : 'unknown'
          const key = (el as unknown as { name?: string }).name ?? `${type}-${i}`
          return <div key={key}>{render(el, opts)}</div>
        })}
      </div>
    </BaseElement>
  )
}
