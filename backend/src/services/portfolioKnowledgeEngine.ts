/**
 * Domain Knowledge Engine & Rule-Based Matcher for Quadri Ayomikun Amoo's AI Assistant.
 * Extracted from controller to maintain clean layered architecture (Issue 3.7).
 */
export function matchPortfolioQuery(userPrompt: string): string {
  const lower = userPrompt.trim().toLowerCase()

  // 0. TERMINAL COMMANDS & HELP
  if (/^(help|commands|options|usage|menu)$/i.test(lower) || /\b(available commands|what can you do|what commands)\b/i.test(lower)) {
    return "AVAILABLE COMMANDS & TOPICS: 'about', 'skills', 'projects', 'education', 'research', 'experience', 'awards', 'contact', 'clear'. Or ask me ANY natural question about Quadri!"
  }

  // 1. GREETINGS & CASUAL CONVERSATION
  const isGreeting = /\b(yo|wassup|what's up|sup|hi|hello|hey|heyy|howdy|hola|good morning|good afternoon|good evening|how are you|how far|wagywan)\b/i.test(lower)
  
  if (isGreeting && !/\b(study|studied|school|gpa|cgpa|education|degree|where|research|thesis|project|projects|skill|skills|job|experience|contact|email|phone|goal|goals|vision|aim|award|awards|who|about)\b/i.test(lower)) {
    return "Hello! I'm Quadri's AI Assistant. Ask me anything about Quadri's software engineering projects, AI research, education & honors, or how to get in touch!"
  }

  // 2. EDUCATION / DEGREE / SCHOOL / UNIVERSITY / GPA / CGPA / STUDY / WHERE
  if (/\b(study|studied|where|education|degree|university|school|college|gpa|cgpa|major|french|entrepreneurship|diploma|honors|rank|class)\b/i.test(lower)) {
    return `Quadri earned his B.Sc. in Software Engineering from Abiola Ajimobi Technical University (formerly First Technical University), Ibadan, graduating with a 4.45/5.00 Final CGPA (Second-Class Upper Honors, Top 10% of class) and a 5.0/5.0 single-term peak GPA. He also holds Diplomas in French (Lower Credit) and Entrepreneurship (Upper Credit).`
  }

  // 3. GOALS / VISION / FUTURE / CAREER / AIM / PHD / MSC / SCHOLARSHIPS
  if (/\b(goal|goals|vision|future|career|aspire|aspirations|aim|msc|phd|postgraduate|scholarship|scholarships|next step)\b/i.test(lower)) {
    return `Quadri's primary goal is to pursue M.Sc. and Ph.D. research in Artificial Intelligence, Software Engineering, and Natural Language Processing while engineering intelligent computing systems that solve high-impact, real-world problems.`
  }

  // 4. AWARDS / HONORS / RECOGNITIONS
  if (/\b(award|awards|honors|prizes|prize|best student|subject honors|recognition)\b/i.test(lower)) {
    return `Quadri received 4 Best Graduating Student Subject Honors: Operating Systems I, Human Computer Interaction (HCI), Software Engineering Professional Practice, and Fundamentals of Data Structures. He was also in the Top 10% of his graduating class.`
  }

  // 5. IDENTITY / BIO / WHO IS QUADRI / ABOUT
  if (/\b(who|bio|summary|background|identity|intro|overview|about)\b/i.test(lower)) {
    return `Quadri Ayomikun Amoo is a Software Engineering Researcher & Full-Stack Engineer with a 4.45/5.00 Final CGPA (Second-Class Upper Honors, Top 10% of class) from Abiola Ajimobi Technical University. He specializes in AI for Software Engineering, intelligent web systems (React, TypeScript, PWA, Node.js), and data analytics.`
  }

  // 6. RESEARCH / THESIS / SUPERVISORS / PROF SINEBE / DR AKINSOLA / HOTEL RECOMMENDER
  if (/\b(research|thesis|supervisor|supervisors|sinebe|akinsola|hotel|recommender|geospatial|lab|publication|publications|scholar)\b/i.test(lower)) {
    return `Quadri's research focuses on AI for Software Engineering and Intelligent Systems. His B.Sc. thesis under Dr. J.E.T. Akinsola developed a location-based hotel management & recommendation engine. He also served as Research Assistant (NYSC) under Assoc. Prof. Jude Sinebe at the Postgraduate Research Lab.`
  }

  // 7. INDUSTRIAL EXPERIENCE / JOBS / INTERNSHIPS / WORK / CIRCO / ORANGE / CODEALPHA / COAST RESEARCH
  if (/\b(experience|work|job|jobs|intern|internship|internships|company|companies|circo|orange|codealpha|coast)\b/i.test(lower)) {
    return `Industrial Experience:\n• Frontend Intern @ Circo Digital / Orange Programme (built CleanReport PWA with offline sync & maps)\n• Full Stack Intern @ CodeAlpha (built React/TypeScript/Node.js web apps)\n• Data Analyst Intern @ Coast Research Tech (built 10 financial ML models in Python/SQL & Power BI dashboards)`
  }

  // 8. CLEANREPORT PWA
  if (/\b(cleanreport|sanitation|civic|pwa|offline)\b/i.test(lower)) {
    return `CleanReport is a civic-tech PWA built by Quadri during his Circo Digital / Orange internship. It enables citizens to report sanitation issues offline, automatically syncing reports to the cloud upon reconnection with interactive maps and admin management.`
  }

  // 9. KYNDA / PATHLY / SPECIFIC APPS
  if (/\b(kynda|pathly|lms|study assistant)\b/i.test(lower)) {
    return `• KYNDA AI: An AI-powered study assistant delivering interactive learning, question generation, and real-time study feedback.\n• Pathly LMS: A modern learning management system streamlining online course delivery and student-instructor workflows.`
  }

  // 10. TEACHING / TUTORING / MENTORSHIP / NASSA
  if (/\b(teach|teaching|tutor|tutoring|mentor|mentorship|nassa|students)\b/i.test(lower)) {
    return `Teaching Experience:\n• Undergraduate Tutor: Tutored ~350 computer science students weekly in Data Structures, Algorithms, and OOP.\n• Asst. Academic Support Officer @ NASSA: Taught 100 lower-level students Mathematics and Python programming.`
  }

  // 11. SKILLS / TECH STACK / LANGUAGES / FRAMEWORKS / PYTHON / REACT / TYPESCRIPT
  if (/\b(skill|skills|stack|tech|technology|technologies|language|languages|python|react|typescript|javascript|node|sql|postgresql|tailwind|ml|machine learning)\b/i.test(lower)) {
    return `Core Technical Stack:\n• Frontend: React, TypeScript, JavaScript, HTML5, Modern CSS, Tailwind CSS, PWA\n• Backend & Databases: Python, Node.js, Express.js, Django REST, SQL, PostgreSQL, MySQL, Supabase, Prisma\n• AI & Data Science: Machine Learning, Generative AI, NLP, Data Analytics, Power BI\n• Tools: Git, GitHub, Postman, Vite`
  }

  // 12. PROJECTS OVERVIEW / PORTFOLIO APPS
  if (/\b(project|projects|portfolio|built|apps|systems)\b/i.test(lower)) {
    return `Featured Projects:\n1. CleanReport PWA (Civic-tech offline sanitation platform)\n2. Location-Based Hotel Recommender System (B.Sc. Thesis)\n3. KYNDA AI Study Assistant\n4. Pathly LMS\n5. Financial Churn Prediction ML Models (10 models built with Python/SQL)`
  }

  // 13. CONTACT / HIRE / REACH OUT / EMAIL / PHONE / LINKEDIN
  if (/\b(contact|email|phone|hire|reach|touch|call|message|linkedin|github)\b/i.test(lower)) {
    return `Connect with Quadri:\n• Email: amooquadri555@gmail.com\n• LinkedIn: linkedin.com/in/ayomikun-amoo-6b836428b\n• GitHub: github.com/AmooAyomikun\n• Phone: +234 9071812921`
  }

  // 14. CV / RESUME
  if (/\b(cv|resume|curriculum vitae|download)\b/i.test(lower)) {
    return `You can download Quadri's official academic & engineering CV directly from the top navigation bar or the footer of this portfolio website.`
  }

  // 15. DEFAULT HELPFUL FALLBACK MENU
  return `I'm Quadri's AI assistant. Try asking about:\n• "About Quadri" or "Bio"\n• "What is Quadri's education & GPA?"\n• "Tell me about his research with Dr. Akinsola or Assoc. Prof. Sinebe"\n• "What projects has he built?" (CleanReport, KYNDA, Pathly)\n• "What are his tech stack and skills?"\n• "How can I contact him?"`
}

export const getSmartPortfolioReply = matchPortfolioQuery

