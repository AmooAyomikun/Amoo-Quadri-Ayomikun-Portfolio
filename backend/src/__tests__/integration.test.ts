process.env.NODE_ENV = 'test'
process.env.ADMIN_PASSWORD = 'test-admin-passphrase-secure-123'
process.env.ADMIN_TOKEN_SECRET = 'test-token-secret-for-integration-tests-123'

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../server.js'

describe('Backend Integration Test Suite (Issues 3.1 - 3.9)', () => {
  let adminCookie = ''

  // 1. Health check
  it('GET /api/health returns online status', async () => {
    const res = await request(app).get('/api/health')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.status, 'online')
  })

  // 2. Admin Auth & Cookie flow (Issue 2.10, 3.9)
  it('POST /api/admin/login rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ password: 'wrong-passphrase' })
    assert.strictEqual(res.status, 401)
  })

  it('POST /api/admin/login succeeds and sets httpOnly cookie on correct password', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ password: 'test-admin-passphrase-secure-123' })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
    assert.ok(res.body.token)

    const cookieHeader = res.headers['set-cookie']
    assert.ok(cookieHeader, 'Expected set-cookie header')
    const cookieStr = Array.isArray(cookieHeader) ? cookieHeader[0] : String(cookieHeader)
    assert.match(cookieStr, /admin_token=/)
    assert.match(cookieStr, /HttpOnly/i)
    adminCookie = cookieStr.split(';')[0]
  })

  it('GET /api/admin/verify rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/admin/verify')
    assert.strictEqual(res.status, 401)
  })

  it('GET /api/admin/verify accepts valid httpOnly admin cookie', async () => {
    const res = await request(app)
      .get('/api/admin/verify')
      .set('Cookie', adminCookie)
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
  })

  // 3. News Route (ISO sorting and validation) (Issue 3.2, 3.9)
  it('GET /api/news returns chronologically sorted articles', async () => {
    const res = await request(app).get('/api/news')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
    assert.ok(Array.isArray(res.body.data))
    if (res.body.data.length >= 2) {
      const firstDate = new Date(res.body.data[0].date).getTime()
      const secondDate = new Date(res.body.data[1].date).getTime()
      assert.ok(firstDate >= secondDate, 'Articles must be ordered descending by date')
    }
  })

  it('POST /api/news rejects without admin authentication', async () => {
    const res = await request(app)
      .post('/api/news')
      .send({
        title: 'Unauthorized Article',
        summary: 'This should not be published without admin auth.',
        content: 'Long enough content to pass schema validation checks.'
      })
    assert.strictEqual(res.status, 401)
  })

  it('POST /api/news publishes with valid admin cookie and stores ISO date', async () => {
    const res = await request(app)
      .post('/api/news')
      .set('Cookie', adminCookie)
      .send({
        title: 'New Research Paper Published',
        category: 'Research',
        summary: 'A new breakthrough study in software quality assurance has been released.',
        content: 'This is a detailed explanation of the methodology, datasets, and empirical findings.',
        tags: ['Research', 'Software Reliability']
      })
    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.success, true)
    assert.ok(res.body.data.date)
    // Date must be ISO 8601
    assert.ok(!isNaN(Date.parse(res.body.data.date)))
  })

  // 4. Contact Route (Validation, notification, honest UI wording) (Issue 3.4, 3.9)
  it('POST /api/contact validates input schema and returns 400 on invalid email', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Dr. Jane Smith',
        email: 'invalid-email-address',
        message: 'Interested in postgrad collaboration.'
      })
    assert.strictEqual(res.status, 400)
    assert.strictEqual(res.body.success, false)
  })

  it('POST /api/contact accepts valid submission and returns accurate response message', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Dr. Jane Smith',
        email: 'janesmith@university.edu',
        subject: 'Postgraduate Research Opening',
        message: 'We are impressed with your profile and would like to discuss research opportunities.',
        lens: 'research'
      })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
    assert.match(res.body.message, /communication portal/i)
  })

  // 5. Subscription & GDPR Unsubscribe Route (Issue 3.5, 3.9)
  it('POST /api/subscribe accepts subscriber with consent', async () => {
    const res = await request(app)
      .post('/api/subscribe')
      .send({ email: 'subscriber@academic-lab.org' })
    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.success, true)
  })

  it('POST /api/subscribe/unsubscribe allows subscriber to opt out', async () => {
    const res = await request(app)
      .post('/api/subscribe/unsubscribe')
      .send({ email: 'subscriber@academic-lab.org' })
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
    assert.match(res.body.message, /unsubscribed/i)
  })

  // 6. Guestbook Route (Pagination and profanity filter) (Issue 3.3, 3.9)
  it('GET /api/guestbook supports pagination query params', async () => {
    const res = await request(app)
      .get('/api/guestbook?limit=5')
    assert.strictEqual(res.status, 200)
    assert.ok(res.body.entries !== undefined)
    assert.ok(Array.isArray(res.body.entries))
  })

  it('POST /api/guestbook rejects inappropriate profanity language', async () => {
    const res = await request(app)
      .post('/api/guestbook')
      .send({
        name: 'Troll User',
        message: 'This message has inappropriate language: shit!'
      })
    assert.strictEqual(res.status, 400)
    assert.match(res.body.error, /inappropriate/i)
  })

  it('POST /api/guestbook accepts valid signature submission and preserves canvas signatureData', async () => {
    const validDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const res = await request(app)
      .post('/api/guestbook')
      .send({
        name: 'Prof. Adeleke',
        message: 'Brilliant portfolio and inspiring academic trajectory!',
        signatureData: validDataUrl,
        location: 'Ibadan, Nigeria'
      })
    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.name, 'Prof. Adeleke')
    assert.strictEqual(res.body.signatureData, validDataUrl)
  })

  // 7. SSRF-Safe Proxy Route (Issue 2.1, 3.9)
  it('GET /api/proxy blocks private internal IP addresses (SSRF prevention)', async () => {
    const res = await request(app).get('/api/proxy?url=http://169.254.169.254/latest/meta-data/')
    assert.strictEqual(res.status, 403)
  })

  it('GET /api/proxy blocks disallowed third-party hostnames', async () => {
    const res = await request(app).get('/api/proxy?url=https://attacker-controlled-site.com')
    assert.strictEqual(res.status, 403)
  })

  // 8. AI Chat Route (Length capping and cost abuse protection) (Issue 2.5, 3.9)
  it('POST /api/chat rejects prompt exceeding 500 characters', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Z'.repeat(501) })
    assert.strictEqual(res.status, 400)
  })

  it('POST /api/chat handles valid prompt', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Who is Quadri?' })
    assert.strictEqual(res.status, 200)
    assert.ok(res.body.reply)
    assert.match(res.body.reply, /Quadri/i)
  })

  // 9. Shared CV Route (Issue 3.6, 3.9)
  it('GET /api/cv returns structured CV data from shared package', async () => {
    const res = await request(app).get('/api/cv')
    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
    assert.strictEqual(res.body.data.personalInfo.fullName, 'QUADRI AYOMIKUN AMOO')
  })
})
