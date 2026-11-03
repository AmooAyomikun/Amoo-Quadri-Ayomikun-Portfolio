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

            {/* Stylish Curved Dashed Connector between credential cards */}
            {idx < educationCards.length - 1 && (
              <div className="flex justify-center my-3 select-none pointer-events-none">
                <svg
                  className="w-20 h-14 text-[var(--color-primary)] drop-shadow-[0_2px_8px_rgba(100,255,218,0.2)]"
                  viewBox="0 0 100 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id={`deck-grad-${idx}`} x1="36%" y1="0%" x2="64%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="var(--color-primary)" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  {/* Subtle glow path */}
                  <path
                    d="M 36 2 C 36 26, 64 26, 64 48"
                    stroke="var(--color-primary)"
                    strokeWidth="3.5"
                    strokeOpacity="0.15"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Top origin glowing anchor dot */}
                  <circle cx="36" cy="3" r="2.5" fill="var(--color-primary)" />

                  {/* Main smooth S-curve */}
                  <path
                    d="M 36 2 C 36 26, 64 26, 64 48"
                    stroke={`url(#deck-grad-${idx})`}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Downward arrowhead entering bottom card */}
                  <path
                    d="M 58 43 L 64 52 L 70 43"
                    stroke="var(--color-primary)"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
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
