import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getSmartPortfolioReply } from '../controllers/aiController.js'

describe('AI Controller & Fallback Logic (backend/src/controllers/aiController.ts)', () => {
  it('handles help command', () => {
    const reply = getSmartPortfolioReply('help')
    assert.match(reply, /AVAILABLE COMMANDS/i)
  })

  it('handles about / bio queries', () => {
    const reply = getSmartPortfolioReply('about')
    assert.match(reply, /Quadri Ayomikun Amoo/i)
    assert.match(reply, /5.0\/5.0 Major GPA/i)
  })

  it('handles education queries with accurate degree classification', () => {
    const reply = getSmartPortfolioReply('where did he study?')
    assert.match(reply, /Abiola Ajimobi Technical University/i)
    assert.match(reply, /Second-Class Upper Honors/i)
    assert.match(reply, /5.0\/5.0 Major GPA/i)
  })

  it('handles skills queries', () => {
    const reply = getSmartPortfolioReply('what skills and languages does he know?')
    assert.match(reply, /React/i)
    assert.match(reply, /TypeScript/i)
    assert.match(reply, /Python/i)
  })

  it('handles projects queries', () => {
    const reply = getSmartPortfolioReply('what projects has he built?')
    assert.match(reply, /CleanReport/i)
    assert.match(reply, /Hotel Recommender/i)
  })

  it('handles contact queries', () => {
    const reply = getSmartPortfolioReply('how to contact or email him?')
    assert.match(reply, /amooquadri555@gmail.com/i)
    assert.match(reply, /github.com\/AmooAyomikun/i)
  })

  it('handles casual greetings', () => {
    const reply = getSmartPortfolioReply('hello')
    assert.match(reply, /Quadri's AI Assistant/i)
  })

  it('provides a helpful menu for unrecognized queries', () => {
    const reply = getSmartPortfolioReply('quantum teleportation')
    assert.match(reply, /You can ask me about:/i)
  })
})
