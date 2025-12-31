import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('PanelDynamicElement motion enhancements', () => {
  it('renders dynamic panel with add button', () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'paneldynamic',
              name: 'pd',
              title: 'Items',
              panelCount: 1,
              templateElements: [{ type: 'text', name: 'item', title: 'Item' }],
            },
          ],
        },
      ],
    }
    renderSurvey(json)

    expect(screen.getByText(/Items/)).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('adds new panel with animation on button click', async () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'paneldynamic',
              name: 'pd',
              title: 'List',
              panelCount: 1,
              templateElements: [{ type: 'text', name: 'entry', title: 'Entry' }],
            },
          ],
        },
      ],
    }
    const { user } = renderSurvey(json)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add item' }))

    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('removes panel with animation on remove button click', async () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'paneldynamic',
              name: 'pd',
              title: 'Removable',
              panelCount: 2,
              templateElements: [{ type: 'text', name: 'x', title: 'X' }],
            },
          ],
        },
      ],
    }
    const { user } = renderSurvey(json)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()

    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    await user.click(removeButtons[0])

    // After removal, Item 2 becomes Item 1
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()
  })

  it('panel items have motion wrapper class', () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'paneldynamic',
              name: 'pd',
              title: 'Panels',
              panelCount: 2,
              templateElements: [{ type: 'text', name: 'n', title: 'N' }],
            },
          ],
        },
      ],
    }
    renderSurvey(json)

    const items = document.querySelectorAll('.msj__panelDynamicItem')
    expect(items.length).toBe(2)
  })
})
