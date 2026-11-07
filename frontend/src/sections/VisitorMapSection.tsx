import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Loader2 } from 'lucide-react'
import { AnimatedWords } from '../components/AnimatedWords'
import { useVisitorStats } from '../hooks/useVisitorStats'
import { VisitorMapChart } from '../components/VisitorMapChart'
import { VisitorLeaderboard } from '../components/VisitorLeaderboard'

const titleCase = (s: string) => {
  if (!s) return ''
  return s.toLowerCase().replace(/(^|[\s-])(\S)/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase())
}

export const VisitorMapSection: React.FC = () => {
  const {
    data,
    connectionStatus,
    pinpointedData,
    pinpointLoading,
    handlePinpointCity
  } = useVisitorStats()

  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const isLocating = !data.userCountry || data.userCountry === 'LOCATING...'
  const isUnknownLocation = data.userCountry === 'UNKNOWN'
  const hasLocation = !isLocating && !isUnknownLocation
  const isPinpointed = Boolean(pinpointedData?.city)

  const userPlace = isPinpointed
    ? `${titleCase(pinpointedData!.city)}, ${titleCase(data.userCountry)}`
    : hasLocation
    ? titleCase(data.userCountry)
    : ''

  const countriesCount =
    Object.keys(data.countryStats).length > 0
      ? Object.keys(data.countryStats).length
      : hasLocation
      ? 1
      : 0

  const leaderboard = data.topCountries.slice(0, 5)
  const maxCount = Math.max(1, ...leaderboard.map((c) => c.count))

  const statusLabel = 'Live'

  const statusDot = 'bg-[var(--color-primary)]'

  const stats = [
    { label: 'Total visits', value: data.totalVisitors > 0 ? data.totalVisitors.toLocaleString() : '—' },
    { label: 'Countries reached', value: countriesCount > 0 ? countriesCount.toString() : '—' },
    {
      label: hasLocation ? `From ${titleCase(data.userCountry)}` : 'From your area',
      value: data.userCountryCount > 0 ? data.userCountryCount.toLocaleString() : '—'
    }
  ]

  let greeting = 'Locating region…'
  if (isUnknownLocation) {
    greeting = 'Welcome — thanks for reading from an untracked network.'
  } else if (hasLocation) {
    greeting = `You are visiting from ${userPlace}.`
  }

  return (
    <section id="visitors" className="py-12 sm:py-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[var(--color-border)] pt-12">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-14 items-end"
          >
            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold">
                // Visitors
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[var(--color-text-main)] mt-1">
                <AnimatedWords text="Readers around the world" />
              </h2>
            </div>
            <p className="lg:col-span-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Each highlighted country is somewhere this site has been opened from.
              The numbers update as new people drop by.
            </p>
          </motion.header>

          {/* Figures */}
          <dl className="mt-6 sm:mt-8 grid grid-cols-3 border-y border-[var(--color-border)] divide-x divide-[var(--color-border)]">
            {stats.map((s) => (
              <div key={s.label} className="py-4 sm:py-5 px-2.5 sm:px-8 first:pl-0">
                <dt className="text-[10px] sm:text-xs font-mono text-[var(--color-text-muted)] truncate">{s.label}</dt>
                <dd className="mt-1 sm:mt-1.5 text-lg sm:text-2xl md:text-[2rem] leading-none font-serif font-bold text-[var(--color-text-main)] tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Personal line + Voluntary city pin */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-[15px] text-[var(--color-text-muted)]">
            <p className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
              <span className="truncate">{greeting}</span>
            </p>

            {!isPinpointed && (
              <button
                type="button"
                onClick={handlePinpointCity}
                disabled={pinpointLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 text-[var(--color-primary)] text-xs font-mono hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                {pinpointLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <MapPin className="w-3.5 h-3.5" />
                )}
                <span>{pinpointLoading ? 'Pinpointing…' : 'Pinpoint my city on map'}</span>
              </button>
            )}
          </div>

          {/* Map + leaderboard */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <VisitorMapChart
              data={data}
              pinpointedData={pinpointedData}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              statusDot={statusDot}
              statusLabel={statusLabel}
            />

            <VisitorLeaderboard
              leaderboard={leaderboard}
              maxCount={maxCount}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisitorMapSection
