export interface ProjectItem {
  id: string
  title: string
  subtitle: string
  category: 'civic-tech' | 'ai-data' | 'recommendation' | 'fullstack' | 'ecommerce'
  lens: 'research' | 'industry' | 'both'
  period: string
  role: string
  organization: string
  summary: string
  description: string
  keyFeatures: string[]
  technologies: string[]
  metrics: { label: string; value: string }[]
  imageUrl?: string
  demoUrl?: string
  githubUrl?: string
  caseStudyPath?: string
  previewType?: 'iframe' | 'image'
  featured: boolean
}

export interface PublicationItem {
  id: string
  title: string
  authors: string
  date: string
  type: string
  status: string
  journal?: string
  link?: string
}

export interface ResearchItem {
  id: string
  title: string
  role: string
  institution: string
  period: string
  supervisor: string
  location: string
  focusArea: string
  abstract: string
  contributions: string[]
  outcomes: string[]
  tags: string[]
  thesisTitle?: string
}
export interface ExperienceItem {
  id: string
  role: string
  company: string
  location: string
  period: string
  type: 'industry' | 'teaching' | 'research'
  summary: string
  achievements: string[]
  techStack: string[]
}

export interface TestimonialItem {
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

export interface EducationItem {
  institution: string
  location?: string
  imageUrl?: string
  degree: string
  period: string
  majorGpa?: string
  finalCgpa?: string
  honors?: string
  highlights: string[]
  awards?: string[]
  courses?: string[]
}

export const portfolioData = {
  personal: {
    fullName: "QUADRI AYOMIKUN AMOO",
    displayName: "Ayomikun Amoo",
    headline: "Software Engineering Scholar & Full-Stack / Frontend Engineer",
    academicTagline: "Applied Data Science, AI & Intelligent Computing Research",
    industryTagline: "Building High-Performance React/TypeScript & Full-Stack Systems",
    email: "amooquadri555@gmail.com",
    phone: "+234 9071812921",
    address: "No.23, Gbadura str. Wofun, Olodo, Ibadan, Oyo State, Nigeria",
    googleScholar: "https://scholar.google.com/citations?hl=en&user=e9bX70kAAAAJ",
    linkedIn: "http://www.linkedin.com/in/ayomikun-amoo-6b836428b",
    twitter: "https://x.com/ayomhykun",
    github: "https://github.com/amooquadri",
    cvPdfUrl: "/Amoo_Quadri_CV.pdf",
    bio: "I am a first-class Software Engineering graduate (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA) and dedicated Software Engineering & Applied AI Researcher. My work bridges academic research in intelligent computing, data-driven systems, and machine learning with production-grade full-stack and frontend engineering.",
    stats: [
      { label: "Major GPA", value: "5.0 / 5.0", detail: "Abiola Ajimobi Technical Univ" },
      { label: "Final CGPA", value: "4.45 / 5.00", detail: "89% Equivalent (3.56/4.00)" },
      { label: "Graduating Class", value: "Top 10%", detail: "Second-Class Upper Honors" },
      { label: "Subject Awards", value: "4 Best Student", detail: "OS, HCI, SE Practice, Data Struct" },
      { label: "Tutor Reach", value: "350+ Students", detail: "Algorithms & Programming" },
      { label: "ML Models Built", value: "10 Deployed", detail: "+25% Accuracy Boost" }
    ],
    researchInterests: [
      "Applied Data Science",
      "Artificial Intelligence",
      "Data Analytics",
      "Generative AI",
      "Intelligent Software Systems",
      "Machine Learning",
      "Natural Language Processing",
      "Software Engineering",
      "Software Quality & Reliability"
    ]
  },

  education: [
    {
      institution: "First Technical University (now Abiola Ajimobi Technical University), Ibadan",
      location: "Ibadan, Nigeria",
      imageUrl: "/abiola ajumobi1.png",
      degree: "Bachelor of Science (B.Sc.) in Software Engineering",
      period: "2021 – 2024",
      majorGpa: "5.0 / 5.0",
      finalCgpa: "4.45 / 5.00 (Equivalent to 3.56/4.00 and 89%)",
      honors: "Second-Class Honors (Upper Division), Top 10% of Graduating Class",
      awards: [
        "Best Grade Student in Operating System I",
        "Best Grade Student in Human Computer Interaction",
        "Best Grade Student in Software Engineering Professional Practice",
        "Best Grade Student in Fundamentals of Data Structure"
      ],
      courses: [
        "Algorithms & Complexity Analysis",
        "Artificial Intelligence & Expert Systems",
        "Data Structures & Algorithms",
        "Discrete Structures",
        "Human Computer Interaction",
        "Modelling & Simulation",
        "Research Methodology in Computer Science"
      ],
      highlights: [
        "Achieved a perfect 5.0/5.0 Major GPA in core Software Engineering curriculum.",
        "Graduated in the Top 10% of the class with 4 subject excellence awards.",
        "Thesis supervised by Dr. J.E.T. Akinsola on Location-Based Hotel Recommendation Systems."
      ]
    },
    {
      institution: "First Technical University, Ibadan",
      location: "Ibadan, Nigeria",
      imageUrl: "/abiola ajumobi2.png",
      degree: "Diploma in Entrepreneurship",
      period: "2021 – 2024",
      highlights: ["Upper Credit, Top 10% of Graduating Class."]
    },
    {
      institution: "First Technical University, Ibadan",
      location: "Ibadan, Nigeria",
      imageUrl: "/abiola ajumobi.png",
      degree: "Diploma in French Language",
      period: "2021 – 2024",
      highlights: ["Lower Credit (Professional bilingual communication skills)."]
    },
    {
      institution: "David Joel Model College, Ibadan",
      location: "Ibadan, Nigeria",
      imageUrl: "/david joel.png",
      degree: "Secondary School Education",
      period: "2013 – 2019",
      highlights: ["Served as the Social Prefect.", "Graduated with excellent O-Level results."]
    }
  ] as EducationItem[],

  research: [
    {
      id: 'cs-nysc-research',
      title: 'Applied AI & Intelligent Computing Research',
      role: 'Research Assistant (NYSC)',
      institution: 'Department of Computer Science / Postgraduate Research Lab',
      period: 'Sept. 2025 – Sept. 2026',
      supervisor: 'Prof. Jude Sinebe',
      location: 'Nigeria',
      focusArea: 'Applied Data Science, Machine Learning & Intelligent Software Systems',
      abstract: 'Conducting empirical research under Prof. Jude Sinebe, exploring data-driven problem solving, AI computational models, literature analysis, and experimental evaluation of software reliability.',
      contributions: [
        'Applied machine learning algorithms and software engineering methodologies to computational domain research.',
        'Executed quantitative data analysis, literature reviews, and technical research documentation.',
        'Developed modular script pipelines for data processing and model performance validation.',
        'Strengthened rigorous research methodology, technical communication, and academic writing.'
      ],
      outcomes: [
        'Active researcher in DSU Computer Science postgraduate laboratory.',
        'Preparing research papers for submission to peer-reviewed international journals.'
      ],
      tags: ['Applied Data Science', 'Artificial Intelligence', 'Software Quality', 'Data Analytics']
    },
    {
      id: 'tech-univ-thesis',
      title: 'Location-Based Recommendation & Reservation Hotel System',
      role: 'Research Assistant & Thesis Lead',
      institution: 'First Technical University, Ibadan',
      period: 'Sept. 2024 – April 2025',
      supervisor: 'Dr. J.E.T. Akinsola',
      location: 'Ibadan, Oyo State, Nigeria',
      thesisTitle: 'Development of a Hotel Management System with Location-Based Recommendation and Reservation',
      focusArea: 'Location-Aware Systems, Spatial Algorithms & Web Software Engineering',
      abstract: 'Investigated geospatial recommendation strategies to optimize hotel discovery and booking efficiency. Designed and evaluated a location-aware recommendation algorithm combining geographical spatial data and personalized user requirements.',
      contributions: [
        'Formulated requirements analysis and software architectural design for geospatial hotel search.',
        'Implemented location-aware recommendation algorithms calculating distance metrics and user preference scores.',
        'Executed full software development lifecycle: system design, backend database integration, testing, and UX evaluation.',
        'Assisted departmental academic responsibilities including script marking, documentation, and student guidance under Dr. Akinsola.'
      ],
      outcomes: [
        'B.Sc. Thesis completed with top academic grade.',
        'Demonstrated practical software engineering and location-based algorithm implementation.'
      ],
      tags: ['Recommender Systems', 'Location-Based Services', 'Geospatial Algorithms', 'B.Sc Thesis']
    }
  ] as ResearchItem[],

  publications: [
    {
      id: 'pub-hotel',
      title: 'DEVELOPMENT OF A HOTEL MANAGEMENT SYSTEM WITH LOCATION-BASED RECOMMENDATION AND RESERVATION',
      authors: 'Amoo, Quadri Ayomikun',
      date: '2026',
      type: 'JOURNAL ARTICLE',
      status: 'PUBLISHED',
      journal: 'Zenodo',
      link: 'https://zenodo.org'
    },
    {
      id: 'pub-bias',
      title: 'A Data Quality-Aware Framework for Reducing Algorithmic Bias in Imbalanced Datasets',
      authors: 'Amoo, Quadri Ayomikun; Ademola, Mayowa Mosunmola; Agboola, Farouq Ayodeji',
      date: '2026',
      type: 'PREPRINT',
      status: 'OPEN',
      journal: 'Zenodo',
      link: 'https://zenodo.org'
    }
  ] as PublicationItem[],

  experience: [
    {
      id: 'circo-cleanreport',
      role: 'Frontend Developer Intern',
      company: 'Circo Digital Academy — Orange Internship Programme',
      location: 'Remote',
      period: 'July 2026 – August 2026',
      type: 'industry',
      summary: 'Selected as sole frontend engineer in a 5-member cross-functional product team to build CleanReport, a civic-technology sanitation issue reporting platform.',
      achievements: [
        'Designed and built responsive frontend interface using React, TypeScript, and modern CSS.',
        'Implemented Progressive Web App (PWA) offline reporting workflow queuing local reports and auto-syncing upon connectivity restoration.',
        'Integrated live geolocation API, interactive maps, image upload handling, real-time notifications, and admin dashboard controls.',
        'Enhanced web accessibility, SEO audit scores, and initial load performance via code-splitting and asset optimization.'
      ],
      techStack: ['React', 'TypeScript', 'PWA / Service Workers', 'Geolocation API', 'Leaflet / Maps', 'REST API', 'CSS Modules']
    },
    {
      id: 'codealpha-fullstack',
      role: 'Full Stack Development Intern',
      company: 'CodeAlpha',
      location: 'Remote',
      period: 'April 2026 – June 2026',
      type: 'industry',
      summary: 'Engineered web applications using modern full-stack technologies, strengthening component-driven development and database API integrations.',
      achievements: [
        'Developed full-stack web features using React, Node.js, Express, and SQL/NoSQL databases.',
        'Applied DRY coding principles, robust modular architectures, and secure RESTful endpoint schemas.',
        'Utilized Git version control, postman testing suites, and agile issue tracking to deliver feature updates.'
      ],
      techStack: ['React', 'Node.js', 'Express.js', 'JavaScript', 'TypeScript', 'REST API', 'Git & GitHub']
    },
    {
      id: 'coast-tech-analyst',
      role: 'Data Analyst Intern (SIWES)',
      company: 'Coast Research Technology',
      location: 'Ibadan, Oyo State, Nigeria',
      period: 'April 2023 – September 2023',
      type: 'industry',
      summary: 'Built machine learning predictive models and interactive BI dashboards for financial data analytics and customer retention.',
      achievements: [
        'Designed and trained 10 machine learning models using Python and SQL, boosting financial prediction accuracy by 25%.',
        'Engineered a customer churn prediction model using feature extraction and ensemble classification techniques.',
        'Constructed interactive Power BI and Tableau dashboards to deliver data insights to decision-makers.'
      ],
      techStack: ['Python', 'SQL', 'Scikit-Learn', 'Pandas & NumPy', 'Power BI', 'Tableau', 'Ensemble ML']
    },
    {
      id: 'undergrad-tutor',
      role: 'Undergraduate Computer Science Tutor',
      company: 'First Technical University',
      location: 'Ibadan, Oyo State, Nigeria',
      period: 'Sept. 2021 – July 2024',
      type: 'teaching',
      summary: 'Tutored approximately 350 undergraduate students weekly in core computer science, algorithms, and data structures.',
      achievements: [
        'Delivered weekly tutorial sessions on Data Structures, Algorithms & Complexity, and Object-Oriented Programming.',
        'Authored comprehensive study guides and past examination solution manuals.'
      ],
      techStack: ['Data Structures', 'Algorithms', 'Python', 'C++', 'Java', 'Pedagogy']
    },
    {
      id: 'nassa-support-officer',
      role: 'Asst. Academic Support Officer',
      company: 'Natural & Applied Sciences Student Association (NASSA)',
      location: 'First Technical University, Ibadan',
      period: 'Oct. 2023 – Aug. 2024',
      type: 'teaching',
      summary: 'Taught 100 lower-level students Mathematics and introductory Python programming.',
      achievements: [
        'Organized workshop series in introductory Python programming logic and foundational mathematics.',
        'Mentored junior students on academic study strategies and software engineering fundamentals.'
      ],
      techStack: ['Python', 'Mathematics', 'Mentorship', 'Curriculum Design']
    }
  ] as ExperienceItem[],

  projects: [
    {
      id: 'dispatchlane',
      title: 'DispatchLane Delivery Tracker PWA',
      subtitle: 'Logistics & Dispatch Tracking Platform',
      category: 'fullstack',
      lens: 'industry',
      period: '2024',
      role: 'Frontend Engineer',
      organization: 'Personal Project',
      summary: 'A robust web application for tracking deliveries, managing dispatch riders, and optimizing logistics routes.',
      description: 'Redesigned and engineered the frontend architecture for DispatchLane. Implemented a seamless user interface for real-time delivery tracking, rider management, and status updates using modern React and Tailwind CSS.',
      keyFeatures: [
        'Real-time delivery status tracking',
        'Interactive dashboard for dispatch management',
        'Responsive and accessible UI design',
        'Optimized frontend performance'
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'REST API'],
      metrics: [
        { label: 'Role', value: 'Frontend' },
        { label: 'Domain', value: 'Logistics' }
      ],
      imageUrl: '/dispatchlane.png',
      demoUrl: 'https://dispatch-lane-delivery-and-dispatch.vercel.app/',
      githubUrl: 'https://github.com/AmooAyomikun/DispatchLane-delivery-and-dispatch-tracker',
      featured: true
    },
    {
      id: 'kora-ecommerce',
      title: 'Kora E-Commerce',
      subtitle: 'Full-Featured Online Store',
      category: 'ecommerce',
      lens: 'industry',
      period: '2024',
      role: 'Frontend Engineer',
      organization: 'Personal Project',
      summary: 'A comprehensive e-commerce frontend featuring accessibility improvements, dark mode, and UI polish.',
      description: 'Developed the complete frontend experience for Kora E-Commerce. Focused on building a highly accessible, performant, and visually appealing shopping interface with advanced state management and dark mode support.',
      keyFeatures: [
        'Complete shopping cart and checkout flow',
        'Seamless dark/light mode integration',
        'WCAG accessibility compliance',
        'Product filtering and search'
      ],
      technologies: ['React', 'Context API', 'Tailwind CSS', 'Framer Motion'],
      metrics: [
        { label: 'Role', value: 'Frontend' },
        { label: 'Domain', value: 'E-Commerce' }
      ],
      imageUrl: '/koraapp.png',
      demoUrl: 'https://kora-e-commerce-website.vercel.app/',
      githubUrl: 'https://github.com/AmooAyomikun/Kora-E-commerce-Website',
      featured: true
    },
    {
      id: 'kynda-ai-assistant',
      title: 'Kynda AI Learning Platform',
      subtitle: 'Intelligent Academic Learning & AI Tutoring Assistant',
      category: 'ai-data',
      lens: 'both',
      period: '2025',
      role: 'Full Stack Engineer',
      organization: 'Personal Research Project',
      summary: 'An intelligent learning platform leveraging generative AI to generate quiz modules, study notes, and explanations.',
      description: 'Designed to assist university students and parents with course comprehension. Features automated flashcard generation, parent dashboards, wallet systems, and conversational academic explanations using LLM APIs.',
      keyFeatures: [
        'Parent Dashboard, Learnings, and Approvals',
        'AI Quiz & flashcard generation',
        'Wallet and payment integration',
        'Responsive dark/light UI dashboard'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'OpenAI API', 'Tailwind CSS'],
      metrics: [
        { label: 'Focus', value: 'AI Education' },
        { label: 'NLP Engine', value: 'LLM Integration' }
      ],
      imageUrl: '/kynda.png',
      demoUrl: 'https://kynda-ai-assistant-learning-platfor.vercel.app/',
      githubUrl: 'https://github.com/AmooAyomikun/Kynda-AI-Assistant-Learning-Platform',
      featured: true
    },
    {
      id: 'pathly-online',
      title: 'Pathly Online Learning Platform',
      subtitle: 'Educational Course Management System',
      category: 'fullstack',
      lens: 'industry',
      period: '2024',
      role: 'Frontend Engineer',
      organization: 'Personal Project',
      summary: 'An engaging online learning platform frontend with structured courses and video integration.',
      description: 'Built the frontend for Pathly, an online education platform. Focused on delivering a distraction-free learning experience with structured curriculum navigation, video player integration, and progress tracking UI.',
      keyFeatures: [
        'Structured curriculum navigation',
        'Video player and progress tracking',
        'Clean, distraction-free learning UI',
        'Responsive design for mobile learning'
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      metrics: [
        { label: 'Role', value: 'Frontend' },
        { label: 'Domain', value: 'EdTech' }
      ],
      imageUrl: '/pathly.png',
      demoUrl: 'https://pathly-online-learnig-platform.vercel.app/',
      githubUrl: 'https://github.com/AmooAyomikun/Pathly-Online-Learnig-Platform-',
      featured: true
    },
    {
      id: 'cleanreport-pwa',
      title: 'CleanReport Civic-Tech PWA',
      subtitle: 'Progressive Web App for Community Environmental Issue Reporting',
      category: 'civic-tech',
      lens: 'both',
      period: '2026',
      role: 'Sole Frontend Engineer',
      organization: 'Circo Digital Academy',
      summary: 'A civic technology platform enabling citizens to report sanitation issues with geolocation, offline PWA queueing, and admin workflow.',
      description: 'CleanReport empowers communities to log sanitation and environmental hazards. Built as a Progressive Web App, it supports offline submission when cellular network is unavailable, auto-syncing when online. Features include interactive map pinning, image upload, geolocation tracking, community comments, and admin issue triage.',
      keyFeatures: [
        'PWA Offline reporting with IndexedDB / ServiceWorker sync',
        'Geolocation tag & interactive map marker positioning',
        'Image upload preview & compression',
        'Real-time admin notification & status tracking dashboard',
        'Accessible, mobile-first responsive design'
      ],
      technologies: ['React', 'TypeScript', 'PWA Service Workers', 'Leaflet', 'REST API', 'Tailwind CSS'],
      metrics: [
        { label: 'Role', value: 'Sole Frontend Engineer' },
        { label: 'Team Size', value: '5 Cross-Functional' },
        { label: 'Offline Sync', value: '100% Functional' }
      ],
      imageUrl: '/cleanreport.png',
      demoUrl: 'https://cleanreport-frontend.vercel.app/',
      githubUrl: 'https://github.com/AmooAyomikun/axion-circle',
      featured: true
    },
    {
      id: 'hotel-recommendation-system',
      title: 'Location-Based Hotel Recommendation System',
      subtitle: 'B.Sc. Thesis Project: Geospatial Recommendation & Reservation Platform',
      category: 'recommendation',
      lens: 'research',
      period: '2024 – 2025',
      role: 'Lead Developer & Researcher',
      organization: 'First Technical University',
      summary: 'A web-based hotel management platform integrating spatial recommendation algorithms matching user preferences with hotel locations.',
      description: 'Developed as a B.Sc. Software Engineering thesis project under Dr. J.E.T. Akinsola. Combines user preference parameters with geographic proximity calculation to rank and suggest optimal hotel accommodations alongside instant room reservation capabilities.',
      keyFeatures: [
        'Geospatial distance metric computation for location relevance',
        'Multi-criteria recommendation scoring engine',
        'Real-time booking and room availability reservation backend',
        'Interactive map visualization of candidate hotels',
        'Comprehensive empirical evaluation and user testing'
      ],
      technologies: ['React', 'Node.js', 'Express.js', 'PostgreSQL / PostGIS', 'Python', 'Geospatial Algorithms'],
      metrics: [
        { label: 'Grade', value: '5.0 / 5.0 Thesis' },
        { label: 'Domain', value: 'Location-Aware Systems' }
      ],
      imageUrl: '/hotel_recommendation.png',
      demoUrl: 'https://zenodo.org/records/22926326',
      githubUrl: 'https://github.com/amooquadri/hotel-recommendation-system',
      featured: true
    },
    {
      id: 'algorithmic-bias-framework',
      title: 'Data Quality-Aware Framework for Algorithmic Bias',
      subtitle: 'Research Publication on Reducing Bias in Imbalanced Datasets',
      category: 'ai-data',
      lens: 'research',
      period: '2026',
      role: 'Lead Researcher',
      organization: 'Academic Research',
      summary: 'A comprehensive research framework targeting the reduction of algorithmic bias caused by data quality issues in imbalanced datasets.',
      description: 'Authored and published research focusing on how data imbalances propagate algorithmic bias in machine learning models. Proposes a novel, data quality-aware framework to mitigate these effects at the preprocessing and algorithmic levels.',
      keyFeatures: [
        'Empirical evaluation of bias in ML models',
        'Novel framework for data quality assessment',
        'Imbalanced dataset handling methodologies',
        'Published as an open-access preprint'
      ],
      technologies: ['Python', 'Machine Learning', 'Data Quality Analysis', 'Statistical Modeling'],
      metrics: [
        { label: 'Type', value: 'Preprint' },
        { label: 'Status', value: 'Published' }
      ],
      imageUrl: '/algorithmic_bias.png',
      demoUrl: 'https://zenodo.org/records/20269104',
      featured: true
    }
  ] as ProjectItem[],

  testimonials: [
    {
      id: 'prof-sinebe',
      name: 'Prof. Jude Sinebe',
      role: 'Professor & NYSC Research Supervisor',
      organization: 'Department of Computer Science',
      relationship: 'Research Supervisor (2025–2026)',
      category: 'academic',
      quote: 'Ayomikun possesses outstanding analytical rigor and technical precision. His ability to apply machine learning and software engineering methodology to intelligent computing research is exceptional for a young scholar.',
      rating: 5,
      avatarInitials: 'JS',
      highlights: ['Applied Data Science', 'AI Research', 'Software Systems']
    },
    {
      id: 'dr-akinsola',
      name: 'Dr. J.E.T. Akinsola',
      role: 'Senior Lecturer & B.Sc Thesis Supervisor',
      organization: 'First Technical University, Ibadan',
      relationship: 'B.Sc Thesis Supervisor & Academic Mentor',
      category: 'academic',
      quote: 'Quadri graduated with a perfect 5.0/5.0 Major GPA and top honors. His B.Sc. thesis on location-based recommendation systems demonstrated deep technical competence, rigorous empirical evaluation, and exemplary documentation.',
      rating: 5,
      avatarInitials: 'JA',
      highlights: ['5.0/5.0 Major GPA', 'Recommendation Systems', 'Academic Excellence']
    },
    {
      id: 'circo-lead',
      name: 'Circo Digital Academy Lead',
      role: 'Orange Internship Product Lead',
      organization: 'Circo Digital Academy',
      relationship: 'Frontend Team Lead Supervisor (2026)',
      category: 'industry',
      quote: 'Ayomikun served as the sole frontend developer for CleanReport. He designed and built a seamless, PWA-enabled civic-tech platform with offline capabilities, responsive UI, map integration, and flawless performance.',
      rating: 5,
      avatarInitials: 'CD',
      highlights: ['CleanReport PWA', 'React & TypeScript', 'Civic Tech Lead']
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
      name: 'Coast Research Technology Lead',
      role: 'Managing Director & Lead Data Analyst',
      organization: 'Coast Research Technology, Ibadan',
      relationship: 'SIWES Data Analyst Supervisor (2023)',
      category: 'both',
      quote: 'Ayomikun developed 10 machine learning models for financial analytics, boosting prediction accuracy by 25%. His churn prediction model and Tableau dashboard visualizations provided critical business insights.',
      rating: 5,
      avatarInitials: 'CR',
      highlights: ['ML Model Development', '+25% Accuracy Boost', 'Financial Data Analytics']
    }
  ] as TestimonialItem[],

  skills: {
    aiAndData: [
      { name: "Machine Learning", level: "Advanced", detail: "Scikit-Learn, Ensemble Models, Evaluation" },
      { name: "Generative AI", level: "Intermediate", detail: "Prompt Engineering, LLM Integration, RAG" },
      { name: "Natural Language Processing", level: "Intermediate", detail: "Text Mining, Sentiment Analysis, Tokenization" },
      { name: "Applied Data Science", level: "Advanced", detail: "Experimental Design, Data Pipelines" },
      { name: "Data Analytics", level: "Advanced", detail: "Pandas, NumPy, Feature Engineering" },
      { name: "Python", level: "Expert", detail: "Data Science, Scripting, ML Libraries" },
      { name: "SQL", level: "Advanced", detail: "PostgreSQL, MySQL, Complex Queries" }
    ],
    softwareAndWeb: [
      { name: "React", level: "Expert", detail: "Hooks, Context, Performance, PWA" },
      { name: "JavaScript", level: "Expert", detail: "ES6+, Async/Await, Modular JS" },
      { name: "TypeScript", level: "Advanced", detail: "Type Safety, Generics, Component Props" },
      { name: "HTML5 & CSS3", level: "Expert", detail: "Semantic HTML, CSS Variables, Flex/Grid" },
      { name: "Tailwind CSS", level: "Advanced", detail: "Utility Classes, Theme Customization" },
      { name: "Node.js", level: "Advanced", detail: "Express.js Server Architecture, Middleware" },
      { name: "Express.js", level: "Advanced", detail: "RESTful API Design, Routing, Validation" },
      { name: "Django REST API", level: "Intermediate", detail: "Python Backend Services, Serializers" }
    ],
    databasesAndTools: [
      { name: "PostgreSQL", level: "Advanced", detail: "Relational Design, Indexing" },
      { name: "MySQL", level: "Advanced", detail: "Schema Design, Query Optimization" },
      { name: "Supabase & Prisma", level: "Intermediate", detail: "ORM & Cloud DB Services" },
      { name: "Git & GitHub", level: "Expert", detail: "Version Control, Branching, Monorepo" },
      { name: "Postman & Vite", level: "Advanced", detail: "API Testing & Fast Build Bundling" }
    ],
    researchAndMethodology: [
      { name: "Statistical Analysis", level: "Advanced", detail: "Empirical Testing, Hypothesis Validation" },
      { name: "Data Visualization", level: "Advanced", detail: "Power BI, Tableau, Matplotlib" },
      { name: "Software Quality & QA", level: "Advanced", detail: "Testing, Reliability Metrics, Audits" },
      { name: "Technical Documentation", level: "Expert", detail: "Research Papers, Academic Reports, Specs" }
    ]
  }
}
