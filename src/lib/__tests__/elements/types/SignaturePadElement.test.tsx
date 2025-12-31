import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('SignaturePadElement motion enhancements', () => {
  it('renders signature pad with canvas and clear button', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'signaturepad', name: 'sig', title: 'Signature' }],
        },
      ],
    }
    renderSurvey(json)

    expect(screen.getByText(/Signature/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
  })

  it('has canvas element for drawing', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'signaturepad', name: 'sig', title: 'Sign here' }],
        },
      ],
    }
    renderSurvey(json)

    const canvas = document.querySelector('.msj__signaturePad')
    expect(canvas).toBeInTheDocument()
    expect(canvas?.tagName.toLowerCase()).toBe('canvas')
  })

  it('clear button has hover animation', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'signaturepad', name: 'sig', title: 'Sign' }],
        },
      ],
    }
    renderSurvey(json)

    const clearButton = screen.getByRole('button', { name: 'Clear' })
    expect(clearButton).toHaveClass('msj__miniButton')
  })

  it('signature pad wrapper exists', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'signaturepad', name: 'sig', title: 'Signature' }],
        },
      ],
    }
    renderSurvey(json)

    const wrapper = document.querySelector('.msj__signaturePadWrap')
    expect(wrapper).toBeInTheDocument()
  })
})
