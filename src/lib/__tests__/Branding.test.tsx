import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MotionSurvey } from '../MotionSurvey'
import { Model } from 'survey-core'

describe('Branding Support', () => {
  it('renders logo with correct properties', () => {
    const json = {
      logo: 'https://example.com/logo.png',
      logoWidth: 200,
      logoHeight: 100,
      logoPosition: 'right',
      logoFit: 'cover',
    }
    const model = new Model(json)
    render(<MotionSurvey model={model} />)

    const logo = screen.getByAltText('Survey Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png')
    expect(logo).toHaveStyle({
      width: '200px',
      height: '100px',
      objectFit: 'cover',
    })
    expect(logo).toHaveClass('msj__logo--right')
  })

  it('renders background image', () => {
    const json = {
      backgroundImage: 'https://example.com/bg.jpg',
      backgroundImageFit: 'cover',
      backgroundImageAttachment: 'fixed',
      backgroundOpacity: 0.5,
    }
    const model = new Model(json)
    const { container } = render(<MotionSurvey model={model} />)

    const bg = container.querySelector('.msj__background')
    expect(bg).toBeInTheDocument()
    expect(bg).toHaveStyle({
      backgroundImage: 'url(https://example.com/bg.jpg)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      opacity: '0.5',
    })
  })
})
