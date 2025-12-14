import { useState } from 'react'
import './App.css'
import { MotionSurvey } from './lib/MotionSurvey'
import surveyJson from './survey-data.json'

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
