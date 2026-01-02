import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MotionSurvey } from '../MotionSurvey'

const multiPageJson = {
  pages: [
    {
      name: 'page1',
      elements: [{ type: 'text', name: 'q1', title: 'Question 1' }]
    },
    {
      name: 'page2',
      elements: [{ type: 'text', name: 'q2', title: 'Question 2' }]
    }
  ]
}

describe('Navigation Scroll', () => {
  it('scrolls to top when navigating to next page', async () => {
    const scrollIntoViewMock = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    render(<MotionSurvey json={multiPageJson} animate={false} />)

    // On Page 1
    expect(screen.getByText('Question 1')).toBeInTheDocument()

    // Click Next
    const nextBtn = screen.getByText('Next')
    fireEvent.click(nextBtn)

    // Should be on Page 2
    expect(screen.getByText('Question 2')).toBeInTheDocument()

    // Verify scrollIntoView was called
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })
})
