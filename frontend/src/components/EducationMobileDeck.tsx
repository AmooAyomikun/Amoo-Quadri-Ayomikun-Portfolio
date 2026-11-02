import React from 'react'
import { motion } from 'framer-motion'
import type { EducationCard, TabConfig } from '../content/educationData'

interface EducationMobileDeckProps {
  educationCards: EducationCard[]
  tabConfigs: TabConfig[]
  activeMobileCard: number
  setActiveMobileCard: (index: number) => void
}

export const EducationMobileDeck: React.FC<EducationMobileDeckProps> = ({
  educationCards,
  tabConfigs,
  activeMobileCard,
  setActiveMobileCard
}) => {
  const card = educationCards[activeMobileCard]
  const config = tabConfigs[activeMobileCard]
  const color = config.color

  return (
    <div className="block md:hidden mb-12">
      {/* Mobile Tab Selector */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tabConfigs.map((cfg, idx) => {
          const isActive = activeMobileCard === idx
          const cfgColor = cfg.color
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveMobileCard(idx)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all border ${
                isActive
                  ? 'shadow-lg ring-1 ring-white/20'
                  : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] border-[var(--color-border)] opacity-75 hover:opacity-100'
              }`}
              style={isActive ? { backgroundColor: cfgColor.bg, color: cfgColor.text, borderColor: cfgColor.border } : {}}
            >
              {cfg.icon}
              <span className="truncate">{cfg.mobileLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Active Mobile Card Display */}
      <motion.div
        key={activeMobileCard}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          backgroundColor: color.cardBg,
          borderColor: color.border
        }}
        className="border-2 rounded-2xl p-4 relative backdrop-blur-xl flex flex-col gap-4 shadow-xl overflow-hidden"
      >
        {/* Meta badge & Degree Title */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              style={{ backgroundColor: color.bg }}
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
            />
            <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
              {card.period} · {card.badge}
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-white tracking-tight leading-snug mb-1">
            {card.degree}
          </h2>
          <p className="text-xs text-neutral-300 font-medium">
            {card.institution}
          </p>
        </div>

        {/* Campus Photo */}
        <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black/60 aspect-[16/10] w-full">
          <img
            src={card.imageUrl}
            alt={card.institution}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2 right-2">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-white border border-white/20 block truncate">
              {card.imageCaption}
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-neutral-200 leading-relaxed font-sans">
          {card.description}
        </p>

        {/* Academic Metrics */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
          {card.metrics.map((m, mi) => (
            <div key={mi} className="min-w-0">
              <span className="text-[9px] font-mono uppercase text-neutral-400 block tracking-wider truncate">
                {m.label}
              </span>
              <span
                style={{ color: color.accent }}
                className="text-xs font-mono font-bold block mt-0.5 truncate"
              >
                {m.value}
              </span>
              {m.note && (
                <span className="text-[9px] text-neutral-400 block mt-0.5 font-sans truncate">
                  {m.note}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/10">
          {card.tags.map((tag, ti) => (
            <span
              key={ti}
              style={{
                backgroundColor: color.tagBg,
                borderColor: color.tagBorder,
                color: color.tagText
              }}
              className="text-[10px] font-mono border px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default EducationMobileDeck
