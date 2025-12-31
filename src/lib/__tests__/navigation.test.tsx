import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from './testUtils'

describe('SurveyJS navigation flags', () => {
  it('respects showNavigationButtons=false', () => {
    const json = {
      title: 'Demo',
      showNavigationButtons: false,
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Q2' }] },
      ],
    }

    renderSurvey(json)
    expect(screen.queryByRole('button', { name: /^Next$/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Previous$/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Complete$/ })).not.toBeInTheDocument()
  })

  it('respects navigationButtonsLocation=topBottom', () => {
    const json = {
      title: 'Demo',
      navigationButtonsLocation: 'topBottom',
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Q2' }] },
      ],
    }

    renderSurvey(json)
    const navs = document.querySelectorAll('.msj__nav')
    expect(navs).toHaveLength(2)
  })

  it('respects navigationButtonsLocation=top (nav appears before questions)', () => {
    const json = {
      title: 'Demo',
      navigationButtonsLocation: 'top',
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Q2' }] },
      ],
    }

    renderSurvey(json)

    const nav = document.querySelector('.msj__nav')
    expect(nav).toBeTruthy()

    const label = screen.getByText(/Q1/)
    expect((nav as Element).compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('respects showPrevButton=false', async () => {
    const json = {
      title: 'Demo',
      showPrevButton: false,
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Q2' }] },
      ],
    }

    const { user } = renderSurvey(json)
    await user.click(screen.getByRole('button', { name: /^Next$/ }))
    expect(screen.queryByRole('button', { name: /^Previous$/ })).not.toBeInTheDocument()
  })
})
