import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BooleanElement } from '../elements/types/BooleanElement'
import { Question } from 'survey-core'
import { RenderOptions } from '../ui/types'

// Helper to setup userEvent
function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}

describe('BooleanElement', () => {
  let question: Question
  const opts: RenderOptions = {
    duration: 0.2,
    validationSeq: 0,
  }

  beforeEach(() => {
    question = new Question('bool_q')
    question.title = 'Yes or No?'
  })

  it('renders as a toggle switch with Yes/No options', () => {
    render(<BooleanElement question={question} opts={opts} />)
    
    // Should find the toggle switch container
    const switchContainer = document.querySelector('.msj__toggleSwitch')
    expect(switchContainer).toBeInTheDocument()

    // Should find the track and handle
    const track = document.querySelector('.msj__toggleTrack')
    const handle = document.querySelector('.msj__toggleHandle')
    expect(track).toBeInTheDocument()
    expect(handle).toBeInTheDocument()

    // Should find Yes and No labels (hidden or visible depending on state)
    // Since we are using RadioGroup, we should still find the radio items
    const yesButton = screen.getByRole('radio', { name: 'Yes' })
    const noButton = screen.getByRole('radio', { name: 'No' })
    
    expect(yesButton).toBeInTheDocument()
    expect(noButton).toBeInTheDocument()
  })

  it('updates value when options are clicked', async () => {
    const { user } = setup(<BooleanElement question={question} opts={opts} />)
    
    const yesButton = screen.getByRole('radio', { name: 'Yes' })
    await user.click(yesButton)
    expect(question.value).toBe(true)
    
    const noButton = screen.getByRole('radio', { name: 'No' })
    await user.click(noButton)
    expect(question.value).toBe(false)
  })

  it('supports keyboard navigation and ARIA roles', async () => {
    const { user } = setup(<BooleanElement question={question} opts={opts} />)
    
    // Should have radiogroup role
    const group = screen.getByRole('radiogroup')
    expect(group).toBeInTheDocument()
    
    const yesButton = screen.getByRole('radio', { name: 'Yes' })
    const noButton = screen.getByRole('radio', { name: 'No' })
    
    // Initial state
    expect(yesButton).toHaveAttribute('aria-checked', 'false')
    expect(noButton).toHaveAttribute('aria-checked', 'false')
    
    // Click Yes
    await user.click(yesButton)
    expect(yesButton).toHaveAttribute('aria-checked', 'true')
    expect(noButton).toHaveAttribute('aria-checked', 'false')
    
    // Keyboard navigation (Arrow keys)
    // Focus Yes (currently selected)
    yesButton.focus()
    
    // Arrow Right -> Should select No (or focus No)
    await user.keyboard('{ArrowRight}')
    
    // Check if No is focused
    expect(noButton).toHaveFocus()
    
    // If selection follows focus, value should be false.
    // If not, we might need to press Space.
    // Radix RadioGroup default behavior: selection follows focus.
    // But let's check if it updated.
    if (question.value !== false) {
        // If not updated, maybe we need to press Space?
        // Or maybe user-event needs something else.
        // Let's try pressing Space to confirm it works.
        await user.keyboard(' ')
    }
    
    expect(question.value).toBe(false)
    expect(noButton).toHaveAttribute('aria-checked', 'true')
    
    // Arrow Left -> Should select Yes
    await user.keyboard('{ArrowLeft}')
    // Again, check focus and value
    expect(yesButton).toHaveFocus()
    if (question.value !== true) {
        await user.keyboard(' ')
    }
    expect(question.value).toBe(true)
    expect(yesButton).toHaveAttribute('aria-checked', 'true')
  })

  it('supports custom labels and values', async () => {
    const q2 = new Question('bool_q2')
    q2.title = 'Agree?'
    // @ts-ignore
    q2.labelTrue = 'Agree'
    // @ts-ignore
    q2.labelFalse = 'Disagree'
    // @ts-ignore
    q2.valueTrue = 'Yes'
    // @ts-ignore
    q2.valueFalse = 'No'
    
    const { user } = setup(<BooleanElement question={q2} opts={opts} />)
    
    const agreeBtn = screen.getByRole('radio', { name: 'Agree' })
    const disagreeBtn = screen.getByRole('radio', { name: 'Disagree' })
    
    expect(agreeBtn).toBeInTheDocument()
    expect(disagreeBtn).toBeInTheDocument()
    
    await user.click(agreeBtn)
    expect(q2.value).toBe('Yes')
    
    await user.click(disagreeBtn)
    expect(q2.value).toBe('No')
  })

  it('respects swapOrder property', () => {
     const q3 = new Question('bool_q3')
     // @ts-ignore
     q3.swapOrder = true
     
     render(<BooleanElement question={q3} opts={opts} />)
     
     const radios = screen.getAllByRole('radio')
     // Default implementation renders False (No) then True (Yes)
     // With swapOrder, it should be True (Yes) then False (No)
     
     // Since radios are visually hidden and use aria-label
     expect(radios[0]).toHaveAttribute('aria-label', 'Yes')
     expect(radios[1]).toHaveAttribute('aria-label', 'No')
     
     // Also verify visible track labels
     const trackLabels = document.querySelectorAll('.msj__toggleTrackLabel')
     expect(trackLabels[0]).toHaveTextContent('Yes')
     expect(trackLabels[1]).toHaveTextContent('No')
  })
})
