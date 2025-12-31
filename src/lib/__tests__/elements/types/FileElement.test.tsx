import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('FileElement motion enhancements', () => {
  it('renders file drop zone with motion wrapper', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'file', name: 'f1', title: 'Upload file' }],
        },
      ],
    }
    renderSurvey(json)

    expect(screen.getByText(/Upload file/)).toBeInTheDocument()
    expect(screen.getByText(/Click or drag files here/)).toBeInTheDocument()
  })

  it('has drop zone with proper structure', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'file', name: 'f1', title: 'Document' }],
        },
      ],
    }
    renderSurvey(json)

    const dropZone = document.querySelector('.msj__fileDropZone')
    expect(dropZone).toBeInTheDocument()

    const input = document.querySelector('.msj__fileInput')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'file')
  })

  it('supports multiple file selection when allowMultiple is true', () => {
    const json = {
      pages: [
        {
          elements: [{ type: 'file', name: 'f1', title: 'Files', allowMultiple: true }],
        },
      ],
    }
    renderSurvey(json)

    const input = document.querySelector('.msj__fileInput')
    expect(input).toHaveAttribute('multiple')
  })
})
