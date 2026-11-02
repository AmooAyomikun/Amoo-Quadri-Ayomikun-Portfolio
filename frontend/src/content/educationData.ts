import React from 'react'
import { GraduationCap, Award, BookOpen, Medal } from 'lucide-react'

export interface TabConfig {
  label: string
  mobileLabel: string
  title: string
  icon: React.ReactNode
  color: {
    bg: string
    text: string
    border: string
    cardBg: string
    accent: string
    tagBg: string
    tagBorder: string
    tagText: string
  }
  clipPath: string
}

export interface Metric {
  label: string
  value: string
  note?: string
}

export interface EducationCard {
  degree: string
  institution: string
  location: string
  period: string
  badge: string
  imageUrl: string
  imageCaption: string
  metrics: Metric[]
  description: string
  tags: string[]
}

export interface CurriculumModule {
  name: string
  desc: string
}

export const tabConfigs: TabConfig[] = [
  {
    label: 'CREDENTIAL 01',
    mobileLabel: '01. B.Sc',
    title: 'B.Sc. Software Engineering',
    icon: React.createElement(GraduationCap, { className: 'w-3.5 h-3.5 shrink-0' }),
    color: {
      bg: '#00b4d8',
      text: '#0a192f',
      border: '#00b4d8',
      cardBg: '#071526',
      accent: '#38bdf8',
      tagBg: 'rgba(0, 180, 216, 0.12)',
      tagBorder: 'rgba(0, 180, 216, 0.35)',
      tagText: '#38bdf8',
    },
    clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 100%, 0 100%)'
  },
  {
    label: 'CREDENTIAL 02',
    mobileLabel: '02. Entrep',
    title: 'Entrepreneurship Diploma',
    icon: React.createElement(Award, { className: 'w-3.5 h-3.5 shrink-0' }),
    color: {
      bg: '#18181b',
      text: '#ffffff',
      border: '#e4e4e7',
      cardBg: '#0f141c',
      accent: '#f4f4f5',
      tagBg: 'rgba(244, 244, 245, 0.1)',
      tagBorder: 'rgba(244, 244, 245, 0.25)',
      tagText: '#f4f4f5',
    },
    clipPath: 'polygon(22px 0, calc(100% - 22px) 0, 100% 100%, 0 100%)'
  },
  {
    label: 'CREDENTIAL 03',
    mobileLabel: '03. French',
    title: 'French Language Diploma',
    icon: React.createElement(BookOpen, { className: 'w-3.5 h-3.5 shrink-0' }),
    color: {
      bg: '#f59e0b',
      text: '#0a192f',
      border: '#f59e0b',
      cardBg: '#16130b',
      accent: '#fbbf24',
      tagBg: 'rgba(245, 158, 11, 0.12)',
      tagBorder: 'rgba(245, 158, 11, 0.35)',
      tagText: '#fbbf24',
    },
    clipPath: 'polygon(22px 0, calc(100% - 22px) 0, 100% 100%, 0 100%)'
  },
  {
    label: 'CREDENTIAL 04',
    mobileLabel: '04. High Sch',
    title: 'Secondary Education',
    icon: React.createElement(Medal, { className: 'w-3.5 h-3.5 shrink-0' }),
    color: {
      bg: '#e11d48',
      text: '#ffffff',
      border: '#e11d48',
      cardBg: '#190d14',
      accent: '#fb7185',
      tagBg: 'rgba(225, 29, 72, 0.14)',
      tagBorder: 'rgba(225, 29, 72, 0.35)',
      tagText: '#fb7185',
    },
    clipPath: 'polygon(22px 0, 100% 0, 100% 100%, 0 100%)'
  }
]

export const educationCards: EducationCard[] = [
  {
    degree: 'Bachelor of Science in Software Engineering',
    institution: 'First Technical University (now Abiola Ajimobi Technical University), Ibadan',
    location: 'Ibadan, Nigeria',
    period: '2021 – 2024',
    badge: 'Undergraduate Degree',
    imageUrl: '/abiola-ajimobi-1.png',
    imageCaption: 'First Technical University Senate & Engineering Complex',
    metrics: [
      { label: 'Final CGPA', value: '4.45 / 5.00', note: 'Second-Class Upper (Top 10%)' },
      { label: 'Peak Term', value: '5.0 / 5.0', note: 'Single Term Peak GPA' },
      { label: 'Honors', value: '4 Subject Awards', note: 'OS, SE Practice, HCI, Data Structures' }
    ],
    description: 'Graduated in the top 10% of cohort with a B.Sc. in Software Engineering (Second-Class Honours, Upper Division, 4.45 / 5.00 Final CGPA). Achieved a 5.0 / 5.0 peak term GPA along with four departmental subject excellence awards. Supervised thesis on intelligent location-based recommendation systems combining spatial distance heuristics with real-time hotel reservation engines under Dr. J.E.T. Akinsola.',
    tags: ['Software Engineering', 'Algorithmic Foundations', 'Intelligent Systems']
  },
  {
    degree: 'Diploma in Entrepreneurship',
    institution: 'First Technical University, Ibadan',
    location: 'Ibadan, Nigeria',
    period: '2021 – 2024',
    badge: 'Professional Diploma',
    imageUrl: '/abiola-ajimobi-2.png',
    imageCaption: 'Abiola Ajimobi Technical University Innovation Hub',
    metrics: [
      { label: 'Academic Standing', value: 'Upper Credit', note: 'Graduating Distinction' },
      { label: 'Faculty Rank', value: 'Top 10%', note: 'Faculty of Entrepreneurship' },
      { label: 'Venture Focus', value: 'Commercialization', note: 'Tech Lean Strategy' }
    ],
    description: 'Completed an intensive professional diploma in Entrepreneurship alongside engineering coursework at Abiola Ajimobi Technical University. Rigorously trained in technology enterprise creation, lean venture validation, financial modeling, and digital product commercialization strategies for scalable software platforms.',
    tags: ['Venture Creation', 'Lean Strategy', 'Market Economics']
  },
  {
    degree: 'Diploma in French Language',
    institution: 'First Technical University, Ibadan',
    location: 'Ibadan, Nigeria',
    period: '2021 – 2024',
    badge: 'Language Diploma',
    imageUrl: '/abiola-ajimobi.png',
    imageCaption: 'Centre for Language & General Studies',
    metrics: [
      { label: 'Academic Grade', value: 'Lower Credit', note: 'Centre for Language Studies' },
      { label: 'Curriculum Lens', value: 'Technical French', note: 'Professional Vocabulary' },
      { label: 'Competence', value: 'Bilingual Communication', note: 'Reading & Spoken Fluency' }
    ],
    description: 'Completed a diploma program in French Language at the Centre for Language and General Studies alongside undergraduate studies. Developed reading comprehension, conversational fluency, and professional translation skills in technical and academic French.',
    tags: ['Bilingual Studies', 'Technical French', 'Language Foundations']
  },
  {
    degree: 'Secondary School Education',
    institution: 'David Joel Model College, Ibadan',
    location: 'Ibadan, Nigeria',
    period: '2013 – 2019',
    badge: 'Secondary Education',
    imageUrl: '/david-joel.png',
    imageCaption: 'David Joel Model College Academic Campus',
    metrics: [
      { label: 'Qualification', value: 'SSCE / WASSCE', note: 'Senior Secondary Certificate' },
      { label: 'Academic Track', value: 'Pure Sciences', note: 'Physics, Math & Chemistry' },
      { label: 'Core Focus', value: 'Math & Computing', note: 'Analytical Base' }
    ],
    description: 'Completed senior secondary school education in Pure Sciences at David Joel Model College. Built strong foundational knowledge in advanced mathematics, physical sciences, and introductory computer studies that paved the way for university studies in software engineering.',
    tags: ['Science Track', 'Mathematics', 'Foundational Studies']
  }
]

export const curriculumModules: CurriculumModule[] = [
  { name: 'Algorithms & Complexity', desc: 'Big-O analysis, dynamic programming & graph theory' },
  { name: 'Artificial Intelligence', desc: 'Expert systems, inference logic & heuristic models' },
  { name: 'Data Structures & Algorithms', desc: 'Trees, heaps, graph search & algorithmic optimization' },
  { name: 'Discrete Structures', desc: 'Combinatorics, Boolean algebra & formal logic' },
  { name: 'Human Computer Interaction', desc: 'Interface design heuristics, usability & accessibility' },
  { name: 'Modelling & Simulation', desc: 'Stochastic process modeling & state simulations' },
  { name: 'Research Methodology in CS', desc: 'Empirical software testing & quantitative studies' }
]
