export interface NewsItem {
  id: string
  title: string
  date: string
  category: 'Research' | 'Industry' | 'Academics' | 'Awards'
  summary: string
  content: string
  author: string
  readTime: string
  tags: string[]
  externalUrl?: string
  isPinned?: boolean
}

export const initialNewsData: NewsItem[] = [
  {
    id: 'news-dsu-assistantship',
    title: 'Appointed NYSC Research Assistant under Prof. Jude Sinebe at Delta State University',
    date: 'Sept 2025',
    category: 'Research',
    summary: 'Selected to join the Computer Science postgraduate research lab at Delta State University, investigating applied data science and software reliability.',
    content: 'I am honored to serve as a NYSC Research Assistant in the Department of Computer Science at Delta State University, Asaba under the mentorship of Professor Jude Sinebe. Our research focuses on computational intelligence, machine learning model evaluation, and software quality assurance methodologies.',
    author: 'Quadri Ayomikun Amoo',
    readTime: '2 min read',
    tags: ['Research Assistantship', 'Delta State Univ', 'Prof Jude Sinebe', 'AI'],
    isPinned: true
  },
  {
    id: 'news-cleanreport-launch',
    title: 'CleanReport Civic-Tech PWA Successfully Deployed at Circo Digital Academy',
    date: 'August 2026',
    category: 'Industry',
    summary: 'As sole frontend engineer on the 5-member team, I built CleanReport—a civic sanitation PWA supporting offline issue queueing and real-time map pinning.',
    content: 'During the 8-week Circo Digital Academy Orange Internship Programme, our cross-functional team delivered CleanReport. I engineered the offline PWA synchronization architecture, HTML5 Geolocation map integration, and responsive user dashboard.',
    author: 'Quadri Ayomikun Amoo',
    readTime: '3 min read',
    tags: ['CleanReport PWA', 'Circo Digital Academy', 'React', 'Offline Sync'],
    isPinned: true
  },
  {
    id: 'news-best-graduating-awards',
    title: 'Awarded 4 Best Graduating Student Subject Honors at First Technical University',
    date: 'Sept 2024',
    category: 'Awards',
    summary: 'Graduated in the Top 10% of Software Engineering class with a 5.0/5.0 Major GPA and top marks in Operating Systems, HCI, SE Practice, and Data Structures.',
    content: 'Recognized at graduation as the Best Graduating Student across four core curriculum areas: Operating Systems I, Human Computer Interaction, Software Engineering Professional Practice, and Fundamentals of Data Structures.',
    author: 'Quadri Ayomikun Amoo',
    readTime: '2 min read',
    tags: ['5.0/5.0 Major GPA', 'Best Graduating Student', 'Academic Honors'],
    isPinned: false
  }
]
