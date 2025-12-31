import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('CommentElement motion enhancements', () => {
  it('renders textarea with word counter', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'comment', name: 'c1', title: 'Comments' }],
        },
      ],
    }
    renderSurvey(json)

    expect(screen.getByLabelText(/Comments/)).toBeInTheDocument()
    expect(screen.getByText(/0\/200 words/)).toBeInTheDocument()
  })

  it('updates word count as user types', async () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'comment', name: 'c1', title: 'Feedback' }],
        },
      ],
    }
    const { user } = renderSurvey(json)

    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Hello world test')

    expect(screen.getByText(/3\/200 words/)).toBeInTheDocument()
  })

  it('textarea wrapper exists for focus animation', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'comment', name: 'c1', title: 'Note' }],
        },
      ],
    }
    renderSurvey(json)

    const textarea = screen.getByRole('textbox')
    const wrapper = textarea.closest('.msj__textareaWrap')
    expect(wrapper).toBeInTheDocument()
  })

  it('has animated word counter element', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'comment', name: 'c1', title: 'Short' }],
        },
      ],
    }
    renderSurvey(json)

    // Check that the counter element exists
    const counter = document.querySelector('.msj__counter')
    expect(counter).toBeInTheDocument()
    expect(counter?.textContent).toMatch(/words/)
  })
})
