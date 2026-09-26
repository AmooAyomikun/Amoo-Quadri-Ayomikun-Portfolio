import React, { createContext, useContext, useState } from 'react'

export type LensMode = 'all' | 'research' | 'industry'

interface LensContextType {
  lens: LensMode
  setLens: (lens: LensMode) => void
}

const LensContext = createContext<LensContextType | undefined>(undefined)

export const LensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lens, setLensState] = useState<LensMode>('all')

  const setLens = (newLens: LensMode) => {
    setLensState(newLens)
  }

  return (
    <LensContext.Provider value={{ lens, setLens }}>
      {children}
    </LensContext.Provider>
  )
}

export const useLens = (): LensContextType => {
  const context = useContext(LensContext)
  if (!context) {
    throw new Error('useLens must be used within a LensProvider')
  }
  return context
}
