import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MotionSurvey } from '../MotionSurvey'
import { Model } from 'survey-core'

describe('HTML Content Support', () => {
  it('renders completedHtml when completed', () => {
    const json = {
      completedHtml: '<h1>Custom Thanks</h1>',
    }
    const model = new Model(json)
    Object.defineProperty(model, 'state', { value: 'completed', writable: true })
    
    render(<MotionSurvey model={model} />)

    expect(screen.getByRole('heading', { name: 'Custom Thanks' })).toBeInTheDocument()
  })

  it('renders loadingHtml when loading', () => {
    const json = {
      loadingHtml: '<div>Custom Loading...</div>',
    }
    const model = new Model(json)
    Object.defineProperty(model, 'state', { value: 'loading', writable: true })
    
    render(<MotionSurvey model={model} />)

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument()
  })
})
