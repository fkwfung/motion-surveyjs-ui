import { cleanup, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderSurvey } from './testUtils'

describe('SurveyJS numbering flags', () => {
  it('defaults showQuestionNumbers to onPage when not provided in JSON', () => {
    const json = {
      title: 'Demo',
      pages: [{ name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Your name' }] }],
    }

    renderSurvey(json)
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('Your name')).toBeInTheDocument()
  })

  it('implements showQuestionNumbers: onPage (resets per page)', async () => {
    const json = {
      title: 'Demo',
      showQuestionNumbers: 'onPage',
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'First' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Second' }] },
      ],
    }

    const { user } = renderSurvey(json)
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Next$/ }))
    expect(await screen.findByText('1.')).toBeInTheDocument()
    expect(await screen.findByText('Second')).toBeInTheDocument()
  })

  it('implements showQuestionNumbers: on (global numbering)', async () => {
    const json = {
      title: 'Demo',
      showQuestionNumbers: 'on',
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'First' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Second' }] },
      ],
    }

    const { user } = renderSurvey(json)
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('First')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Next$/ }))
    expect(await screen.findByText('2.')).toBeInTheDocument()
    expect(await screen.findByText('Second')).toBeInTheDocument()
  })

  it('implements showQuestionNumbers: off', () => {
    const json = {
      title: 'Demo',
      showQuestionNumbers: 'off',
      pages: [{ name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Your name' }] }],
    }

    renderSurvey(json)
    expect(screen.getByText(/^Your name/)).toBeInTheDocument()
    expect(screen.queryByText(/^1\./)).not.toBeInTheDocument()
  })

  it('shows page titles by default but respects showPageTitles=false', () => {
    const withTitle = {
      title: 'Demo',
      pages: [{ name: 'p1', title: 'Page 1 title', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] }],
    }

    renderSurvey(withTitle)
    expect(screen.getByText('Page 1 title')).toBeInTheDocument()

    const withoutTitle = {
      title: 'Demo',
      showPageTitles: false,
      pages: [{ name: 'p1', title: 'Page 1 title', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] }],
    }

    cleanup()
    renderSurvey(withoutTitle)
    expect(screen.queryByText('Page 1 title')).not.toBeInTheDocument()
  })

  it('shows page numbers only when showPageNumbers=true', () => {
    const json = {
      title: 'Demo',
      showPageNumbers: true,
      pages: [
        { name: 'p1', elements: [{ type: 'text', name: 'q1', title: 'Q1' }] },
        { name: 'p2', elements: [{ type: 'text', name: 'q2', title: 'Q2' }] },
      ],
    }

    renderSurvey(json)
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument()
  })
})
