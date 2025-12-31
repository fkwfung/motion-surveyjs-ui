import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MotionSurvey } from '../MotionSurvey'

export function renderSurvey(json: Record<string, unknown>, ui?: ReactElement) {
  const user = userEvent.setup()
  render(ui ?? <MotionSurvey json={json} />)
  return { user }
}
