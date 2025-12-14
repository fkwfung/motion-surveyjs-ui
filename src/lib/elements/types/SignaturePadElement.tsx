import { useEffect, useRef, useState } from 'react'
import type { Question } from 'survey-core'
import { motion } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'

export function SignaturePadElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let ctx: CanvasRenderingContext2D | null = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      return
    }
    if (!ctx) return

    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.9)'

    const getPos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const scaleX = canvas.width / r.width
      const scaleY = canvas.height / r.height
      return {
        x: (e.clientX - r.left) * scaleX,
        y: (e.clientY - r.top) * scaleY,
      }
    }

    const onDown = (e: PointerEvent) => {
      drawing.current = true
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      const p = getPos(e)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }

    const onMove = (e: PointerEvent) => {
      if (!drawing.current) return
      const p = getPos(e)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      setHasInk(true)
    }

    const onUp = () => {
      if (!drawing.current) return
      drawing.current = false
      try {
        setQuestionValue(question, canvas.toDataURL('image/png'))
      } catch {
        // ignore
      }
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [question])

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      <div className="msj__signaturePadWrap">
        <motion.canvas
          ref={canvasRef}
          className="msj__signaturePad"
          width={560}
          height={160}
          initial={false}
          animate={hasInk ? { scale: 1 } : { scale: 1 }}
        />
        <button
          type="button"
          className="msj__miniButton"
          onClick={() => {
            const c = canvasRef.current
            let ctx: CanvasRenderingContext2D | null = null
            try {
              ctx = c?.getContext('2d') ?? null
            } catch {
              ctx = null
            }
            if (!c || !ctx) return
            ctx.clearRect(0, 0, c.width, c.height)
            setHasInk(false)
            setQuestionValue(question, undefined)
          }}
        >
          Clear
        </button>
      </div>

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
