import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MotionSurvey } from './MotionSurvey'

const json = {
  title: 'Customer feedback',
  showPageTitles: true,
  showPageNumbers: true,
  showQuestionNumbers: 'onPage',
  pages: [
    {
      name: 'page1',
      title: 'Page 1 title',
      elements: [{ type: 'text', name: 'name', title: 'Your name', isRequired: true }],
    },
  ],
}

describe('MotionSurvey', () => {
  it('renders survey title and question', () => {
    render(<MotionSurvey json={json} />)

    expect(screen.getByText('Customer feedback')).toBeInTheDocument()
    expect(screen.getByText('Page 1 title')).toBeInTheDocument()
    expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument()
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('Your name')).toBeInTheDocument()
  })
})
