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
      ],
    },
    {
      name: 'page2',
      elements: [
        { type: 'comment', name: 'notes', title: 'Notes', maxWordCount: 200 },
        { type: 'boolean', name: 'optIn', title: 'Email me updates' },
        {
          type: 'dropdown',
          name: 'framework',
          title: 'Preferred framework',
          choices: ['React', 'Vue', 'Angular'],
        },
      ],
    },
    {
      name: 'page3',
      title: 'More element types',
      elements: [
        {
          type: 'html',
          name: 'htmlIntro',
          html: '<p><strong>Demo:</strong> these are additional SurveyJS element types rendered by the library.</p>',
        },
        {
          type: 'image',
          name: 'heroImage',
          imageLink: 'https://placehold.co/900x240/png?text=Motion+SurveyJS+UI',
        },
        {
          type: 'rating',
          name: 'rating',
          title: 'How likely are you to recommend this?',
          rateMin: 1,
          rateMax: 5,
        },
        {
          type: 'multipletext',
          name: 'profile',
          title: 'Profile',
          items: [
            { name: 'first', title: 'First name' },
            { name: 'last', title: 'Last name' },
          ],
        },
        {
          type: 'matrix',
          name: 'matrix',
          title: 'Pick one per row',
          rows: ['UX', 'Performance'],
          columns: ['Low', 'OK', 'Great'],
        },
        {
          type: 'tagbox',
          name: 'tags',
          title: 'Pick tags',
          choices: ['Radix UI', 'motion.dev', 'SurveyJS'],
        },
        {
          type: 'buttongroup',
          name: 'size',
          title: 'T-shirt size',
          choices: ['S', 'M', 'L'],
        },
        {
          type: 'imagepicker',
          name: 'logo',
          title: 'Pick a logo',
          showLabel: true,
          choices: [
            { value: 'a', text: 'A', imageLink: 'https://placehold.co/240x140/png?text=A' },
            { value: 'b', text: 'B', imageLink: 'https://placehold.co/240x140/png?text=B' },
          ],
        },
        {
          type: 'ranking',
          name: 'rank',
          title: 'Rank the features',
          choices: ['Accessibility', 'Performance', 'Motion'],
        },
        { type: 'file', name: 'file', title: 'Upload a file' },
        { type: 'signaturepad', name: 'sig', title: 'Signature' },
        {
          type: 'paneldynamic',
          name: 'team',
          title: 'Team members',
          panelCount: 1,
          templateElements: [{ type: 'text', name: 'name', title: 'Member name', isRequired: true }],
        },
        {
          type: 'flowpanel',
          name: 'flow',
          title: 'Flow panel',
          elements: [{ type: 'text', name: 'flowQ1', title: 'Inside flow panel' }],
        },
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
