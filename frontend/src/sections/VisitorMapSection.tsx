import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Terminal, Globe, CornerDownLeft, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedWords } from '../components/AnimatedWords';
import { apiUrl } from '../lib/api';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface TopCountry {
  rank: number;
  name: string;
  code: string;
  count: number;
}

interface VisitorLocation {
  lat: number;
  lon: number;
  city: string;
  country: string;
  countryCode?: string;
}

interface VisitorResponse {
  userCountry: string;
  userCountryCode: string;
  userCity: string;
  userCountryCount: number;
  totalVisitors: number;
  topCountries: TopCountry[];
  countryStats: Record<string, number>;
  locations: VisitorLocation[];
}

// Country name normalization dictionary (Issue 4.4: TopoJSON vs Geolocation API naming discrepancies)
const COUNTRY_ALIASES: Record<string, string> = {
  'united states of america': 'united states',
  'usa': 'united states',
  'us': 'united states',
  'united kingdom': 'united kingdom',
  'great britain': 'united kingdom',
  'uk': 'united kingdom',
  'england': 'united kingdom',
  'russian federation': 'russia',
  'korea, republic of': 'south korea',
  'republic of korea': 'south korea',
  'korea': 'south korea',
  'dem. rep. congo': 'democratic republic of the congo',
  'democratic republic of the congo': 'democratic republic of the congo',
  'congo': 'republic of the congo',
  'czech republic': 'czechia',
  'viet nam': 'vietnam',
  'iran, islamic republic of': 'iran',
  'syrian arab republic': 'syria',
  'tanzania, united republic of': 'tanzania',
  'ivory coast': "côte d'ivoire",
  'lao pdr': 'laos',
  'moldova, republic of': 'moldova',
  'venezuela, bolivarian republic of': 'venezuela',
  'bolivia, plurinational state of': 'bolivia',
};

const normalizeCountry = (name: string): string => {
  if (!name) return '';
  let s = name.toLowerCase().trim();
  s = s.replace(/^the\s+/, '');
  if (COUNTRY_ALIASES[s]) {
    return COUNTRY_ALIASES[s];
  }
  for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
    if (s === alias || s.includes(alias) || alias.includes(s)) {
      return canonical;
    }
  }
  return s;
};

const findCountryCount = (geoName: string, stats: Record<string, number>): number => {
  if (!geoName || !stats) return 0;
  if (typeof stats[geoName] === 'number') return stats[geoName];
  const normGeo = normalizeCountry(geoName);
  for (const [key, count] of Object.entries(stats)) {
    if (normalizeCountry(key) === normGeo) {
      return count;
    }
  }
  return 0;
};

export const VisitorMapSection: React.FC = () => {
  // Issue 4.3: Real initial state without fake 100 visitors or fake country counts
  const [data, setData] = useState<VisitorResponse>({
    userCountry: 'LOCATING...',
    userCountryCode: '',
    userCity: '',
    userCountryCount: 0,
    totalVisitors: 0,
    topCountries: [],
    countryStats: {},
    locations: []
  });

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: 'input' | 'output' }>>([
    { text: "HI. THIS IS QUADRI'S TERMINAL.", type: 'output' },
    { text: "TYPE A COMMAND AND PRESS ENTER, OR JUST USE THE BUTTONS BELOW.", type: 'output' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const initDynamicGeolocation = async () => {
      const SESSION_KEY = 'portfolio_visitor_session_logged';
      const CACHED_USER_GEO = 'portfolio_user_geo';

      // 1. Client-side IP Geolocation cache check
      let clientGeo: any = null;
      const cachedGeoStr = sessionStorage.getItem(CACHED_USER_GEO);
      if (cachedGeoStr) {
        try {
          clientGeo = JSON.parse(cachedGeoStr);
        } catch {
          // ignore corrupted cache
        }
      }

      if (!clientGeo) {
        try {
          const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: AbortSignal.timeout(3000) });
          if (geoRes.ok) {
            clientGeo = await geoRes.json();
            if (clientGeo) {
              sessionStorage.setItem(CACHED_USER_GEO, JSON.stringify(clientGeo));
            }
          }
        } catch (err) {
          console.warn('Client geolocation note:', err);
        }
      }

      // Issue 4.1: Do NOT invent Lagos/Nigeria if lookup fails!
      const country = clientGeo?.country ? clientGeo.country.toUpperCase() : '';
      const countryCode = clientGeo?.country_code || '';
      const city = clientGeo?.city || '';
      const lat = clientGeo?.latitude ? parseFloat(clientGeo.latitude) : null;
      const lon = clientGeo?.longitude ? parseFloat(clientGeo.longitude) : null;

      if (isMounted && country) {
        setData(prev => ({
          ...prev,
          userCountry: country,
          userCountryCode: countryCode,
          userCity: city
        }));
      }

      // Issue 4.5: Deduplicate logging per session using sessionStorage
      const isAlreadyLogged = sessionStorage.getItem(SESSION_KEY) === 'true';

      try {
        if (isAlreadyLogged) {
          // Already logged during this browser session; fetch current stats via GET /api/visitors
          setConnectionStatus('connecting');
          const res = await fetch(apiUrl('/api/visitors'), { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            const json = await res.json();
            if (isMounted) {
              setConnectionStatus('connected');
              const countryCount = country ? (json.countryStats?.[country] || findCountryCount(country, json.countryStats) || 1) : 1;
              setData(prev => ({
                ...prev,
                userCountry: country || prev.userCountry || 'UNKNOWN',
                userCountryCode: countryCode || prev.userCountryCode,
                userCity: city || prev.userCity,
                userCountryCount: countryCount,
                totalVisitors: typeof json.total === 'number' ? json.total : prev.totalVisitors,
                topCountries: Array.isArray(json.topCountries) ? json.topCountries : prev.topCountries,
                countryStats: json.countryStats || prev.countryStats,
                locations: Array.isArray(json.locations) ? json.locations : prev.locations
              }));
            }
          } else {
            if (isMounted) setConnectionStatus('offline');
          }
        } else {
          // First visit in this session: log visitor via POST /api/visitors/log
          setConnectionStatus('connecting');
          const logPayload = clientGeo ? {
            country: clientGeo.country,
            countryCode: clientGeo.country_code,
            city: clientGeo.city,
            lat,
            lon
          } : {};

          const res = await fetch(apiUrl('/api/visitors/log'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logPayload),
            signal: AbortSignal.timeout(6000)
          });

          if (res.ok) {
            const json = await res.json();
            sessionStorage.setItem(SESSION_KEY, 'true');
            if (isMounted && json.success) {
              setConnectionStatus('connected');
              setData(prev => ({
                ...prev,
                userCountry: json.userCountry || country || 'UNKNOWN',
                userCountryCode: json.userCountryCode || countryCode,
                userCity: json.userCity || city,
                userCountryCount: json.userCountryCount || 1,
                totalVisitors: json.totalVisitors || 1,
                topCountries: Array.isArray(json.topCountries) ? json.topCountries : [],
                countryStats: json.countryStats || {},
                locations: Array.isArray(json.locations) ? json.locations : []
              }));
            }
          } else {
            if (isMounted) setConnectionStatus('offline');
          }
        }
      } catch (err) {
        console.warn('Visitor sync note:', err);
        if (isMounted) setConnectionStatus('offline');
      }
    };

    initDynamicGeolocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTerminalCommand = async (cmdStr?: string) => {
    const rawInput = (cmdStr || terminalInput).trim();
    if (!rawInput) return;

    const command = rawInput.toLowerCase();

    if (command === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    }

    setTerminalLogs(prev => [...prev, { text: `GUEST ~ $ ${rawInput}`, type: 'input' }]);
    setTerminalInput('');

    setTerminalLogs(prev => [...prev, { text: "AI: PROCESSING...", type: 'output' }]);

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawInput })
      });

      let reply = '';
      if (res.ok) {
        const json = await res.json();
        reply = json.reply;
      }

      if (!reply) {
        reply = "I am Quadri's AI Assistant! Ask me anything about Quadri's software engineering projects, AI research, 5.0/5.0 Major GPA, or how to get in touch.";
      }

      setTerminalLogs(prev => {
        const filtered = prev.filter(l => l.text !== "AI: PROCESSING...");
        return [...filtered, { text: reply, type: 'output' }];
      });
    } catch {
      setTerminalLogs(prev => {
        const filtered = prev.filter(l => l.text !== "AI: PROCESSING...");
        return [...filtered, { text: "AI service temporarily unreachable. Type 'clear' to reset terminal or email amooquadri555@gmail.com.", type: 'output' }];
      });
    }

    setTimeout(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Issue 4.3: Distinct visitor markers from real location data only
  const activeMarkers = useMemo(() => {
    const list = [...data.locations];
    return list.filter(l => typeof l.lat === 'number' && typeof l.lon === 'number' && !isNaN(l.lat) && !isNaN(l.lon));
  }, [data.locations]);

  const isLocating = !data.userCountry || data.userCountry === 'LOCATING...';
  const isUnknownLocation = data.userCountry === 'UNKNOWN';

  const bannerHeadline = isLocating
    ? 'CONNECTING TO GLOBAL VISITOR TELEMETRY...'
    : isUnknownLocation
    ? "WELCOME TO QUADRI'S RESEARCH PORTAL!"
    : data.userCountryCount <= 1
    ? `YOU'RE VISITING FROM ${data.userCity ? data.userCity.toUpperCase() + ', ' : ''}${data.userCountry}. WELCOME TO QUADRI'S RESEARCH PORTAL!`
    : `YOU'RE IN ${data.userCity ? data.userCity.toUpperCase() + ', ' : ''}${data.userCountry}. ${data.userCountryCount.toLocaleString()} VISITOR SESSIONS RECORDED FROM YOUR REGION.`;

  return (
    <section className="py-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)] border-t border-[var(--color-border)] font-mono relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Retro Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 border-b border-[var(--color-border)] pb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'connected' ? 'bg-[#64ffda] animate-ping' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-xs uppercase tracking-widest text-[#64ffda] font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" /> REAL-TIME AUDIENCE TELEMETRY
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[var(--color-text-main)] mb-2 uppercase">
            <AnimatedWords text="GLOBAL VISITOR GEOLOCATION" />
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-3xl leading-relaxed mb-4 font-mono uppercase">
            EVERY LIT BLOCK IS A COUNTRY SOMEONE OPENED THIS SITE FROM. DYNAMIC PINGS PULSE IN REAL-TIME ACROSS ACTIVE REGIONS.
          </p>

          {/* Dynamic Metrics Bar (Issue 4.3: dynamic verified metrics) */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono tracking-widest mb-6 border-y border-[var(--color-border)]/80 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[#64ffda] font-bold text-base sm:text-lg">
                {data.totalVisitors > 0 ? data.totalVisitors.toLocaleString() : '...'}
              </span>
              <span className="text-[var(--color-text-muted)] uppercase font-semibold">TOTAL VISITS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#64ffda] font-bold text-base sm:text-lg">
                {Object.keys(data.countryStats).length > 0
                  ? Object.keys(data.countryStats).length
                  : (!isLocating && !isUnknownLocation ? 1 : 0)}
              </span>
              <span className="text-[var(--color-text-muted)] uppercase font-semibold">COUNTRIES RECORDED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
              <span className="text-[#64ffda] font-bold text-base sm:text-lg">{activeMarkers.length}</span>
              <span className="text-[#64ffda] uppercase font-semibold">ACTIVE NODES</span>
            </div>
          </div>

          {/* Dynamic Geolocation Banner */}
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-[#64ffda] leading-snug mb-4 uppercase">
            {bannerHeadline}
          </h3>

          {/* Top Leaderboard Row */}
          {data.topCountries.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs sm:text-sm tracking-wider">
              {data.topCountries.slice(0, 5).map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-[var(--color-text-subtle)] font-bold">{c.rank}</span>
                  <span className="text-[var(--color-text-muted)] font-bold">{c.name}</span>
                  <span className="text-[#64ffda] font-bold">{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Grid Container: Retro Pixel World Map + Interactive Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Map Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-4 relative overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center mb-3 px-2 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5 font-bold">
                <Globe className="w-4 h-4 text-[#64ffda]" /> Interactive Global Node Map
              </span>
              <span className={`text-[11px] font-mono flex items-center gap-1.5 ${connectionStatus === 'connected' ? 'text-[#64ffda]' : connectionStatus === 'connecting' ? 'text-amber-400' : 'text-neutral-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-[#64ffda] animate-pulse' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-ping' : 'bg-neutral-600'}`} />
                {connectionStatus === 'connected' ? 'Telemetry Active' : connectionStatus === 'connecting' ? 'Syncing Telemetry' : 'Offline'}
              </span>
            </div>

            {/* Map Canvas / ComposableMap */}
            <div className="relative w-full h-[320px] sm:h-[400px] bg-[#0a192f] rounded-xl border border-[var(--color-border)] overflow-hidden">
              
              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{ scale: 145, center: [10, 10] }}
                width={800}
                height={420}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const geoName = geo.properties?.name || '';
                      const isUserGeo = Boolean(
                        data.userCountry &&
                        data.userCountry !== 'LOCATING...' &&
                        data.userCountry !== 'UNKNOWN' &&
                        normalizeCountry(geoName) === normalizeCountry(data.userCountry)
                      );

                      // Issue 4.4: Normalized country lookup so all recorded countries are lit up
                      const visitorCount = findCountryCount(geoName, data.countryStats);
                      const hasVisitors = visitorCount > 0 || isUserGeo;
                      const count = isUserGeo ? Math.max(visitorCount, data.userCountryCount) : visitorCount;

                      let fillColor = "#112240";
                      let strokeColor = "#233554";
                      let strokeWidth = 0.4;

                      if (isUserGeo) {
                        fillColor = "#134e4a";
                        strokeColor = "#64ffda";
                        strokeWidth = 1.2;
                      } else if (hasVisitors) {
                        fillColor = count >= 5 ? "#115e59" : "#0f3e3a";
                        strokeColor = count >= 5 ? "#64ffda" : "#2dd4bf";
                        strokeWidth = 0.75;
                      }

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          onMouseEnter={() => {
                            if (hasVisitors) {
                              setHoveredNode(`${geoName}: ${count} visitor${count > 1 ? 's' : ''}`);
                            } else {
                              setHoveredNode(geoName);
                            }
                          }}
                          onMouseLeave={() => setHoveredNode(null)}
                          style={{
                            default: { outline: "none", transition: "fill 0.2s ease" },
                            hover: {
                              fill: hasVisitors ? "#0d9488" : "#1e3a5f",
                              stroke: "#64ffda",
                              strokeWidth: 1.0,
                              outline: "none",
                              cursor: "pointer"
                            },
                            pressed: { outline: "none" }
                          } as any}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* Dynamic Visitor Markers (Issue 4.3: Real locations only) */}
                {activeMarkers.map((marker, idx) => {
                  const isUserCountry = normalizeCountry(marker.country) === normalizeCountry(data.userCountry);

                  return (
                    <Marker 
                      key={`${marker.city}-${marker.lat}-${marker.lon}-${idx}`} 
                      coordinates={[marker.lon, marker.lat]}
                      onMouseEnter={() => setHoveredNode(`${marker.city || 'Verified Location'}, ${marker.country}`)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Pulse effect for user location marker */}
                      {isUserCountry && (
                        <circle r={14} fill="#64ffda" opacity={0.3}>
                          <animate attributeName="r" values="6;18;6" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      <circle 
                        r={isUserCountry ? 5 : 3.5} 
                        fill={isUserCountry ? "#64ffda" : "#38bdf8"} 
                        stroke="#0a192f" 
                        strokeWidth={1.2}
                        className="cursor-pointer hover:scale-150 transition-transform"
                      />
                    </Marker>
                  );
                })}
              </ComposableMap>

              {/* Hover Tooltip overlay */}
              {hoveredNode && (
                <div className="absolute top-4 left-4 bg-[#020c1b]/95 border border-[#64ffda] text-[#64ffda] px-3 py-1.5 rounded-lg text-xs font-mono shadow-xl pointer-events-none animate-fade-in flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-ping" />
                  <span>{hoveredNode}</span>
                </div>
              )}

              {/* Map Footer Metadata (Issue 4.3: Dynamic status instead of hardcoded strings) */}
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px] text-[var(--color-text-muted)] font-mono bg-[#020c1b]/80 backdrop-blur-xs p-2 rounded-lg border border-[var(--color-border)]">
                <span>
                  CLIENT NODE: {data.userCity && data.userCity !== 'Unknown' ? `${data.userCity.toUpperCase()}, ` : ''}{data.userCountry}
                </span>
                <span className={`font-bold ${connectionStatus === 'connected' ? 'text-[#64ffda]' : connectionStatus === 'connecting' ? 'text-amber-400' : 'text-neutral-500'}`}>
                  {connectionStatus === 'connected' ? 'TELEMETRY CONNECTED' : connectionStatus === 'connecting' ? 'SYNCING TELEMETRY...' : 'OFFLINE TELEMETRY'}
                </span>
              </div>
            </div>

          </motion.div>

          {/* Interactive Terminal Widget (Right Column) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xl flex flex-col h-[420px]"
          >
            {/* Terminal Top Window Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold text-[var(--color-text-main)]">GUEST@AMOOQUADRI.DEV</span>
              </div>
              <Terminal className="w-4 h-4 text-[#64ffda]" />
            </div>

            {/* Terminal Logs Output Scroll View */}
            <div className="flex-1 overflow-y-auto space-y-2 text-xs leading-relaxed scrollbar-none pr-1 font-mono">
              {terminalLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={log.type === 'input' ? 'text-[#64ffda] font-bold' : 'text-[var(--color-text-muted)]'}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick Action Button Shortcuts */}
            <div className="pt-3 border-t border-[var(--color-border)] mt-2">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['help', 'about', 'skills', 'projects', 'contact', 'clear'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => handleTerminalCommand(cmd)}
                    className="px-2 py-1 bg-[var(--color-surface-elevated)] hover:bg-[#233554] text-[#64ffda] text-[10px] font-mono rounded border border-[var(--color-border)] transition-colors cursor-pointer active:scale-95"
                  >
                    ${cmd}
                  </button>
                ))}
              </div>

              {/* Command Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTerminalCommand();
                }}
                className="flex items-center gap-2 bg-[#0a192f] px-3 py-2 rounded-xl border border-[var(--color-border)] focus-within:border-[#64ffda]"
              >
                <span className="text-[#64ffda] font-bold">GUEST ~ $</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="TYPE A COMMAND OR QUESTION..."
                  className="bg-transparent text-xs text-[var(--color-text-main)] placeholder-slate-500 focus:outline-none w-full font-mono"
                />
                <button type="submit" aria-label="Send command" className="text-[var(--color-text-muted)] hover:text-[#64ffda]">
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
