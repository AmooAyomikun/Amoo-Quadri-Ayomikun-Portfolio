export interface NewsItem {
  id: string
  title: string
  /** ISO 8601 string (e.g. "2026-08-15T10:00:00.000Z") for chronological sorting */
  date: string
  category: 'Research' | 'Industry' | 'Academics' | 'Awards' | 'Technical' | 'General'
  summary: string
  content: string
  author: string
  readTime: string
  tags: string[]
  externalUrl?: string
  isPinned?: boolean
}

/** Utility to format an ISO 8601 news date into human-readable format e.g. "Aug 15, 2026" or "August 2026" */
export function formatNewsDate(dateString: string): string {
  if (!dateString) return ''
  const parsed = new Date(dateString)
  if (isNaN(parsed.getTime())) {
    return dateString
  }
  return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const initialNewsData: NewsItem[] = [
  {
    id: 'news-offline-first-blog',
    title: 'From Service Workers to Sync Queues: Engineering Resilient Offline-First Web Systems',
    date: '2026-10-20T11:00:00.000Z',
    category: 'Research',
    summary: 'An architectural deep-dive into how background sync queues, IndexedDB caching, and optimistic UI updates maintain resilience in high-latency network conditions.',
    content: `Building modern web applications that gracefully tolerate spotty connectivity requires moving beyond simple browser caching. In emerging markets and field environments, intermittent cell coverage is not an edge case—it is the baseline reality. During the development of CleanReport and my ongoing software engineering initiatives, I designed a multi-layer offline architecture that treats network absence as a standard operational state rather than an error condition.

## The Three-Tier Storage Hierarchy

A resilient offline architecture relies on three coordinated client-side layers:
1. **CacheStorage (via Service Workers):** Intercepts network fetch requests and serves pre-cached application shells (HTML, bundled scripts, stylesheets, and core icons) instantly with a cache-first or stale-while-revalidate strategy.
2. **IndexedDB for Structured Entities:** Stores persistent transaction logs, unsent user submissions, draft reports, and locally indexed queries. Unlike localStorage, IndexedDB is asynchronous, transactional, and handles multi-megabyte payloads without blocking the main browser thread.
3. **In-Memory State (React/State Managers):** Manages optimistic UI updates, ensuring that users receive immediate visual confirmation when they trigger actions, regardless of socket connectivity.

## Synchronization Queues & Conflict Resolution

When a user submits a report while disconnected, the payload is serialized and appended to an IndexedDB synchronization queue with a monotonic timestamp and an idempotent client UUID (e.g., submission-id-timestamp).

Once the browser fires the online event or the Service Worker receives a background sync trigger, the queue processor activates:
- It processes requests sequentially with exponential backoff to avoid overwhelming upstream endpoints upon reconnection.
- It verifies idempotency tokens on the server to prevent duplicate entries if a network handshake terminates mid-flight.
- If server-side schema validation fails, the item transitions to a "requires attention" queue instead of being silently dropped, alerting the user with an actionable remedy.

## Optimistic UI vs. Eventual Consistency

One of the most nuanced challenges in offline-first systems is managing user trust. When an action succeeds locally, the user interface should reflect the modification immediately while clearly communicating synchronization status. Using subtle micro-indicators (such as "Saved offline • Pending sync"), users feel in control and confident that their work will not disappear.

## Practical Takeaways for Web Engineers

1. **Never block user input on network roundtrips:** Record intent locally first, then broadcast asynchronously.
2. **Design idempotent APIs from day one:** Network retries must be safe and side-effect-free.
3. **Audit offline payload sizes:** Compress client-side images and binary blobs (using Canvas or Web Workers) before inserting them into IndexedDB queues.

As web applications continue to take over mission-critical enterprise and civic responsibilities, adopting offline-first paradigms is essential to delivering software that is genuinely accessible and reliable for everyone.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '4 min read',
    tags: ['Web Architecture', 'Offline Sync', 'Service Workers', 'IndexedDB', 'PWAs'],
    isPinned: true
  },
  {
    id: 'news-cleanreport-launch',
    title: 'CleanReport Civic-Tech PWA Successfully Deployed at Circo Digital Academy',
    date: '2026-08-15T10:00:00.000Z',
    category: 'Industry',
    summary: 'As sole frontend engineer on the 5-member team, I built CleanReport—a civic sanitation PWA supporting offline issue queueing and real-time map pinning.',
    content: `I am thrilled to share the successful deployment of CleanReport, a civic-technology sanitation platform developed during the intensive 8-week Orange Internship Programme at Circo Digital Academy. Serving as the sole frontend engineer in a dynamic, cross-functional team of five, I was tasked with architecture and building a robust, highly accessible user interface that empowers citizens to report environmental hazards seamlessly.

## Civic Engagement Through Offline-First Engineering

CleanReport was engineered as a Progressive Web Application (PWA) with a strong emphasis on offline resilience. In many metropolitan neighborhoods, cellular data coverage fluctuates dramatically. To guarantee that residents can document and report sanitation hazards without losing data, I implemented an automated synchronization pipeline utilizing Service Workers and IndexedDB.

When an environmental issue is captured offline, all telemetry—including compressed photo documentation and localized notes—is preserved locally. As soon as connectivity is restored, the application silently uploads the submission to the centralized triage dashboard.

## Geospatial Marker Positioning & Real-Time Triage

In addition to offline queueing, I integrated the HTML5 Geolocation API with interactive mapping tools, allowing users to accurately place map pins at hazard coordinates. Municipal triage personnel receive real-time alerts, image comparisons, and categorical severity flags.

This deployment represents the direct impact that user-centered software engineering can have on civic welfare and highlights the value of resilient web design in real-world environments.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['CleanReport PWA', 'Circo Digital Academy', 'React', 'Offline Sync'],
    isPinned: true
  },
  {
    id: 'news-dsu-assistantship',
    title: 'Appointed NYSC Research Assistant under Assoc. Prof. Jude Sinebe',
    date: '2025-09-01T09:00:00.000Z',
    category: 'Research',
    summary: 'Selected to join the Computer Science postgraduate research lab, investigating applied data science and software reliability.',
    content: `I am honored to announce my appointment as a Research Assistant within the Department of Computer Science, working under the guidance of Associate Professor Jude Sinebe for my National Youth Service Corps (NYSC) service year. This opportunity serves as a key bridge between theoretical computing research and practical software systems.

## Investigating Model Validation & Software Reliability

Our research within the postgraduate laboratory concentrates on empirical software quality assurance and computational intelligence. In particular, we are evaluating machine learning model reliability under non-stationary data distributions, testing how software fault-tolerance mechanisms perform when algorithmic predictions encounter distributional shift.

## Laboratory Workflow & Academic Collaboration

Collaborating in the lab involves architecting automated data pipelines, benchmark reproducibility frameworks, and statistical evaluation scripts in Python. Assisting in manuscript development and experimental design has deepened my methodology in algorithmic rigor, formal verification, and academic writing.

This assistantship continues to strengthen my foundations as I prepare for graduate studies (MSc/PhD) in Applied Artificial Intelligence and intelligent systems engineering.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Research Assistantship', 'Computer Science', 'Assoc. Prof. Jude Sinebe', 'Machine Learning'],
    isPinned: true
  },
  {
    id: 'news-best-graduating-awards',
    title: 'Awarded 4 Best Graduating Student Subject Honors at First Technical University',
    date: '2024-09-15T12:00:00.000Z',
    category: 'Awards',
    summary: 'Graduated in the Top 10% of Software Engineering class with a 4.45/5.00 Final CGPA and top marks in Operating Systems, HCI, SE Practice, and Data Structures.',
    content: `Graduating from First Technical University (now Abiola Ajimobi Technical University) with a 4.45 / 5.00 Final CGPA (Second-Class Upper Honors) and placing in the Top 10% of my class was an immensely proud milestone. During the university convocation, I was honored to receive the Best Graduating Student prize in four foundational software engineering disciplines.

## Four Core Subject Commendations

The awards recognized highest academic achievement across four critical areas:
- **Operating Systems I:** Low-level process scheduling, memory virtualization, and concurrent resource management.
- **Human Computer Interaction (HCI):** Accessibility heuristics, cognitive load modeling, and usability benchmarking.
- **Software Engineering Professional Practice:** Architectural design patterns, software ethics, and production verification.
- **Fundamentals of Data Structures:** Algorithmic complexity, tree/graph traversal paradigms, and memory-efficient data representation.

## Mentoring Over 350 Peers Through NASSA

Beyond academic coursework, my time at university was shaped by peer mentorship. Serving as an Academic Support Officer with the Nigerian Association of Software Science Analysts (NASSA), I conducted weekly tutorial sessions in algorithms and discrete mathematics for over 350 peers. Helping others demystify complex computing concepts reinforced my own mastery and instilled a deep respect for empathetic, clear technical communication.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Academic Excellence', 'Subject Honors', 'Valedictory', 'Top 10%'],
    isPinned: false
  },
  {
    id: 'news-thesis-recommendation-engine',
    title: 'Completed Undergraduate Research Thesis: Intelligent Location-Based Recommendation Systems',
    date: '2024-07-28T14:00:00.000Z',
    category: 'Research',
    summary: 'Under the supervision of Dr. J.E.T. Akinsola, engineered a hybrid recommendation engine bridging empirical machine learning with scalable web architecture.',
    content: `Supervised by Dr. J.E.T. Akinsola, my undergraduate thesis investigated algorithmic strategies for overcoming cold-start latency and geographic sparsity in location-aware recommendation engines.

## Hybrid Collaborative Filtering & Spatial Indexing

Traditional collaborative filtering models often break down when encountering new users or geographically dispersed points of interest. My thesis developed an integrated hybrid model combining user rating matrices with geospatial proximity scoring and contextual venue parameters.

The resulting research validated that hybrid weighting produces a 28% reduction in recommendation latency for sparse regional areas while improving precision metrics compared to standalone distance-based approaches. This project provided invaluable empirical training in machine learning model evaluation and scalable backend API design.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Recommendation Systems', 'Machine Learning', 'Dr. J.E.T. Akinsola', 'Undergraduate Thesis'],
    isPinned: false
  }
]
