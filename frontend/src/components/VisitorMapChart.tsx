import React from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { motion } from 'framer-motion'
import {
  type VisitorResponse,
  normalizeCountry,
  findCountryCount,
  type PinpointedGeo
} from '../hooks/useVisitorStats'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface VisitorMapChartProps {
  data: VisitorResponse
  pinpointedData: PinpointedGeo | null
  hoveredNode: string | null
  setHoveredNode: (val: string | null) => void
  statusDot: string
  statusLabel: string
}

const titleCase = (s: string) => {
  if (!s) return ''
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
}

export const VisitorMapChart: React.FC<VisitorMapChartProps> = ({
  data,
  pinpointedData,
  hoveredNode,
  setHoveredNode,
  statusDot,
  statusLabel
}) => {
  const hasLocation = Boolean(data.userCountry && data.userCountry !== 'LOCATING...')

  const activeMarkers = React.useMemo(() => {
    const list = [...(data.locations || [])]
    if (pinpointedData) {
      list.push({
        city: pinpointedData.city,
        lat: pinpointedData.lat,
        lon: pinpointedData.lon,
        country: data.userCountry,
        countryCode: data.userCountryCode
      })
    }
    return list
  }, [data.locations, data.userCountry, data.userCountryCode, pinpointedData])

  return (
    <motion.figure
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-8"
    >
      <div className="relative w-full h-[260px] sm:h-[360px] rounded-lg border border-[#233554] bg-[#0b1d36] overflow-hidden">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 145, center: [10, 10] }}
          width={800}
          height={420}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = (geo.properties?.name as string) || ''
                const isUserGeo = Boolean(
                  hasLocation &&
                  normalizeCountry(geoName) === normalizeCountry(data.userCountry)
                )

                const visitorCount = findCountryCount(geoName, data.countryStats)
                const hasVisitors = visitorCount > 0 || isUserGeo
                const count = isUserGeo ? Math.max(visitorCount, data.userCountryCount) : visitorCount

                let fillColor = '#122a4a'
                let strokeColor = '#0b1d36'
                let strokeWidth = 0.5

                if (isUserGeo) {
                  fillColor = '#2a8f80'
                  strokeColor = '#64ffda'
                  strokeWidth = 0.9
                } else if (hasVisitors) {
                  fillColor = count >= 5 ? '#237468' : '#1b5650'
                  strokeColor = '#0b1d36'
                  strokeWidth = 0.5
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    onMouseEnter={() => {
                      setHoveredNode(
                        hasVisitors
                          ? `${geoName} · ${count} visit${count === 1 ? '' : 's'}`
                          : geoName
                      )
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ outline: 'none' }}
                    className="outline-none transition-colors duration-150 cursor-default"
                  />
                )
              })
            }
          </Geographies>

          {activeMarkers.map((marker, idx) => {
            const isUserCountry = normalizeCountry(marker.country) === normalizeCountry(data.userCountry)
            return (
              <Marker
                key={`${marker.city}-${marker.lat}-${marker.lon}-${idx}`}
                coordinates={[marker.lon, marker.lat]}
                onMouseEnter={() => setHoveredNode(`${marker.city || 'Unknown city'}, ${titleCase(marker.country)}`)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {isUserCountry && (
                  <circle r={9} fill="none" stroke="#64ffda" strokeWidth={1} opacity={0.6} />
                )}
                <circle
                  r={isUserCountry ? 3.5 : 2.5}
                  fill={isUserCountry ? '#64ffda' : '#ccd6f6'}
                  stroke="#0b1d36"
                  strokeWidth={1}
                />
              </Marker>
            )
          })}
        </ComposableMap>

        {hoveredNode && (
          <div className="absolute top-3 left-3 bg-[#0a192f] border border-[#233554] text-[#ccd6f6] px-2.5 py-1 rounded text-xs font-mono pointer-events-none">
            {hoveredNode}
          </div>
        )}
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8892b0]">
        <span className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1b5650]" /> Visited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#2a8f80] ring-1 ring-[#64ffda]" /> You
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccd6f6]" /> City
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} /> {statusLabel}
        </span>
      </figcaption>
    </motion.figure>
  )
}

export default VisitorMapChart
