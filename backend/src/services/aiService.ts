import { cvData } from '../data/cvData.js'
import { matchPortfolioQuery } from './portfolioKnowledgeEngine.js'

export class AiService {
  async generateReply(userPrompt: string): Promise<string> {
    const trimmed = userPrompt.trim()

    // If Gemini API Key is configured in environment, call live Gemini LLM API
    if (process.env.GEMINI_API_KEY) {
      try {
        const canonicalDomain = process.env.CANONICAL_DOMAIN || 'amoo-quadri.vercel.app'
        const systemInstructionText = `You are Quadri's AI Terminal Assistant on his portfolio website (${canonicalDomain}).
Answer concisely, professionally, and enthusiastically using the following accurate details about Quadri Ayomikun Amoo:
Full Name: ${cvData.personalInfo.fullName}
Title: ${cvData.personalInfo.title}
Education: B.Sc. in Software Engineering (4.45/5.00 Final CGPA, Second-Class Upper Honors, Top 10% of class, 5.0/5.0 peak term GPA) from Abiola Ajimobi Technical University. Diplomas in French (Lower Credit) and Entrepreneurship (Upper Credit).
Main Goal: Pursue M.Sc. and Ph.D. research in Artificial Intelligence, Software Engineering, and Natural Language Processing.
Research: AI for Software Engineering, Geospatial Recommender Systems (B.Sc. Thesis under Dr. J.E.T. Akinsola), Research Assistant (NYSC) under Assoc. Prof. Jude Sinebe at Postgraduate Research Lab.
Experience: Frontend Intern @ Circo Digital / Orange (CleanReport PWA), Full Stack Intern @ CodeAlpha, Data Analyst Intern @ Coast Research Tech (10 ML models in Python/SQL & Power BI).
Teaching: Tutored ~350 undergraduate students weekly in Data Structures & Algorithms. NASSA Assistant Academic Support Officer (taught 100 students Math & Python).
Awards: 4 Subject Honors (Operating Systems I, HCI, Software Engineering Professional Practice, Data Structures).
Skills: ${cvData.skills.softwareAndWeb.join(', ')}, ${cvData.skills.aiAndData.join(', ')}, ${cvData.skills.databasesAndTools.join(', ')}.
Email: ${cvData.personalInfo.email} | Phone: ${cvData.personalInfo.phone} | LinkedIn: ${cvData.personalInfo.linkedIn} | GitHub: ${cvData.personalInfo.github}.
Keep responses under 3-4 sentences, styled like a smart CLI output.`

        const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash']
        for (const model of models) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`
            const apiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemInstructionText }]
                },
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: trimmed }]
                  }
                ],
                generationConfig: {
                  maxOutputTokens: 300,
                  temperature: 0.7
                }
              })
            })

            if (apiRes.ok) {
              const json = await apiRes.json() as any
              const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
              if (text && typeof text === 'string') {
                return text.trim()
              }
            } else {
              console.warn(`Gemini model ${model} returned HTTP ${apiRes.status}`)
            }
          } catch (modelErr) {
            console.warn(`Error querying model ${model}:`, modelErr)
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API fetch error, falling back to knowledge engine:', geminiErr)
      }
    }

    // Knowledge Engine fallback
    return matchPortfolioQuery(trimmed)
  }
}

export const aiService = new AiService()
