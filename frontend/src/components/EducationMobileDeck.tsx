import React from 'react'
import type { EducationCard, TabConfig } from '../content/educationData'

interface EducationMobileDeckProps {
  educationCards: EducationCard[]
  tabConfigs: TabConfig[]
  activeMobileCard?: number
  setActiveMobileCard?: (index: number) => void
}

/**
 * Mobile view for Education credentials:
 * Renders all 4 degrees and diplomas sequentially in a clean, scrollable feed
 * with curved dashed connectors, avoiding hidden tabs where users might miss cards.
 */
export const EducationMobileDeck: React.FC<EducationMobileDeckProps> = ({
  educationCards,
  tabConfigs
}) => {
  return (
    <div className="block md:hidden mb-12 space-y-4">
      {educationCards.map((card, idx) => {
        const config = tabConfigs[idx]
        const color = config.color

        return (
          <React.Fragment key={idx}>
            <div
              style={{
                backgroundColor: color.cardBg,
                borderColor: color.border
              }}
              className="border-2 rounded-2xl p-4 relative backdrop-blur-xl flex flex-col gap-3.5 shadow-lg overflow-hidden"
            >
              {/* Card Header with Step Number & Meta */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: color.bg, color: color.text }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-xs"
                  >
                    0{idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-300 uppercase block">
                      {card.period} · {card.badge}
                    </span>
                  </div>
                </div>
                <span 
                  style={{ color: color.accent, borderColor: color.border, backgroundColor: color.tagBg }}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0"
                >
                  {config.mobileLabel}
                </span>
              </div>

              {/* Title & Institution */}
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight leading-snug mb-1">
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
            </div>

            {/* Curved Dashed Connector between credential cards */}
            {idx < educationCards.length - 1 && (
              <div className="flex justify-center my-1 select-none pointer-events-none">
                <svg
                  className={`w-12 h-9 text-[var(--color-primary)]/40 ${idx % 2 === 1 ? '-scale-x-100' : ''}`}
                  viewBox="0 0 56 44"
                  fill="none"
                >
                  <path
                    d="M 16 0 V 14 C 16 28, 40 18, 40 34"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M 35 29 L 40 36 L 45 29"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default EducationMobileDeck
