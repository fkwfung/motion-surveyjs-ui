import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('schema alignment (surveyjs_definition.json)', () => {
  it('showQuestionNumbers enum includes on/onPage/off', () => {
    const schemaPath = resolve(process.cwd(), 'schema/surveyjs_definition.json')
    const text = readFileSync(schemaPath, 'utf8')

    // Keep this check lightweight: confirm the top-level enum contains the values we implement.
    expect(text).toMatch(/"showQuestionNumbers"\s*:\s*\{[\s\S]*?"enum"\s*:\s*\[[\s\S]*?"on"[\s\S]*?"onPage"[\s\S]*?"off"/)
  })
})
