import type { ChoiceItem, Question } from 'survey-core'
import { Reorder, motion, AnimatePresence } from 'motion/react'
import { BaseElement } from '../../ui/BaseElement'
import type { RenderOptions } from '../../ui/types'
import { Errors } from '../../ui/Errors'
import { getQuestionErrors } from '../getQuestionErrors'
import { getQuestionTitle } from '../getQuestionTitle'
import { setQuestionValue } from '../setQuestionValue'
import { RankingItem } from './RankingItem'

export function RankingElement({ question, opts }: { question: Question; opts: RenderOptions }) {
  const q = question as unknown as { visibleChoices?: ChoiceItem[] } & Record<string, any>
  const title = getQuestionTitle(question, opts)
  const errors = opts.validationSeq > 0 ? getQuestionErrors(question) : []
  const choices = q.visibleChoices ?? []

  const current = Array.isArray(question.value) ? (question.value as unknown[]) : []
  
  // Select to Rank logic
  const isSelectToRank = q.selectToRankEnabled === true
  const layout = q.selectToRankAreasLayout || 'horizontal'
  const emptyRankedText = q.selectToRankEmptyRankedAreaText || 'Drag items here to rank them'
  const emptyUnrankedText = q.selectToRankEmptyUnrankedAreaText || 'All items ranked'
  const longTap = q.longTap === true

  // If selectToRank, 'current' contains only ranked items.
  // If NOT selectToRank, 'current' usually contains all items (or we default to all).
  
  const all = isSelectToRank 
    ? current 
    : [...new Set([...current, ...choices.map((c) => c.value)])]

  const unranked = isSelectToRank
    ? choices.filter(c => !current.includes(c.value)).map(c => c.value)
    : []

  const onReorder = (newOrder: any[]) => {
    setQuestionValue(question, newOrder)
  }

  const addToRanked = (val: any) => {
    const next = [...current, val]
    setQuestionValue(question, next)
  }

  const removeFromRanked = (val: any) => {
    const next = current.filter(v => v !== val)
    setQuestionValue(question, next)
  }

  return (
    <BaseElement element={question} opts={opts}>
      <div className="msj__label">
        {title}
        {question.isRequired ? <span aria-hidden> *</span> : null}
      </div>

      {isSelectToRank ? (
        <div className={`msj__rankingContainer msj__rankingContainer--${layout}`}>
          <div className="msj__rankingArea">
            <div className="msj__rankingAreaTitle">Choices</div>
            {unranked.length === 0 && <div className="msj__rankingEmpty">{emptyUnrankedText}</div>}
            <motion.ul className="msj__ranking" layout>
              <AnimatePresence initial={false}>
                {unranked.map((v) => {
                  const valueStr = String(v)
                  const text = choices.find((c) => c.value === v)?.text ?? valueStr
                  return (
                    <motion.div key={valueStr} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                       <RankingItem 
                         value={v as string | number} 
                         text={text} 
                         onClick={() => addToRanked(v)}
                         isRanked={false}
                         longTap={longTap}
                         enableDrag={false}
                       />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.ul>
          </div>

          <div className="msj__rankingArea">
            <div className="msj__rankingAreaTitle">Ranked</div>
            {all.length === 0 && <div className="msj__rankingEmpty">{emptyRankedText}</div>}
            <Reorder.Group axis="y" values={all} onReorder={onReorder} className="msj__ranking">
              <AnimatePresence initial={false}>
                {all.map((v) => {
                  const valueStr = String(v)
                  const text = choices.find((c) => c.value === v)?.text ?? valueStr
                  return (
                     <RankingItem 
                       key={valueStr} 
                       value={v as string | number} 
                       text={text} 
                       onClick={() => removeFromRanked(v)}
                       isRanked={true}
                       longTap={longTap}
                     />
                  )
                })}
              </AnimatePresence>
            </Reorder.Group>
          </div>
        </div>
      ) : (
        <Reorder.Group axis="y" values={all} onReorder={onReorder} className="msj__ranking">
          {all.map((v, index) => {
            const valueStr = String(v)
            const text = choices.find((c) => c.value === v)?.text ?? valueStr
            
            const moveUp = () => {
              if (index > 0) {
                const next = [...all]
                const temp = next[index]
                next[index] = next[index - 1]
                next[index - 1] = temp
                onReorder(next)
              }
            }

            const moveDown = () => {
              if (index < all.length - 1) {
                const next = [...all]
                const temp = next[index]
                next[index] = next[index + 1]
                next[index + 1] = temp
                onReorder(next)
              }
            }

            return (
              <RankingItem 
                key={valueStr} 
                value={v as string | number} 
                text={text} 
                index={index}
                total={all.length}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                longTap={longTap} 
              />
            )
          })}
        </Reorder.Group>
      )}

      <Errors errors={errors} opts={opts} />
    </BaseElement>
  )
}
