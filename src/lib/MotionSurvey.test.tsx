import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MotionSurvey } from './MotionSurvey'

const json = {
  title: 'Customer feedback',
  pages: [
    {
      name: 'page1',
      elements: [
        { type: 'text', name: 'name', title: 'Your name', isRequired: true },
      ],
    },
  ],
}

describe('MotionSurvey', () => {
  it('renders survey title and question', () => {
    render(<MotionSurvey json={json} />)

    expect(screen.getByText('Customer feedback')).toBeInTheDocument()
    expect(screen.getByLabelText(/Your name/)).toBeInTheDocument()
  })
})
