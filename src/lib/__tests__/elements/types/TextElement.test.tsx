import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('TextElement motion enhancements', () => {
  it('renders text input with wrapper for focus animation', () => {
    const json = {
      pages: [{ elements: [{ type: 'text', name: 'q1', title: 'Your name' }] }],
    }
    renderSurvey(json)

    expect(screen.getByLabelText(/Your name/)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('input wrapper exists for scale animation on focus', () => {
    const json = {
      pages: [{ elements: [{ type: 'text', name: 'q1', title: 'Email' }] }],
    }
    renderSurvey(json)

    const input = screen.getByRole('textbox')
    const wrapper = input.closest('.msj__inputWrap')
    expect(wrapper).toBeInTheDocument()
  })

  it('accepts user input correctly', async () => {
    const json = {
      pages: [{ elements: [{ type: 'text', name: 'q1', title: 'Name' }] }],
    }
    const { user } = renderSurvey(json)

    const input = screen.getByRole('textbox')
    await user.type(input, 'John Doe')
    expect(input).toHaveValue('John Doe')
  })
})
