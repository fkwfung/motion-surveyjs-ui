import { useState } from 'react'
import './App.css'
import { MotionSurvey } from './lib/MotionSurvey'
import surveyFeature from './survey-feature.json'
import surveyBranding from './survey-branding.json'
import surveyLocale from './survey-locale.json'
import surveyHtml from './survey-html.json'
import surveyBilingual from './survey-bilingual.json'

type SurveyType = 'feature' | 'branding' | 'locale' | 'html' | 'bilingual' | null

function App() {
  const [activeSurvey, setActiveSurvey] = useState<SurveyType>(null)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  const getSurveyJson = (type: SurveyType) => {
    switch (type) {
      case 'feature': return surveyFeature
      case 'branding': return surveyBranding
      case 'locale': return surveyLocale
      case 'html': return surveyHtml
      case 'bilingual': return surveyBilingual
      default: return {}
    }
  }

  if (!activeSurvey) {
    return (
      <div className="demo-home">
        <h1>Motion SurveyJS UI Demo</h1>
        <div className="demo-grid">
          <button onClick={() => setActiveSurvey('feature')} className="demo-card">
            <h3>Feature Demo</h3>
            <p>Showcase of all supported element types and animations.</p>
          </button>
          <button onClick={() => setActiveSurvey('branding')} className="demo-card">
            <h3>Branding & Pages</h3>
            <p>Logo, background image, and multi-page navigation.</p>
          </button>
          <button onClick={() => setActiveSurvey('locale')} className="demo-card">
            <h3>Localization</h3>
            <p>Multi-language support (English, German, French).</p>
          </button>
          <button onClick={() => setActiveSurvey('bilingual')} className="demo-card">
            <h3>Bilingual (Multi-line)</h3>
            <p>English and Traditional Chinese in single text blocks.</p>
          </button>
          <button onClick={() => setActiveSurvey('html')} className="demo-card">
            <h3>HTML Rendering</h3>
            <p>Custom HTML for questions, completion, and loading states.</p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="demo">
      <div className="demo__header">
        <button onClick={() => { setActiveSurvey(null); setResult(null) }} className="demo__back">
          ← Back to Home
        </button>
      </div>
      <MotionSurvey
        json={getSurveyJson(activeSurvey)}
        onComplete={(data) => setResult(data)}
        className="demo__survey"
        locale={activeSurvey === 'locale' ? 'en-US' : undefined} // Default, can be switched in survey if UI supports it, or we can add a selector
      />

      {result ? (
        <pre className="demo__result">{JSON.stringify(result, null, 2)}</pre>
      ) : null}
    </div>
  )
}

export default App
