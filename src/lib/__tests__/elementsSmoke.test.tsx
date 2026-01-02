import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from './testUtils'

describe('element type support (smoke)', () => {
  it('renders all schema element types without crashing', () => {
    const json = {
      title: 'Demo',
      pages: [
        {
          name: 'p1',
          elements: [
            { type: 'html', name: 'h1', html: '<p>HTML block</p>' },
            { type: 'image', name: 'img1', imageLink: 'https://placehold.co/100x40/png?text=img' },
            { type: 'expression', name: 'expr', title: 'Expression', expression: '{a} + 1' },
            { type: 'text', name: 'a', title: 'Text' },
            { type: 'comment', name: 'c', title: 'Comment' },
            { type: 'radiogroup', name: 'r', title: 'Radio', choices: ['A', 'B'] },
            { type: 'checkbox', name: 'cb', title: 'Checkbox', choices: ['A', 'B'] },
            { type: 'dropdown', name: 'dd', title: 'Dropdown', choices: ['A', 'B'] },
            { type: 'rating', name: 'rate', title: 'Rating', rateMin: 1, rateMax: 3 },
            { type: 'boolean', name: 'bool', title: 'Boolean' },
            { type: 'multipletext', name: 'mt', title: 'Multiple text', items: [{ name: 'x', title: 'X' }] },
            { type: 'tagbox', name: 'tag', title: 'Tagbox', choices: ['A', 'B'] },
            { type: 'buttongroup', name: 'bg', title: 'Button group', choices: ['A', 'B'] },
            {
              type: 'imagepicker',
              name: 'ip',
              title: 'Image picker',
              choices: [{ value: 'a', text: 'A', imageLink: 'https://placehold.co/80x60/png?text=A' }],
            },
            { type: 'ranking', name: 'rank', title: 'Ranking', choices: ['A', 'B'] },
            { type: 'file', name: 'file', title: 'File' },
            { type: 'signaturepad', name: 'sig', title: 'Signature' },
            { type: 'matrix', name: 'm', title: 'Matrix', rows: ['r1'], columns: ['c1'] },
            { type: 'matrixdropdown', name: 'md', title: 'Matrix dropdown' },
            { type: 'matrixdynamic', name: 'mdd', title: 'Matrix dynamic' },
            {
              type: 'paneldynamic',
              name: 'pd',
              title: 'Panel dynamic',
              panelCount: 1,
              templateElements: [{ type: 'text', name: 'pdt', title: 'Nested text' }],
            },
            {
              type: 'flowpanel',
              name: 'fp',
              title: 'Flow panel',
              elements: [{ type: 'text', name: 'fpq', title: 'Flow text' }],
            },
          ],
        },
      ],
    }

    renderSurvey(json)

    expect(screen.getByText('HTML block')).toBeInTheDocument()
    expect(screen.getByText(/Expression/)).toBeInTheDocument()
    expect(screen.getByText(/Text/)).toBeInTheDocument()
    expect(screen.getByText(/Comment/)).toBeInTheDocument()
    expect(screen.getByText(/Radio/)).toBeInTheDocument()
    expect(screen.getByText(/Checkbox/)).toBeInTheDocument()
    expect(screen.getAllByText(/Dropdown/)[0]).toBeInTheDocument()
    expect(screen.getByText(/Rating/)).toBeInTheDocument()
    expect(screen.getByText(/Boolean/)).toBeInTheDocument()
    expect(screen.getByText(/Multiple text/)).toBeInTheDocument()
    expect(screen.getByText(/Tagbox/)).toBeInTheDocument()
    expect(screen.getByText(/Button group/)).toBeInTheDocument()
    expect(screen.getByText(/Image picker/)).toBeInTheDocument()
    expect(screen.getByText(/Ranking/)).toBeInTheDocument()
    expect(screen.getByText(/File/)).toBeInTheDocument()
    expect(screen.getByText(/Signature/)).toBeInTheDocument()
    expect(screen.getByText(/Matrix Dropdown is not yet fully supported/)).toBeInTheDocument()
    expect(screen.getByText(/Matrix Dynamic is not yet fully supported/)).toBeInTheDocument()
    expect(screen.getByText(/Flow panel/)).toBeInTheDocument()
    expect(screen.getByText(/Flow text/)).toBeInTheDocument()
  })
})
