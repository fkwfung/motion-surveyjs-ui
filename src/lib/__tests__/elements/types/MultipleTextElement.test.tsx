import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from '../../testUtils'

describe('MultipleTextElement motion enhancements', () => {
  it('renders multiple text inputs with stagger animation', () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'multipletext',
              name: 'contact',
              title: 'Contact Info',
              items: [
                { name: 'first', title: 'First Name' },
                { name: 'last', title: 'Last Name' },
                { name: 'email', title: 'Email' },
              ],
            },
          ],
        },
      ],
    }
    renderSurvey(json)

    expect(screen.getByText(/Contact Info/)).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('accepts input in multiple fields', async () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'multipletext',
              name: 'info',
              title: 'Info',
              items: [
                { name: 'city', title: 'City' },
                { name: 'country', title: 'Country' },
              ],
            },
          ],
        },
      ],
    }
    const { user } = renderSurvey(json)

    const cityInput = screen.getByLabelText('City')
    const countryInput = screen.getByLabelText('Country')

    await user.type(cityInput, 'Tokyo')
    await user.type(countryInput, 'Japan')

    expect(cityInput).toHaveValue('Tokyo')
    expect(countryInput).toHaveValue('Japan')
  })

  it('each row has motion wrapper for stagger effect', () => {
    const json = {
      pages: [
        {
          elements: [
            {
              type: 'multipletext',
              name: 'mt',
              title: 'Multi',
              items: [{ name: 'a', title: 'A' }, { name: 'b', title: 'B' }],
            },
          ],
        },
      ],
    }
    renderSurvey(json)

    const rows = document.querySelectorAll('.msj__multipleTextRow')
    expect(rows.length).toBe(2)
  })
})
