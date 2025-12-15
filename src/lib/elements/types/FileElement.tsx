import { useState } from 'react'
import type { Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

type SurveyFileValue = { name: string; type: string; content: string }

async function fileToBase64(file: File): Promise<SurveyFileValue> {
  const content = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.readAsDataURL(file)
  })
  return { name: file.name, type: file.type, content }
}

export function FileElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { allowMultiple?: boolean }
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files: File[]) => {
    const out = await Promise.all(files.map(fileToBase64))
    setQuestionValue(question, q.allowMultiple === true ? out : out[0] ?? undefined)
  }

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <motion.div
        className="msj__fileDropZone"
        initial={false}
        animate={dragOver ? { scale: 1.02, borderColor: 'var(--msj-primary)' } : { scale: 1, borderColor: 'var(--msj-border)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={async (e) => {
          e.preventDefault()
          setDragOver(false)
          const files = Array.from(e.dataTransfer.files)
          if (files.length > 0) await handleFiles(files)
        }}
      >
        <input
          className="msj__fileInput"
          type="file"
          multiple={q.allowMultiple === true}
          onChange={async (e) => {
            const files = Array.from(e.currentTarget.files ?? [])
            await handleFiles(files)
          }}
        />
        <span className="msj__fileDropText">
          {dragOver ? 'Drop files here' : 'Click or drag files here'}
        </span>
      </motion.div>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
