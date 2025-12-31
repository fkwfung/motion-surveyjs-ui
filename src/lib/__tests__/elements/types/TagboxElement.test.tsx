import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('TagboxElement motion enhancements', () => {
  it('renders tagbox with motion buttons', () => {
    const json = {
      pages: [
        {
          elements: [
            { type: 'tagbox', name: 'tags', title: 'Select tags', choices: ['React', 'Vue', 'Angular'] },
          ],
        },
      ],
    }
    renderSurvey(json)

    expect(screen.getByText(/Select tags/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vue' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Angular' })).toBeInTheDocument()
  })

  it('toggles tag selection with animation classes', async () => {
    const json = {
      pages: [
        {
          elements: [
            { type: 'tagbox', name: 'tags', title: 'Tags', choices: ['A', 'B', 'C'] },
          ],
        },
      ],
    }
    const { user } = renderSurvey(json)

    const tagA = screen.getByRole('button', { name: 'A' })
    expect(tagA).not.toHaveClass('msj__tag--active')

    await user.click(tagA)
    expect(tagA).toHaveClass('msj__tag--active')

    // Tag should have the background element when active
    const bgElement = tagA.querySelector('.msj__tagBg')
    expect(bgElement).toBeInTheDocument()
  })

  it('allows multiple tag selections', async () => {
    const json = {
      pages: [
        {
          elements: [
            { type: 'tagbox', name: 'tags', title: 'Tags', choices: ['X', 'Y', 'Z'] },
          ],
        },
      ],
    }
    const { user } = renderSurvey(json)

    await user.click(screen.getByRole('button', { name: 'X' }))
    await user.click(screen.getByRole('button', { name: 'Z' }))

    expect(screen.getByRole('button', { name: 'X' })).toHaveClass('msj__tag--active')
    expect(screen.getByRole('button', { name: 'Y' })).not.toHaveClass('msj__tag--active')
    expect(screen.getByRole('button', { name: 'Z' })).toHaveClass('msj__tag--active')
  })
})
