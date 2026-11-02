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

export const testimonialsData: Testimonial[] = []
