import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  publishNewsSchema,
  contactMessageSchema,
  subscribeSchema,
  aiChatSchema,
  visitorLogSchema
} from '../middleware/validate.js'

describe('Backend Security & Validation Schemas (Issues 2.1 - 2.10)', () => {
  it('publishNewsSchema: rejects non-string title or missing fields (Issue 2.4)', () => {
    // Non-string title crashes unvalidated title.trim()
    const resultInvalidType = publishNewsSchema.safeParse({
      title: 12345,
      summary: 'Valid summary text that meets length requirement',
      content: 'This is sufficiently long content for an article to pass the minimum requirement.'
    })
    assert.strictEqual(resultInvalidType.success, false)

    // Missing summary
    const resultMissing = publishNewsSchema.safeParse({
      title: 'Valid Title'
    })
    assert.strictEqual(resultMissing.success, false)
  })

  it('publishNewsSchema: blocks javascript: XSS URLs in externalUrl (Issue 2.4)', () => {
    const resultXss = publishNewsSchema.safeParse({
      title: 'Valid Announcement Title',
      summary: 'A valid summary describing the announcement.',
      content: 'A detailed content description that provides valuable context and information for readers.',
      externalUrl: 'javascript:alert(document.cookie)'
    })
    assert.strictEqual(resultXss.success, false)

    const resultValid = publishNewsSchema.safeParse({
      title: 'Valid Announcement Title',
      summary: 'A valid summary describing the announcement.',
      content: 'A detailed content description that provides valuable context and information for readers.',
      externalUrl: 'https://github.com/AmooAyomikun'
    })
    assert.strictEqual(resultValid.success, true)
  })

  it('aiChatSchema: caps prompt at 500 characters to prevent cost abuse (Issue 2.5)', () => {
    const validPrompt = 'Can you describe Quadri\'s research background?'
    const resultValid = aiChatSchema.safeParse({ message: validPrompt })
    assert.strictEqual(resultValid.success, true)

    const longPrompt = 'A'.repeat(501)
    const resultTooLong = aiChatSchema.safeParse({ message: longPrompt })
    assert.strictEqual(resultTooLong.success, false)

    const emptyPrompt = '   '
    const resultEmpty = aiChatSchema.safeParse({ message: emptyPrompt })
    assert.strictEqual(resultEmpty.success, false)
  })

  it('visitorLogSchema: validates latitude [-90, 90] and longitude [-180, 180] (Issue 2.3)', () => {
    const validCoords = {
      country: 'United Kingdom',
      countryCode: 'GB',
      city: 'London',
      lat: 51.5074,
      lon: -0.1278
    }
    const resultValid = visitorLogSchema.safeParse(validCoords)
    assert.strictEqual(resultValid.success, true)

    const invalidLat = {
      ...validCoords,
      lat: 120.5 // Out of range
    }
    const resultInvalidLat = visitorLogSchema.safeParse(invalidLat)
    assert.strictEqual(resultInvalidLat.success, false)

    const invalidLon = {
      ...validCoords,
      lon: -250 // Out of range
    }
    const resultInvalidLon = visitorLogSchema.safeParse(invalidLon)
    assert.strictEqual(resultInvalidLon.success, false)
  })

  it('contactMessageSchema & subscribeSchema: enforce valid email format (Issue 2.4)', () => {
    const resultInvalidContact = contactMessageSchema.safeParse({
      name: 'John Doe',
      email: 'not-an-email',
      message: 'Hello, this is a test message.'
    })
    assert.strictEqual(resultInvalidContact.success, false)

    const resultValidContact = contactMessageSchema.safeParse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'Hello, this is a valid test message.'
    })
    assert.strictEqual(resultValidContact.success, true)

    const resultInvalidSub = subscribeSchema.safeParse({
      email: 'bad-email'
    })
    assert.strictEqual(resultInvalidSub.success, false)
  })
})
