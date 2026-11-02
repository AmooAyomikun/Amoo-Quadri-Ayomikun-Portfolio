import React from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { Calendar, ArrowDown } from 'lucide-react'
import type { EducationCard, TabConfig } from '../content/educationData'

interface EducationDesktopDeckProps {
  educationCards: EducationCard[]
  tabConfigs: TabConfig[]
  trackRef: React.RefObject<HTMLDivElement | null>
  jumpToCard: (index: number) => void
}

export const EducationDesktopDeck: React.FC<EducationDesktopDeckProps> = ({
  educationCards,
  tabConfigs,
  trackRef,
  jumpToCard
}) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { scrollYProgress } = useScroll({
    target: trackRef as React.RefObject<HTMLElement>,
    offset: ['start start', 'end end']
  })

  const y1 = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.3, 1.0],
    ['calc(100% - 44px)', 'calc(100% - 44px)', '0%', '0%']
  )

  const y2 = useTransform(
    scrollYProgress,
    [0.0, 0.18, 0.3, 0.48, 0.6, 1.0],
    ['100%', '100%', 'calc(100% - 44px)', 'calc(100% - 44px)', '0%', '0%']
  )

  const y3 = useTransform(
    scrollYProgress,
    [0.0, 0.48, 0.6, 0.78, 0.9, 1.0],
    ['100%', '100%', 'calc(100% - 44px)', 'calc(100% - 44px)', '0%', '0%']
  )

  const cardTransforms: Array<{ y: number | MotionValue<string> }> = [
    { y: 0 },
    { y: y1 },
    { y: y2 },
    { y: y3 }
  ]

  // Accessibility reduced-motion path: render cards as a standard accessible list without scroll-jacking
  if (prefersReducedMotion) {
    return (
      <div className="hidden md:flex flex-col gap-8 mb-14">
        {educationCards.map((card, cardIdx) => {
          const config = tabConfigs[cardIdx]
          const color = config.color
          return (
            <div
              key={cardIdx}
              style={{
                backgroundColor: color.cardBg,
                borderColor: color.border
              }}
              className="border-2 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-6 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{ backgroundColor: color.bg }}
                  className="w-3 h-3 rounded-full inline-block shrink-0"
                />
                <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  {card.period} · {card.badge}
                </span>
                <span className="ml-auto text-xs font-mono font-bold" style={{ color: color.accent }}>
                  {config.label}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
                    {card.degree}
                  </h2>
                  <p className="text-sm text-neutral-300 font-medium">
                    {card.institution} {card.location && `· ${card.location}`}
                  </p>
                  <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                    {card.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/10">
                    {card.metrics.map((m, mi) => (
                      <div key={mi}>
                        <span className="text-[10px] font-mono uppercase text-neutral-400 block tracking-wider">
                          {m.label}
                        </span>
                        <span style={{ color: color.accent }} className="text-sm font-mono font-bold block mt-0.5">
                          {m.value}
                        </span>
                        {m.note && <span className="text-[10px] text-neutral-400 block mt-0.5">{m.note}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {card.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        style={{ backgroundColor: color.tagBg, borderColor: color.tagBorder, color: color.tagText }}
                        className="text-xs font-mono border px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-white/20 aspect-[16/10]">
                  <img src={card.imageUrl} alt={card.institution} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-black/85 text-white border border-white/20 block truncate">
                      {card.imageCaption}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Interactive scroll-stacking deck (desktop)
  return (
    <div ref={trackRef} className="hidden md:block relative h-[360vh] mb-14">
      {/* Pinned Sticky Stage */}
      <div className="sticky top-12 sm:top-14 max-w-5xl mx-auto w-full px-2 sm:px-0">
        <div className="relative w-full h-[470px] sm:h-[450px] overflow-hidden rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
          {educationCards.map((card, cardIdx) => {
            const config = tabConfigs[cardIdx]
            const color = config.color
            const transform = cardTransforms[cardIdx]

            return (
              <motion.div
                key={cardIdx}
                style={{
                  y: transform.y,
                  zIndex: 10 + cardIdx * 10
                }}
                className="absolute inset-0 w-full h-full"
              >
                {/* V-Notch Tab Row */}
                <div className="relative h-11 select-none pointer-events-none w-full">
                  <button
                    type="button"
                    onClick={() => jumpToCard(cardIdx)}
                    style={{
                      left: `${cardIdx * 25}%`,
                      width: '25%',
                      backgroundColor: color.bg,
                      color: color.text,
                      clipPath: config.clipPath
                    }}
                    className="pointer-events-auto absolute top-0 h-11 px-1.5 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs md:text-sm tracking-wider uppercase font-black cursor-pointer shadow-md transition-all hover:brightness-110 select-none z-10"
                    title={`Jump to: ${config.title}`}
                  >
                    {config.icon}
                    <span className="hidden sm:inline truncate">{config.label}</span>
                    <span className="sm:hidden truncate">{config.mobileLabel}</span>
                  </button>
                </div>

                {/* Card Body */}
                <div
                  style={{
                    backgroundColor: color.cardBg,
                    borderColor: color.border
                  }}
                  className="h-[calc(100%-44px)] border-2 rounded-b-2xl p-4 sm:p-5 sm:px-6 relative backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center h-full">
                    {/* Left Column (58%) */}
                    <div className="lg:col-span-7 flex flex-col justify-between h-full min-w-0 py-0.5">
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

                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug mb-1">
                          {card.degree}
                        </h2>

                        <p className="text-xs text-neutral-300 font-medium mb-2 truncate">
                          {card.institution} {card.location && <span className="text-neutral-400">· {card.location}</span>}
                        </p>

                        <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-sans line-clamp-3 mb-2.5">
                          {card.description}
                        </p>
                      </div>

                      {/* Academic Metrics */}
                      <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/40 border border-white/10 mb-2.5">
                        {card.metrics.map((m, mi) => (
                          <div key={mi} className="min-w-0">
                            <span className="text-[9px] font-mono uppercase text-neutral-400 block tracking-wider truncate">
                              {m.label}
                            </span>
                            <span
                              style={{ color: color.accent }}
                              className="text-xs sm:text-sm font-mono font-bold block mt-0.5 truncate"
                            >
                              {m.value}
                            </span>
                            {m.note && (
                              <span className="text-[9px] text-neutral-400 block mt-0.5 font-sans truncate" title={m.note}>
                                {m.note}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Topic Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/10">
                        {card.tags.map((tag, ti) => (
                          <span
                            key={ti}
                            style={{
                              backgroundColor: color.tagBg,
                              borderColor: color.tagBorder,
                              color: color.tagText
                            }}
                            className="text-[10px] sm:text-[11px] font-mono border px-2.5 py-0.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Column (42%) */}
                    <div className="lg:col-span-5 flex flex-col justify-between h-full min-w-0 py-0.5">
                      <div className="relative group/photo overflow-hidden rounded-xl border-2 border-white/20 bg-black/60 shadow-lg h-[240px] sm:h-[260px] w-full">
                        <img
                          src={card.imageUrl}
                          alt={card.institution}
                          className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-sm">
                          <Calendar className="w-3 h-3 text-neutral-300" />
                          <span>{card.period}</span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-white border border-white/20 block truncate">
                            {card.imageCaption}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-mono">
                        {cardIdx === 0 ? (
                          <a
                            href="#academic-awards"
                            style={{ color: color.accent }}
                            className="hover:underline flex items-center gap-1 font-semibold text-xs transition-colors ml-auto"
                          >
                            <span>View 4 Subject Awards Below</span>
                            <ArrowDown className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-mono ml-auto">
                            {card.badge} · Verified Academic Record
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EducationDesktopDeck
