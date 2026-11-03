export interface NewsItem {
  id: string
  title: string
  /** ISO 8601 string (e.g. "2026-08-15T10:00:00.000Z") for chronological sorting in Firestore & APIs */
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
  {
    id: 'how-spotty-4g-taught-me-offline-engineering',
    title: 'Why Spotty 4G in Ibadan Taught Me More About Web Engineering Than Any Silicon Valley Tutorial',
    date: '2026-08-15T10:00:00.000Z',
    category: 'Industry',
    summary: 'In tutorials, API requests resolve in 40 milliseconds on gigabit fiber. In reality, testing a sanitation app on the move means packets drop and 4G switches to "E". Here is how reality forced us to build CleanReport offline-first.',
    imageUrl: '/cleanreport_ui.png',
    content: `When you watch modern web development tutorials on YouTube, the presenter usually has a 1 Gbps fiber optic internet connection in San Francisco. Every fetch() call resolves in 40 milliseconds, servers never drop sockets mid-flight, and state management libraries look like magic.

Then you step outside to build real software for real people in Nigeria, and reality hits you with a single letter on your phone’s status bar: **E** (Edge).

## The Day the Network Vanished

During the intensive 8-week Orange Internship Programme at Circo Digital Academy, our cross-functional team set out to build **CleanReport**—a civic-tech platform empowering residents to document and report sanitation hazards directly to municipal authorities.

On day three of field testing, we took the mobile prototype out to test geolocation and hazard logging. We took a photo of an overflowing drainage culvert, typed a detailed description, hit "Submit Report," and watched the spinner spin forever until Chrome threw a \`net::ERR_INTERNET_DISCONNECTED\`.

The entire report, the photo, and the user’s effort were gone. That was the moment I realized: **in emerging markets, intermittent connectivity is not an edge case. It is the baseline reality.**

## Tossing the Naive Fetch Calls

I served as the sole frontend engineer on our team. After that failed field test, I went back to the drawing board and completely stripped out immediate HTTP requests for hazard reporting.

Instead, I designed a three-layer client storage pipeline:
- **Instant Local Persistence with IndexedDB:** The second the user taps "Submit," the report, localized timestamps, and compressed photo are written to IndexedDB. The user gets an immediate success notification: "Report saved safely offline."
- **Background Sync Queues:** A dedicated Service Worker listens for the browser's sync and online events. When the cell tower handshake restores, the worker pulls pending items from the queue and dispatches them sequentially.
- **Idempotency & Retry Backoff:** If the connection drops halfway through an image upload, the client doesn't panic. Each report carries a monotonic UUID, ensuring that when the retry succeeds, the backend never creates duplicate hazard tickets.

## The Engineering Lesson That Stuck

Building CleanReport taught me something no algorithmic challenge ever could: the best software engineers don't just optimize for happy paths. They design systems with deep empathy for the physical constraints of their users.

When CleanReport was successfully deployed at Circo Digital Academy, seeing community members successfully queue reports without worrying about whether their data plan had signal was 100 times more satisfying than any synthetic Lighthouse score.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '4 min read',
    tags: ['Web Architecture', 'Offline Sync', 'Service Workers', 'CleanReport', 'Real World Engineering'],
    isPinned: true
  },
  {
    id: 'graduating-top-ten-percent-software-engineering',
    title: 'I Graduated in the Top 10% in Software Engineering—Here’s What Actually Mattered (Hint: Not Memorizing LeetCode)',
    date: '2024-09-15T12:00:00.000Z',
    category: 'Academics',
    summary: 'Reflecting on graduating with a 4.45 / 5.00 CGPA and winning Best Graduating Student across four core subjects. Why building mental models of how memory, processes, and systems actually work beats cramming syntax every time.',
    imageUrl: '/abiola-ajimobi-1.png',
    content: `When I first stepped onto the campus of First Technical University (now Abiola Ajimobi Technical University), the prevailing advice among students was to memorize syntax and solve as many LeetCode trivia questions as humanly possible.

Four years later, I stood on the convocation stage graduating in the **Top 10%** of my class with a **4.45 / 5.00 Final CGPA** (Second-Class Upper Honors) and receiving the Best Graduating Student prize across four core software engineering disciplines: Operating Systems, Human-Computer Interaction, Software Engineering Professional Practice, and Fundamentals of Data Structures.

Looking back, here is the honest truth about what actually mattered.

## 1. Operating Systems Teach You Why Bad Code Runs Slowly

Understanding low-level process scheduling, virtual memory paging, and deadlock avoidance wasn't just an academic exercise. It transformed how I write high-level JavaScript and Python today.

When you realize that an un-indexed database query or an unmemoized React component can thrash memory caches and cause kernel-level context switching, you stop treating the runtime like a mysterious black box. You write software with mechanical sympathy.

## 2. Empathy Is a Technical Requirement (HCI)

Human-Computer Interaction was one of the most rigorous subjects in our curriculum. It taught me that an application with a 99.9% uptime is still a total failure if a user cannot find the primary call-to-action within three seconds, or if a screen reader gets trapped in an inaccessible modal.

Good software is measured by human outcomes, not just server logs.

## 3. Teaching Whiteboard Concepts to 350+ Peers

During my final two years, I served as the Academic Support Officer for NASSA, running weekly tutorial workshops for over 350 peers in algorithms and discrete math.

There is an old adage: "If you can't explain it simply on a whiteboard without consulting Google, you don't actually understand it." Standing in front of a lecture hall explaining graph traversal and tree rotations forced me to strip away pretentious jargon and find clear, relatable analogies. That discipline made me ten times sharper as an engineer.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Academic Excellence', 'Computer Science', 'First Technical University', 'Engineering Mindset'],
    isPinned: true
  },
  {
    id: 'machine-learning-reliability-lab-vs-wild',
    title: 'Under the Hood of Machine Learning: Why 92% Accuracy in the Lab Often Falls Apart in the Wild',
    date: '2025-09-01T09:00:00.000Z',
    category: 'Research',
    summary: 'Working as an NYSC Research Assistant under Assoc. Prof. Jude Sinebe taught me that accuracy scores can be dangerously deceptive. Here is why software fault tolerance and dataset shift are where real research happens.',
    imageUrl: '/delta-state-uni.png',
    content: `In academic demos and Kaggle competitions, machine learning models look invincible. You split a curated dataset 80/20, run a training script, and proudly print: Test Accuracy: 92.4%. Champagne corks pop.

Then you deploy that model into an actual production environment, and within two weeks, users are reporting bizarre failures, degraded predictions, and edge-case crashes.

What went wrong?

## The Fallacy of Static Distributions

As an NYSC Research Assistant working under the mentorship of **Associate Professor Jude Sinebe** in the Computer Science postgraduate research laboratory, my core focus has been investigating empirical model validation and software reliability.

In the real world, data is not stationary:
- **Covariate Shift:** The input features in production drift away from what the training set saw (e.g., camera sensor quality differences, user dialect variations, changing seasonal trends).
- **Silent Failures:** Unlike a web server that throws a loud 500 Internal Server Error when a database crashes, a machine learning model will happily spit out an incorrect prediction with high statistical confidence.

## Building Fault-Tolerant AI Architectures

Our research lab has been investigating how classical software engineering principles—like circuit breakers, fallback heuristics, and empirical uncertainty estimation—can be wrapped around machine learning pipelines.

Instead of trusting raw model output blindly:
- **Confidence Thresholding:** If model entropy crosses a predetermined risk boundary, the system automatically routes the query to a deterministic fallback or a human-in-the-loop triage queue.
- **Runtime Drift Detection:** We monitor latency, feature distributions, and prediction skews in real-time, flagging when incoming queries no longer resemble the training baseline.

## The Takeaway

Machine learning is not magic; it is an approximation function wrapped in code. The most valuable skill in modern AI isn't just knowing how to fine-tune weights—it's knowing how to engineer guardrails so your systems stay resilient when the unexpected happens.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '4 min read',
    tags: ['Applied AI', 'Machine Learning', 'Research Assistantship', 'Software Reliability', 'Assoc. Prof. Jude Sinebe'],
    isPinned: true
  },
  {
    id: 'what-mentoring-350-students-taught-me',
    title: 'What Mentoring 350+ Students Taught Me: The Best Engineers Explain Things Like They’re Talking to a Friend',
    date: '2024-11-10T14:00:00.000Z',
    category: 'Academics',
    summary: 'As an Academic Support Officer, I spent hundreds of hours breaking down discrete mathematics and algorithmic complexity for junior peers. Here is why clear communication is the highest-leverage engineering skill.',
    imageUrl: '/abiola-ajimobi-2.png',
    content: `Every Saturday morning at university, I stood in front of a lecture theater packed with over a hundred computer science and software engineering students. On the whiteboard behind me were complex recurrence relations, binary heap operations, and Big-O notation proofs.

Most students arrived looking anxious and defeated. By the time they left two hours later, they were smiling, debating edge cases, and writing clean pseudocode.

Serving as the Academic Support Officer for the Nigerian Association of Software Science Analysts (NASSA) was one of the most rewarding leadership experiences of my life. But more than that, it radically transformed how I write software and collaborate with colleagues.

## The Trap of Intellectual Insecurity

Early in their careers, many developers believe that using dense jargon makes them sound smart. They say things like "We need an asynchronous non-blocking decoupled idempotent pub-sub event topology" when they really mean "Let's put messages in a queue so our API doesn't crash."

In the classroom, pretentious explanations fail immediately. If you tell a first-year student that a linked list is "a linear collection of data elements whose order is not given by their physical placement in memory," their eyes glaze over.

If you instead say: "Imagine a treasure hunt where every clue only tells you where to find the next clue," a lightbulb turns on instantly.

## Great Code Is Just Good Explanations

The exact same rule applies to codebase architecture:
- Function names should explain their intent without needing a ten-line comment.
- API response structures should be intuitive and self-describing.
- Pull request descriptions should tell the story of *why* a change was made, not just *what* lines were edited.

If you want to become a world-class engineer, don't just practice algorithms. Practice explaining complex systems to someone who isn't a programmer. It will make your code cleaner, your teams happier, and your systems significantly more maintainable.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Mentorship', 'Leadership', 'NASSA', 'Communication', 'Engineering Culture'],
    isPinned: false
  },
  {
    id: 'recommendation-systems-undergraduate-thesis',
    title: 'Can an Algorithm Know What You Actually Want? Lessons from Building a Location-Based Recommendation Engine',
    date: '2024-07-28T14:00:00.000Z',
    category: 'Research',
    summary: 'Supervised by Dr. J.E.T. Akinsola, my undergraduate thesis tackled the infamous "cold-start" problem in recommendation engines. Here is how hybrid collaborative filtering and spatial distance heuristics cut latency by 28%.',
    imageUrl: '/hotel_recommendation.png',
    content: `Whenever you open Netflix, Spotify, or Uber Eats, an invisible mathematical engine is quietly predicting your next desire. But what happens when a brand-new user registers, or when a user enters a town with very few past ratings?

This is known in machine learning as the **cold-start problem**, and it was the core puzzle of my undergraduate thesis under the expert supervision of **Dr. J.E.T. Akinsola**.

## The Problem with Pure Collaborative Filtering

Standard collaborative filtering models rely heavily on historical user-item interaction matrices. If User A and User B both liked Hotel X, the system assumes User A will also like Hotel Y.

However, in regional hospitality and local tourism, spatial proximity is a critical constraint. A hotel with a 4.9-star rating is completely useless to a traveler if it is 80 kilometers away across a gridlocked highway. Conversely, purely distance-based sorting recommends subpar venues simply because they happen to be nearby.

## Engineering the Hybrid Weighting Pipeline

To solve this dilemma, I designed a hybrid algorithmic architecture combining:
- **Spatial Geohash Clustering:** Pre-filtering regional bounding boxes to prune search spaces before matrix calculation.
- **Contextual Amenity Weighting:** Matching specific user intent tags (business travel, high-speed Wi-Fi, quiet environment).
- **Latent Matrix Decomposition:** Extracting latent preference vectors for recurring visitors.

Across our benchmark tests, this hybrid weighting approach yielded a **28% reduction in recommendation latency** while noticeably improving top-5 precision compared to standalone collaborative algorithms.

## Bridging Research with Production Code

The project was not just a theoretical paper—I built an interactive web prototype connecting the Python ML recommendation service with an Express and React frontend. Seeing the algorithms compute recommendations in sub-200ms confirmed to me that the sweet spot in modern computing lies right at the intersection of empirical data science and responsive software engineering.`,
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['Recommendation Systems', 'Machine Learning', 'Dr. J.E.T. Akinsola', 'Undergraduate Thesis', 'Spatial Data'],
    isPinned: false
  }
]
