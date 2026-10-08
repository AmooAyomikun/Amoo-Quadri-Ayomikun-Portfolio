export interface Testimonial {
  id: string
  name: string
  role: string
  organization: string
  relationship: string
  category: 'academic' | 'industry' | 'both'
  quote: string
  rating: number
  avatarInitials: string
  highlights: string[]
}

export const testimonialsData: Testimonial[] = [
  {
    id: 'prof-sinebe',
    name: 'Prof. Jude Sinebe',
    role: 'Professor & Research Supervisor',
    organization: 'Department of Computer Science',
    relationship: 'NYSC Research Supervisor (2025–2026)',
    category: 'academic',
    quote: 'Ayomikun possesses outstanding analytical rigor and technical precision. His ability to apply machine learning and software engineering methodology to intelligent computing research is exceptional for a young scholar.',
    rating: 5,
    avatarInitials: 'JS',
    highlights: ['Applied Data Science', 'AI Research', 'Intelligent Systems']
  },
  {
    id: 'dr-akinsola',
    name: 'Dr. J.E.T. Akinsola',
    role: 'Senior Lecturer & Research Supervisor',
    organization: 'First Technical University, Ibadan',
    relationship: 'B.Sc Thesis Supervisor & Mentor',
    category: 'academic',
    quote: 'Quadri graduated with a 5.0/5.0 Major GPA and top honors. His B.Sc. thesis on location-based recommendation systems demonstrated deep technical competence, rigorous empirical evaluation, and exemplary documentation.',
    rating: 5,
    avatarInitials: 'JA',
    highlights: ['5.0/5.0 Major GPA', 'Recommendation Systems', 'Academic Excellence']
  },
  {
    id: 'circo-lead',
    name: 'Circo Digital Academy Engineering Team',
    role: 'Orange Internship Product Lead',
    organization: 'Circo Digital Academy',
    relationship: 'Frontend Lead Supervisor (2026)',
    category: 'industry',
    quote: 'Ayomikun served as the sole frontend developer for CleanReport. He designed and built a seamless, PWA-enabled civic-tech platform with offline capabilities, responsive UI, map integration, and flawless performance.',
    rating: 5,
    avatarInitials: 'CD',
    highlights: ['CleanReport PWA', 'React & TypeScript', 'Civic Tech Innovation']
  },
  {
    id: 'codealpha-mentor',
    name: 'CodeAlpha Technical Team',
    role: 'Full Stack Internship Coordinator',
    organization: 'CodeAlpha',
    relationship: 'Full Stack Internship Supervisor (2026)',
    category: 'industry',
    quote: 'Quadri delivered clean, modular full-stack web applications ahead of deadlines. His DRY coding practices, REST API integrations, and problem-solving skills made him stand out among tech interns.',
    rating: 5,
    avatarInitials: 'CA',
    highlights: ['Full-Stack Engineering', 'DRY Clean Code', 'REST API Architecture']
  },
  {
    id: 'coast-tech-lead',
    name: 'Coast Research Technology',
    role: 'Lead Data Analyst & Managing Director',
    organization: 'Coast Research Technology, Ibadan',
    relationship: 'SIWES Data Analyst Supervisor (2023)',
    category: 'both',
    quote: 'Ayomikun developed 10 machine learning models for financial analytics, boosting prediction accuracy by 25%. His churn prediction model and Tableau dashboard visualizations provided critical business insights.',
    rating: 5,
    avatarInitials: 'CR',
    highlights: ['ML Model Development', '+25% Accuracy Boost', 'Financial Data Analytics']
  }
]
