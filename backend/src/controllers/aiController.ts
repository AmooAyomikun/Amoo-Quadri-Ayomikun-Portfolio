import { Request, Response } from 'express'
import { cvData } from '../data/cvData.js'

export const handleAiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' })
      return
    }

    const userPrompt = message.trim()

    // If Gemini / OpenAI API Key is present in environment, call live LLM API
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
        const systemInstruction = `You are Quadri's AI Terminal Assistant on his portfolio website (amooquadri.dev).
Answer concisely, professionally, and enthusiastically using the following accurate details about Quadri Ayomikun Amoo:
Full Name: ${cvData.personalInfo.fullName}
Title: ${cvData.personalInfo.title}
Education: B.Sc. in Software Engineering (First-Class 5.0/5.0 Major GPA, 4.45/5.00 Final CGPA, Top 10%) from Abiola Ajimobi Technical University. Diplomas in French (Lower Credit) and Entrepreneurship (Upper Credit).
Main Goal: Pursue M.Sc. and Ph.D. research in Artificial Intelligence, Software Engineering, and Natural Language Processing.
Research: AI for Software Engineering, Geospatial Recommender Systems (B.Sc. Thesis under Dr. J.E.T. Akinsola), Research Assistant (NYSC) under Prof. Jude Sinebe at Postgraduate Research Lab.
Experience: Frontend Intern @ Circo Digital / Orange (CleanReport PWA), Full Stack Intern @ CodeAlpha, Data Analyst Intern @ Coast Research Tech (10 ML models in Python/SQL & Power BI).
Teaching: Tutored ~350 undergraduate students weekly in Data Structures & Algorithms. NASSA Assistant Academic Support Officer (taught 100 students Math & Python).
Awards: 4 Subject Honors (Operating Systems I, HCI, Software Engineering Professional Practice, Data Structures).
Skills: ${cvData.skills.softwareAndWeb.join(', ')}, ${cvData.skills.aiAndData.join(', ')}, ${cvData.skills.databasesAndTools.join(', ')}.
Email: ${cvData.personalInfo.email} | Phone: ${cvData.personalInfo.phone} | LinkedIn: ${cvData.personalInfo.linkedIn} | GitHub: ${cvData.personalInfo.github}.
Keep responses under 3-4 sentences, styled like a smart CLI output.`

        const apiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemInstruction },
                  { text: `User query: ${userPrompt}` }
                ]
              }
            ],
            generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
          })
        })

        if (apiRes.ok) {
          const json = await apiRes.json()
          const aiResponse = json?.candidates?.[0]?.content?.parts?.[0]?.text
          if (aiResponse) {
            res.json({ reply: aiResponse.trim() })
            return
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API fetch error, using local smart assistant fallback:', geminiErr)
      }
    }

    // Local Smart Portfolio QA Engine (Fallback if no external key or network offline)
    const reply = getSmartPortfolioReply(userPrompt)
    res.json({ reply })
  } catch (error) {
    console.error('AI controller error:', error)
    res.status(500).json({ error: 'Internal server error in AI Assistant' })
  }
}

export function getSmartPortfolioReply(userPrompt: string): string {
  const lower = userPrompt.trim().toLowerCase()

  // 1. GREETINGS & CASUAL CONVERSATION
  const isGreeting = /\b(yo|wassup|what's up|sup|hi|hello|hey|heyy|howdy|hola|good morning|good afternoon|good evening|how are you|how far|wagywan)\b/i.test(lower)
  
  if (isGreeting && !/\b(study|studied|school|gpa|cgpa|education|degree|where|research|thesis|project|projects|skill|skills|job|experience|contact|email|phone|goal|goals|vision|aim|award|awards|who)\b/i.test(lower)) {
    return "Yo! What's up? 👋 I'm Quadri's AI Assistant. I'm doing great! Ask me anything about Quadri's software engineering projects, AI research, 5.0/5.0 Major GPA, education, or how to get in touch!"
  }

  // 2. EDUCATION / DEGREE / SCHOOL / UNIVERSITY / GPA / CGPA / STUDY / WHERE
  if (/\b(study|studied|where|education|degree|university|school|college|gpa|cgpa|major|french|entrepreneurship|diploma|honors|rank|class)\b/i.test(lower)) {
    return `Quadri earned his B.Sc. in Software Engineering from Abiola Ajimobi Technical University (formerly First Technical University), Ibadan, graduating with First-Class Honors (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA, Top 10% of class). He also holds Diplomas in French (Lower Credit) and Entrepreneurship (Upper Credit).`
  }

  // 3. GOALS / VISION / FUTURE / CAREER / AIM / PHD / MSC / SCHOLARSHIPS
  if (/\b(goal|goals|vision|future|career|aspire|aspirations|aim|msc|phd|postgraduate|scholarship|scholarships|next step)\b/i.test(lower)) {
    return `Quadri's primary goal is to pursue M.Sc. and Ph.D. research in Artificial Intelligence, Software Engineering, and Natural Language Processing while engineering intelligent computing systems that solve high-impact, real-world problems.`
  }

  // 4. AWARDS / HONORS / RECOGNITIONS
  if (/\b(award|awards|honors|prizes|prize|best student|subject honors|recognition)\b/i.test(lower)) {
    return `Quadri received 4 Best Graduating Student Subject Honors: Operating Systems I, Human Computer Interaction (HCI), Software Engineering Professional Practice, and Fundamentals of Data Structures. He was also in the Top 10% of his graduating class.`
  }

  // 5. IDENTITY / BIO / WHO IS QUADRI
  if (/\b(who|bio|summary|background|identity|intro|overview)\b/i.test(lower)) {
    return `Quadri Ayomikun Amoo is a Software Engineering Researcher & Full-Stack Engineer with a First-Class Honors degree (5.0/5.0 Major GPA, 4.45/5.00 CGPA) from Abiola Ajimobi Technical University. He specializes in AI for Software Engineering, intelligent web systems (React, TypeScript, PWA, Node.js), and data analytics.`
  }

  // 6. RESEARCH / THESIS / SUPERVISORS / PROF SINEBE / DR AKINSOLA / HOTEL RECOMMENDER
  if (/\b(research|thesis|supervisor|supervisors|sinebe|akinsola|hotel|recommender|geospatial|lab|publication|publications|scholar)\b/i.test(lower)) {
    return `Quadri's research focuses on AI for Software Engineering and Intelligent Systems. His B.Sc. thesis under Dr. J.E.T. Akinsola developed a location-based hotel management & recommendation engine. He also served as Research Assistant (NYSC) under Prof. Jude Sinebe at the Postgraduate Research Lab.`
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

  // 13. CONTACT / EMAIL / PHONE / HIRE / LINKEDIN / GITHUB / LOCATION / ADDRESS
  if (/\b(contact|email|phone|hire|recruiter|reach|linkedin|github|address|location|where live|nigeria|ibadan)\b/i.test(lower)) {
    return `Get in Touch with Quadri:\n• Email: amooquadri555@gmail.com\n• Phone: +234 9071812921\n• LinkedIn: linkedin.com/in/ayomikun-amoo-6b836428b\n• GitHub: github.com/amooquadri\n• Location: Ibadan, Oyo State, Nigeria (Available worldwide for research, engineering, and graduate positions!)`
  }

  // 14. DEFAULT FALLBACK RESPONSE
  return `I am Quadri's AI Portfolio Assistant! Quadri Amoo is a First-Class Software Engineering Graduate (5.0/5.0 Major GPA) specializing in AI, React, TypeScript, and Data Science.\n\nYou can ask me about:\n• Education & GPA (e.g., "where did he study", "awards")\n• Research & Thesis (e.g., "tell me about his thesis")\n• Projects & Work Experience (e.g., "what has he built", "internships")\n• Technical Skills (e.g., "what languages does he use")\n• Future Goals (e.g., "what are his goals")\n• Contact Details (e.g., "how can I hire or email Quadri")`
}

