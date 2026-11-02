# Engineering Architecture & Audit Log

This document serves as the canonical audit log, traceability matrix, and engineering rationale for the improvements across the Amoo Quadri Portfolio monorepo.

---

## Section 1: UI & Layout System

| Issue | Severity | Topic | Rationale & Resolution |
| :--- | :--- | :--- | :--- |
| **1.1** | 🔴 | Responsive Sidebars | Fixed sidebars overlapping content on intermediate viewports. Adjusted breakpoint visibility and added z-index isolation. |
| **1.2** | 🟠 | Theme Switcher Flash | Synchronous head script added to check `localStorage` and system preferences before initial paint, eliminating white flash. |
| **1.3** | 🟠 | Color Contrast Ratios | Adjusted low-contrast muted typography (`#8892b0`) on dark backgrounds to meet WCAG AA standards. |
| **1.4** | 🟡 | Layout Shift (CLS) | Added explicit aspect ratio wrappers for images, interactive canvas, and map projections to eliminate layout shifts. |

---

## Section 2: Backend Security & Hardening

| Issue | Severity | Topic | Rationale & Resolution |
| :--- | :--- | :--- | :--- |
| **2.1** | 🔴 | SSRF Prevention | Implemented strict IP and host validation on `/api/proxy` to reject internal, private (RFC 1918), and loopback addresses. |
| **2.2** | 🟠 | Reverse Proxy Resolution | Enabled `app.set('trust proxy', 1)` in Express to ensure accurate client IP hashing behind Render and Cloudflare. |
| **2.3** | 🟠 | Geolocation Bounds | Added Zod schema bounds `[-90, 90]` for latitude and `[-180, 180]` for longitude to reject malformed visitor logs. |
| **2.4** | 🟠 | Input Sanitization | Applied Zod validation and URI scheme validation to reject `javascript:` links and invalid email addresses. |
| **2.5** | 🟠 | AI Cost & Prompt Capping | Capped AI terminal inputs to 500 characters and rate-limited chat requests to prevent API credit exhaustion. |
| **2.6** | 🟡 | CORS Hardening | Replaced permissive wildcard CORS with explicit allowed origins (`amoo-quadri.vercel.app`, `amooquadri.dev`, localhost). |
| **2.7** | 🟡 | Error Handling | Ensured global error handlers always return structured JSON (`{ error: ... }`) without leaking internal stack traces. |
| **2.8** | 🟡 | Security Headers | Configured Helmet with CSP, HSTS, and X-Content-Type-Options, alongside Gzip response compression. |
| **2.9** | 🟡 | Rate Limiting | Implemented per-IP rate limiting across sensitive endpoints (`/api/chat`, `/api/guestbook`, `/api/contact`). |
| **2.10** | 🟠 | Admin Cookie Auth | Converted localStorage authentication tokens to secure `httpOnly`, `sameSite`, and `secure` cookies. |

---

## Section 3: Backend Architecture & Reliability

| Issue | Severity | Topic | Rationale & Resolution |
| :--- | :--- | :--- | :--- |
| **3.1** | 🔴 | Firestore Single Source of Truth | Unified news, guestbook, and visitors data persistence in Firestore to eliminate state loss on server reboots. |
| **3.2** | 🟠 | ISO 8601 Sorting | Switched date representations to standardized ISO 8601 strings for stable chronological sorting. |
| **3.3** | 🟠 | Pagination & Memory Bounds | Added cursor and limit parameters to `/api/guestbook` to prevent unbounded memory growth. |
| **3.4** | 🟠 | Contact Notification & Feedback | Implemented non-blocking email delivery via Resend with accurate UI confirmation. |
| **3.5** | 🟡 | GDPR Unsubscribe | Added tokenized opt-out route (`/api/subscribe/unsubscribe`) for newsletter privacy compliance. |
| **3.6** | 🟡 | Shared Workspace Package | Extracted CV types and data structures into `shared/` workspace package shared by frontend and backend. |
| **3.7** | 🟡 | Layered Architecture | Separated monolith controllers into Clean Architecture layers: controllers, services, repositories, and routes. |
| **3.8** | 🟡 | GitHub Contributions API | Switched to GitHub GraphQL API with 1-hour cache and REST fallback to avoid brittle HTML scraping. |
| **3.9** | 🟡 | Automated Integration Tests | Built Supertest and Node Test Runner integration suite testing routes, auth, schemas, and SSRF defenses. |

---

## Section 4: Frontend Code Quality & Performance

| Issue | Severity | Topic | Rationale & Resolution |
| :--- | :--- | :--- | :--- |
| **4.1** | 🟠 | PageContainer Component | Unified container max-widths and responsive padding into `<PageContainer />` used across all routed views. |
| **4.2** | 🟠 | Large Component Extraction | Extracted modular subcomponents and hooks (`useVisitorStats`, `useTypewriter`, `VisitorMapChart`, `VisitorLeaderboard`). |
| **4.3** | 🟠 | Unified Data Fetching | Replaced raw `useEffect` fetches with standardized `useApi` hook supporting loading, error, and cancellation states. |
| **4.4** | 🟠 | Preloader Session Throttling | Configured `<Preloader />` to display once per session via `sessionStorage`, optimizing subsequent page visits. |
| **4.5** | 🟡 | Dynamic Imports & Code Splitting | Lazy-loaded routed pages (`React.lazy`) with suspense boundaries for reduced initial JavaScript bundle size. |
| **4.6** | 🟡 | Canvas Resize Stroke Preservation | Added in-progress stroke preservation to SignatureCanvas during browser resize events. |
| **4.7** | 🟡 | Dark Mode Signature Inversion | Configured CSS `invert` only in dark mode so handwritten black ink displays cleanly in light mode. |
| **4.8** | 🟡 | Accessibility & Reduced Motion | Integrated axe-core audit in dev mode and respected `prefers-reduced-motion` in animations and typewriter effects. |
| **4.9** | 🟡 | E2E Smoke Tests | Configured Playwright smoke test suite verifying all routes render without console errors. |

---

## Section 5: SEO & Deployment

| Issue | Severity | Topic | Rationale & Resolution |
| :--- | :--- | :--- | :--- |
| **5.1** | 🟠 | Canonical Domain Consolidation | Reconciled `amoo-quadri.vercel.app` as canonical across SEO, sitemap, CORS, and AI prompt; configurable via env. |
| **5.2** | 🟠 | Build-Time Sitemap | Replaced hand-written sitemap with automated `generate-sitemap.mjs` script emitting valid canonical routes and dynamic `lastmod`. |
| **5.3** | 🟠 | SPA Social Preview Prerendering | Created `prerender-meta.mjs` generating static HTML files per route with customized OpenGraph and Twitter Cards for crawlers. |
| **5.4** | 🟡 | Environment-Driven API Base URL | Added build-time verification for `VITE_API_URL` and created `.env.example` templates. |
| **5.5** | 🟡 | Render Cold-Start Resilience | Added keep-alive `/api/health` pings, skeleton placeholder states, and informative "Waking Server" notices. |

---

## Section 6: Repo Hygiene & Professionalism

| Issue | Severity | Topic | Rationale & Resolution |
| :--- | :--- | :--- | :--- |
| **6.1** | 🔴 | Git Cache Cleaning | Removed tracked sensitive data files (`visitors.json`, `guestbook.json`, `news.json`) from git history cache. |
| **6.2** | 🟠 | Monorepo README | Replaced default Vite template with detailed documentation covering architecture, stack, setup, testing, and deployment. |
| **6.3** | 🟡 | Script Organization | Removed stray root scripts and moved reusable database maintenance utilities into `backend/scripts/`. |
| **6.4** | 🟡 | GitHub Actions CI | Added `.github/workflows/ci.yml` running typecheck, oxlint, unit/integration tests, and production build on every PR. |
| **6.5** | 🟡 | Audit Traceability | Created `docs/AUDIT_LOG.md` linking and explaining all engineering audit items and design decisions. |
