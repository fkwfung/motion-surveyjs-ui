import type { Question } from 'survey-core'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import { Errors } from '../../ui/Errors'
import type { RenderOptions } from '../../ui/types'
import { getQuestionTitle } from '../getQuestionTitle'
import { getQuestionErrors } from '../getQuestionErrors'
import { setQuestionValue } from '../setQuestionValue'

export function BooleanElement({
  question,
  opts,
}: {
  question: Question
  opts: RenderOptions
}) {
  const q = question as any // Cast to any to access Boolean-specific props
  const title = getQuestionTitle(q, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(q) : []
  
  const labelTrue = q.labelTrue || "Yes"
  const labelFalse = q.labelFalse || "No"
  const valueTrue = q.valueTrue ?? true
  const valueFalse = q.valueFalse ?? false
  const swapOrder = q.swapOrder === true

  // Determine current selection state
  let currentValue: string | undefined
  if (q.value === valueTrue) currentValue = 'true'
  else if (q.value === valueFalse) currentValue = 'false'
  else if (q.value === true) currentValue = 'true'
  else if (q.value === false) currentValue = 'false'

  const handleValueChange = (val: string) => {
      const newValue = val === 'true' ? valueTrue : valueFalse
      setQuestionValue(q, newValue)
  }

  // Calculate handle position and width
  // Default: False (Left), True (Right)
  // Swap: True (Left), False (Right)
  
  let position = '50%'
  let x = '-50%'
  let width = '40px' // Small circle/pill when unchosen
  
  if (currentValue === 'true') {
      width = 'calc(50% - 6px)'
      if (swapOrder) {
          // True is Left
          position = '0%'
          x = '4px'
      } else {
          // True is Right
          position = '100%'
          x = 'calc(-100% - 4px)'
      }
  } else if (currentValue === 'false') {
      width = 'calc(50% - 6px)'
      if (swapOrder) {
          // False is Right
          position = '100%'
          x = 'calc(-100% - 4px)'
      } else {
          // False is Left
          position = '0%'
          x = '4px'
      }
  }

  const leftLabel = swapOrder ? labelTrue : labelFalse
  const rightLabel = swapOrder ? labelFalse : labelTrue
  const leftValue = swapOrder ? 'true' : 'false'
  const rightValue = swapOrder ? 'false' : 'true'

  return (
    <BaseElement element={q} opts={opts}>
      <div className="msj__label">
        {title}
        {q.isRequired ? <span aria-hidden> *</span> : null}
      </div>
      
      <RadioGroup.Root
        className="msj__toggleSwitch"
        value={currentValue}
        onValueChange={handleValueChange}
      >
         <div className="msj__toggleTrack" aria-hidden="true">
            <div className="msj__toggleTrackLabel msj__toggleTrackLabel--left">{leftLabel}</div>
            <div className="msj__toggleTrackLabel msj__toggleTrackLabel--right">{rightLabel}</div>
            
            <motion.div 
                className={`msj__toggleHandle ${currentValue === 'true' ? 'msj__toggleHandle--true' : currentValue === 'false' ? 'msj__toggleHandle--false' : ''}`}
                initial={false}
                animate={{ left: position, x, width }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                <motion.span
                  key={currentValue || 'empty'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {currentValue === 'true' ? labelTrue : currentValue === 'false' ? labelFalse : ''}
                </motion.span>
            </motion.div>
         </div>

         <div className="msj__toggleInputs">
            <RadioGroup.Item value={leftValue} className="msj__toggleInput" aria-label={leftLabel} />
            <RadioGroup.Item value={rightValue} className="msj__toggleInput" aria-label={rightLabel} />
         </div>
      </RadioGroup.Root>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
