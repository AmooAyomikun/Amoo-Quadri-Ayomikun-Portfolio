export interface NewsItem {
  id: string
  title: string
  /** ISO 8601 string (e.g. "2026-08-15T10:00:00.000Z") for chronological sorting */
  date: string
  category: 'Research' | 'Industry' | 'Academics' | 'Awards'
  summary: string
  content: string
  author: string
  readTime: string
  tags: string[]
  externalUrl?: string
  isPinned?: boolean
  imageUrl?: string
  type?: 'news' | 'blog'
  readersCount?: number
}

/** Utility to format an ISO 8601 news date into human-readable format e.g. "Aug 2026" */
export function formatNewsDate(dateString: string): string {
  if (!dateString) return ''
  const parsed = new Date(dateString)
  if (isNaN(parsed.getTime())) {
    return dateString
  }
  return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const initialNewsData: NewsItem[] = [
  // ==========================================
  // OFFICIAL NEWS & ANNOUNCEMENTS ABOUT QUADRI
  // ==========================================
  {
    id: 'news-cleanreport-launch',
    title: 'CleanReport Civic-Tech PWA Successfully Deployed at Circo Digital Academy',
    date: '2026-08-15T10:00:00.000Z',
    category: 'Industry',
    type: 'news',
    imageUrl: '/cleanreport_ui.png',
    readersCount: 28,
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
    type: 'news',
    imageUrl: '/delta-state-uni.png',
    readersCount: 34,
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
    type: 'news',
    imageUrl: '/abiola-ajimobi-1.png',
    readersCount: 42,
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
    type: 'news',
    imageUrl: '/hotel_recommendation.png',
    readersCount: 22,
    summary: 'Under the supervision of Dr. J.E.T. Akinsola, engineered a hybrid recommendation engine bridging empirical machine learning with scalable web architecture.',
    content: `Supervised by Dr. J.E.T. Akinsola, my undergraduate thesis investigated algorithmic strategies for overcoming cold-start latency and geographic sparsity in location-aware recommendation engines.

## Hybrid Collaborative Filtering & Spatial Indexing

Traditional collaborative filtering models often break down when encountering new users or geographically dispersed points of interest. My thesis developed an integrated hybrid model combining user rating matrices with geospatial proximity scoring and contextual venue parameters.

The resulting research validated that hybrid weighting produces a 28% reduction in recommendation latency for sparse regional areas while improving precision metrics compared to standalone distance-based approaches. This project provided invaluable empirical training in machine learning model evaluation and scalable backend API design.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Recommendation Systems', 'Machine Learning', 'Dr. J.E.T. Akinsola', 'Undergraduate Thesis'],
    isPinned: false
  },

  // ==========================================
  // BLOG POSTS & TECH ARTICLES (RELATABLE STORIES)
  // ==========================================
  {
    id: 'blog-offline-first-cleanreport-architecture',
    title: 'Building for Unstable Networks: The Architecture of Offline-First Web Apps',
    date: '2026-10-06T10:00:00.000Z',
    category: 'Industry',
    type: 'blog',
    imageUrl: '/cleanreport.png',
    readersCount: 18,
    summary: 'In local development, API requests resolve in 40ms on fast broadband. In real urban field testing, cellular packets drop unpredictably. Here is how we engineered CleanReport with IndexedDB queueing and Service Worker background sync.',
    content: `In web development tutorials, API requests resolve in 40 milliseconds on gigabit fiber. Servers never drop sockets mid-flight, and state management libraries appear effortless.

Then you test real software in urban field environments, and network connectivity drops unexpectedly.

## The Reality of Field Testing

During the intensive 8-week Orange Internship Programme at Circo Digital Academy, our cross-functional team built **CleanReport**—a civic-tech platform empowering residents to document and report sanitation hazards directly to municipal authorities.

When testing in the field, we immediately encountered real-world networking constraints: spotty cell towers, intermittent handshakes, and packet loss. Submitting a hazard report over a weak signal frequently caused timeouts. If an application requires a live connection just to capture a form, users simply abandon it.

## Designing the Offline-First Pipeline

As the sole frontend engineer on the team, I designed an offline resilience pipeline with three core layers:

1. **Client-Side Persistence with IndexedDB:** When a user taps "Submit Report," the incident details, photos, and GPS coordinates are immediately persisted to local IndexedDB storage. The UI responds instantaneously without waiting for a server round-trip.
2. **Service Worker Background Sync:** A background worker monitors connectivity state changes. Once the device re-establishes an internet connection, pending records in the sync queue are processed sequentially.
3. **Idempotent API Mutations:** Every queued report receives a client-generated UUID. If a network blip occurs mid-upload, retry attempts carry the same identifier, preventing duplicated hazard tickets on the server.

Building CleanReport demonstrated that resilient software engineering requires designing for real-world constraints from day one, not as an afterthought.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '5 min read',
    tags: ['Web Architecture', 'Offline Sync', 'Service Workers', 'CleanReport', 'IndexedDB'],
    isPinned: true
  },
  {
    id: 'blog-machine-learning-reliability',
    title: 'Under the Hood of Machine Learning: Why 92% Accuracy in the Lab Often Falls Apart in the Wild',
    date: '2026-09-22T10:00:00.000Z',
    category: 'Research',
    type: 'blog',
    imageUrl: '/algorithmic_bias.png',
    readersCount: 25,
    summary: 'A high validation score on a curated dataset feels triumphant. But in production, distribution shift and silent failures test real resilience. Here is how we evaluate software reliability in applied ML.',
    content: `In academic benchmarks and Kaggle competitions, machine learning models look invincible. You split a curated dataset 80/20, run a training loop, and get an impressive 92.4% validation accuracy.

Then you deploy that model to production, and within weeks, users report unexpected failures, skewed predictions, and edge-case errors.

## The Problem of Distributional Shift

As an NYSC Research Assistant under **Associate Professor Jude Sinebe** in the Computer Science postgraduate research laboratory, my core work investigates empirical model validation and software reliability.

In real-world environments, input distributions are rarely static:
- **Covariate Shift:** Production inputs diverge from the training distribution due to camera sensor variations, user behavioral changes, and temporal trends.
- **Silent Degradation:** Unlike a web server that logs a 500 status code when an exception occurs, a predictive model silently returns low-quality outputs with artificially high confidence.

## Building Guardrails for AI Systems

Our lab focuses on integrating classical software quality assurance into predictive pipelines:
- **Uncertainty Calibration:** When prediction entropy exceeds a predefined safety boundary, the system delegates to a deterministic fallback or prompts human review.
- **Continuous Distribution Monitoring:** Automated telemetry tracks incoming feature distributions to detect drift before end users experience degraded performance.

True AI engineering is about building the architectural guardrails that keep systems trustworthy when unexpected inputs occur.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '6 min read',
    tags: ['Applied AI', 'Machine Learning', 'Research Assistantship', 'Software Reliability', 'Prof Jude Sinebe'],
    isPinned: true
  },
  {
    id: 'blog-mentoring-clear-engineering',
    title: 'What Mentoring 350+ Students Taught Me: The Best Engineers Explain Things Like They’re Talking to a Friend',
    date: '2026-09-08T10:00:00.000Z',
    category: 'Academics',
    type: 'blog',
    imageUrl: '/abiola-ajimobi-2.png',
    readersCount: 31,
    summary: 'As an Academic Support Officer breaking down algorithms and discrete structures for peers, I learned that great software engineering isn’t about complex jargon—it’s about absolute clarity.',
    content: `Every weekend at First Technical University, I held tutorial workshops for over a hundred software engineering and computer science students. The whiteboards were covered with recurrence trees, graph traversals, and dynamic programming formulations.

Many students arrived overwhelmed by theoretical definitions. By the time the session ended, they were actively discussing edge cases and implementing clean algorithms.

Serving as an Academic Support Officer for NASSA taught me one of the most important lessons of my engineering career: **clarity is the ultimate indicator of mastery.**

## The Illusion of Complexity

Early in their careers, developers often think that using dense terminology makes their work sound more advanced. But in practice, overly complex explanations obscure understanding and create architectural confusion.

When explaining data structures:
- Describing a linked list with textbook jargon often confuses junior students.
- Describing it as a sequence where each item simply holds a key and an address to the next item makes the concept immediately intuitive.

## Code as Communication

The exact same principle governs production code:
- Clear variable and function names eliminate the need for redundant commentary.
- Clean system interfaces make components easy to test and reason about.
- Meaningful pull request summaries explain the *intent* of an architectural change.

The best engineers treat code not just as instructions for a compiler, but as a communication tool for human collaborators.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '4 min read',
    tags: ['Mentorship', 'Leadership', 'NASSA', 'Communication', 'Engineering Mindset'],
    isPinned: false
  },
  {
    id: 'blog-recommendation-systems-cold-start',
    title: 'Overcoming the Cold-Start Problem: Lessons from Building a Location-Based Recommendation Engine',
    date: '2026-08-24T10:00:00.000Z',
    category: 'Research',
    type: 'blog',
    imageUrl: '/hotel_recommendation.png',
    readersCount: 20,
    summary: 'How do you recommend the right venue when a user has zero historical ratings? A deep dive into geospatial weighting, hybrid collaborative filtering, and spatial indexing.',
    content: `Recommendation engines power modern streaming, e-commerce, and discovery platforms. But what happens when a brand-new user signs up, or a traveler arrives in a region with sparse rating data?

This classic challenge—the **cold-start problem**—was the central investigation of my undergraduate thesis under the supervision of **Dr. J.E.T. Akinsola**.

## The Limits of Standalone Collaborative Filtering

Standard collaborative filtering models rely on historical user-item rating matrices. When interactions are sparse, these models struggle to provide relevant recommendations.

In local hospitality discovery, physical geography is a hard constraint. A venue with glowing reviews is irrelevant if it is geographically inaccessible to the user. Conversely, sorting purely by shortest distance frequently surfaces low-quality recommendations.

## Designing a Hybrid Spatial Approach

To address this balance, we engineered a hybrid recommendation model that combines:
- **Spatial Proximity Indexing:** Geohashing pre-filters venues within feasible travel boundaries, drastically reducing search space.
- **Contextual Feature Matching:** Weighting explicit user preferences (such as quiet working spaces or specific amenities).
- **Matrix Factorization:** Blending latent user preference vectors when historical interactions become available.

Our benchmarks demonstrated a **28% reduction in recommendation latency** in sparse data regions compared to unindexed algorithms, showing how spatial heuristics can directly improve machine learning efficiency.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '5 min read',
    tags: ['Recommendation Systems', 'Machine Learning', 'Dr. J.E.T. Akinsola', 'Spatial Data'],
    isPinned: false
  },
  {
    id: 'blog-beyond-leetcode-production-reality',
    title: 'Beyond LeetCode: What Actually Breaks When You Ship Software to Real Users',
    date: '2026-08-10T10:00:00.000Z',
    category: 'Industry',
    type: 'blog',
    imageUrl: '/dispatchlane_ui.png',
    readersCount: 29,
    summary: 'Algorithmic puzzles teach you O(n) runtime complexity, but real production outages almost always come from unhandled network timeouts, unexpected null pointers, and asynchronous race conditions.',
    content: `Algorithmic interview puzzles test your ability to balance binary search trees or invert matrices in memory. While understanding complexity classes is essential, real production outages rarely occur because an algorithm was O(n log n) instead of O(n).

In production software, systems break at the seams:
- **Network Timeouts & Flaky Downstreams:** Third-party payment gateways, geolocation services, and email APIs will intermittently fail. If your system assumes synchronous availability, failures cascade.
- **Asynchronous Race Conditions:** Two users updating an inventory record or booking slot simultaneously will expose concurrency issues that local testing never reproduces.
- **Schema Drift:** A mobile client running a version released six months ago interacts with a modernized backend API, triggering parsing crashes if versioning is neglected.

Building systems like DispatchLane and CleanReport taught me that resilient engineering is about designing defensiveness into every layer—idempotent endpoints, circuit breakers, and comprehensive logging.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '5 min read',
    tags: ['Software Engineering', 'System Architecture', 'DispatchLane', 'Reliability'],
    isPinned: false
  },
  {
    id: 'blog-modern-state-management-lessons',
    title: 'The Hidden Cost of State: Why We Replaced Massive Global Stores with Server Sync and Local Caching',
    date: '2026-07-18T10:00:00.000Z',
    category: 'Industry',
    type: 'blog',
    imageUrl: '/kora_ecommerce_ui.png',
    readersCount: 24,
    summary: 'Every piece of duplicated client-side state is an ongoing synchronization liability. Why modern frontends perform significantly better when relying on lightweight cache validation over complex global singletons.',
    content: `In the early days of single-page applications, the standard approach was to place every piece of data into a single global state container. User profiles, product lists, active tabs, and temporary form inputs all lived in one massive client store.

Over time, this pattern introduces subtle synchronization bugs:
- Stale server data lingering in memory after an update.
- Unnecessary component re-renders cascading across the entire component tree.
- Complex reducer and action boilerplate that slows down feature development.

When architecting interactive applications like Kora E-commerce, we shifted to a modern state hierarchy:
1. **Server Cache State:** Managed by lightweight data-fetching tools that handle automatic invalidation and background refetching.
2. **Local Component State:** Scoped strictly to the components that need it (e.g., active dropdowns or temporary filter values).
3. **URL State:** Persisting query parameters and active filters directly in the URL for seamless shareability and bookmarking.

Keeping client state minimal makes web applications easier to reason about, dramatically faster to load, and far more resilient.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '6 min read',
    tags: ['Frontend Architecture', 'State Management', 'React', 'Performance'],
    isPinned: false
  },
  {
    id: 'blog-high-latency-web-performance',
    title: 'Designing for High Latency: Practical Frontend Optimizations for the Real World',
    date: '2026-06-30T10:00:00.000Z',
    category: 'Industry',
    type: 'blog',
    imageUrl: '/pathly_online_ui.png',
    readersCount: 27,
    summary: 'When bandwidth is limited and round-trip ping times exceed 300ms, byte budgets become critical. From font subsetting and route-level code splitting to aggressive payload deduplication.',
    content: `When developing locally on localhost with zero network latency, heavy JavaScript bundles and unoptimized images feel instant. But when an end user accesses your web application on a mobile device over a 300ms round-trip connection, every extra round-trip degrades user retention.

Here are the practical performance techniques we prioritize:

- **Aggressive Route-Level Code Splitting:** Loading only the JavaScript required for the current view using dynamic imports, keeping the initial bundle well under 100kB.
- **Font Subsetting & Local Font Loading:** Subsetting web fonts to include only the required character glyphs and utilizing modern \`font-display: swap\` avoids invisible text during connection handshakes.
- **Responsive Image Art Direction:** Serving WebP images with appropriate \`srcset\` definitions ensures that mobile devices download tailored 30kB thumbnails rather than 2MB desktop assets.
- **Optimistic UI Updates:** Providing immediate visual feedback on user interactions while background requests resolve keeps interfaces feeling snappy even across high-latency networks.

Performance is not an afterthought or an optimization pass—it is a fundamental feature of good engineering.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '4 min read',
    tags: ['Web Performance', 'Frontend', 'Optimization', 'Pathly'],
    isPinned: false
  }
]
