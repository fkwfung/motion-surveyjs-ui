import { useState } from 'react'
import './App.css'
import { MotionSurvey } from './lib/MotionSurvey'

const surveyJson = {
  title: 'Motion SurveyJS UI (demo)',
  pages: [
    {
      name: 'page1',
      elements: [
        { type: 'text', name: 'name', title: 'Your name', isRequired: true },
        {
          type: 'radiogroup',
          name: 'role',
          title: 'Your role',
          choices: ['Developer', 'Designer', 'PM'],
          isRequired: true,
        },
        {
          type: 'checkbox',
          name: 'topics',
          title: 'Topics you care about',
          choices: ['Themes', 'Animations', 'Accessibility'],
        },
        { type: 'comment', name: 'notes', title: 'Notes' },
        { type: 'boolean', name: 'optIn', title: 'Email me updates' },
      ],
    },
  ],
}

function App() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  return (
    <div className="demo">
      <MotionSurvey
        json={surveyJson}
        onComplete={(data) => setResult(data)}
        className="demo__survey"
      />

      {result ? (
        <pre className="demo__result">{JSON.stringify(result, null, 2)}</pre>
      ) : null}
    </div>
  )
}

export default App
