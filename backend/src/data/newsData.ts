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
    title: 'Appointed NYSC Research Assistant under Prof. Jude Sinebe',
    date: 'Sept 2025',
    category: 'Research',
    summary: 'Selected to join the Computer Science postgraduate research lab, investigating applied data science and software reliability.',
    content: 'I am profoundly honored to announce my appointment as a Research Assistant within the Department of Computer Science, serving under the esteemed mentorship of Professor Jude Sinebe during my NYSC service year. This role represents a pivotal step in my academic and professional journey, allowing me to bridge the gap between theoretical computer science and practical, industry-standard software engineering.\\n\\nIn this capacity, my primary research focus is directed towards computational intelligence, the rigorous evaluation of machine learning models, and advanced software quality assurance methodologies. We are currently investigating how data-driven paradigms can be leveraged to improve the reliability and fault-tolerance of complex software systems.\\n\\nWorking in the postgraduate research lab provides an intellectually stimulating environment where I collaborate on empirical data analysis, algorithm optimization, and technical documentation. I am actively involved in developing script pipelines for data processing and assisting in the preparation of research manuscripts for peer-reviewed journals. This assistantship not only hones my technical acumen but also reinforces my commitment to advancing the frontiers of applied artificial intelligence and intelligent computing.',
    author: 'Quadri Ayomikun Amoo',
    readTime: '2 min read',
    tags: ['Research Assistantship', 'Computer Science', 'Prof Jude Sinebe', 'AI'],
    isPinned: true
  },
  {
    id: 'news-cleanreport-launch',
    title: 'CleanReport Civic-Tech PWA Successfully Deployed at Circo Digital Academy',
    date: 'August 2026',
    category: 'Industry',
    summary: 'As sole frontend engineer on the 5-member team, I built CleanReport—a civic sanitation PWA supporting offline issue queueing and real-time map pinning.',
    content: 'I am thrilled to share the successful deployment of CleanReport, a civic-technology sanitation platform developed during the intensive 8-week Orange Internship Programme at Circo Digital Academy. Serving as the sole frontend engineer in a dynamic, cross-functional team of five, I was tasked with architecture and building a robust, highly accessible user interface that empowers citizens to report environmental hazards seamlessly.\\n\\nCleanReport is built as a Progressive Web Application (PWA) with a strong emphasis on offline-first capabilities. I engineered a sophisticated synchronization architecture using Service Workers and IndexedDB, ensuring that users can log sanitation issues even in areas with poor cellular connectivity. Once the network is restored, the application automatically queues and syncs the localized data with our backend servers.\\n\\nAdditionally, I integrated the HTML5 Geolocation API and interactive mapping tools to allow precise marker positioning for reported issues. The dashboard provides real-time notifications, image upload compression, and administrative triage controls. This project stands as a testament to the power of civic tech in driving community engagement and showcases my ability to deliver production-ready, performant web applications under tight deadlines.',
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
    content: 'It is with immense gratitude and pride that I reflect on my graduation from First Technical University (now Abiola Ajimobi Technical University), where I was honored to receive the Best Graduating Student award in four core software engineering disciplines. Achieving a perfect 5.0/5.0 Major GPA and graduating in the Top 10% of my class was the culmination of years of rigorous academic discipline and a deep-seated passion for computer science.\\n\\nThe four subject honors I received encompass critical areas of software engineering: Operating Systems I, Human Computer Interaction, Software Engineering Professional Practice, and Fundamentals of Data Structures. Mastering these subjects required a holistic understanding of how low-level system architecture interacts with user-centric design, as well as the ethical and professional standards required to build software at scale.\\n\\nThese accolades are not just a reflection of academic grades, but a validation of my problem-solving methodology, algorithmic thinking, and dedication to continuous learning. I extend my deepest appreciation to my lecturers, mentors, and peers who challenged and inspired me throughout this journey. As I transition further into the tech industry and advanced research, these foundational pillars will continue to guide my approach to engineering intelligent, high-performance systems.',
    author: 'Quadri Ayomikun Amoo',
    readTime: '2 min read',
    tags: ['5.0/5.0 Major GPA', 'Best Graduating Student', 'Academic Honors'],
    isPinned: false
  }
]
