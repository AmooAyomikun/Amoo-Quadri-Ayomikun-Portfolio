import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { CornerDownLeft, MapPin, Loader2 } from 'lucide-react';
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
    { text: "Hi, this is Quadri's terminal.", type: 'output' },
    { text: "Type a command and press enter, or pick one below.", type: 'output' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Voluntary, user-initiated city pinpointing (zero popups on site entry)
  const [pinpointLoading, setPinpointLoading] = useState(false);
  const [pinpointedData, setPinpointedData] = useState<{ city: string; lat: number; lon: number } | null>(() => {
    try {
      const stored = localStorage.getItem('portfolio_user_pinpoint_geo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handlePinpointCity = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setPinpointLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const geo = await res.json();
            const city = geo.city || geo.locality || 'Verified City';
            const country = geo.countryName || data.userCountry || 'Nigeria';
            const countryCode = geo.countryCode || data.userCountryCode || 'NG';

            const newPinpoint = { city, lat: latitude, lon: longitude };
            setPinpointedData(newPinpoint);
            localStorage.setItem('portfolio_user_pinpoint_geo', JSON.stringify(newPinpoint));

            // Sync with backend database so it updates visitors.json / Firebase
            fetch(apiUrl('/api/visitors/log'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                country,
                countryCode,
                city,
                lat: latitude,
                lon: longitude
              })
            }).catch(() => {});
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        } finally {
          setPinpointLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission error:', err);
        setPinpointLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

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

    if (command === 'guestbook') {
      setTerminalLogs(prev => [
        ...prev,
        { text: `$ guestbook`, type: 'input' },
        { text: "Opening digital guestbook at /guestbook...", type: 'output' }
      ]);
      setTerminalInput('');
      setTimeout(() => {
        window.location.href = '/guestbook';
      }, 500);
      return;
    }

    setTerminalLogs(prev => [...prev, { text: `$ ${rawInput}`, type: 'input' }]);
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
    if (pinpointedData && data.userCountry) {
      const userNorm = normalizeCountry(data.userCountry);
      const userMarkerIdx = list.findIndex(l => normalizeCountry(l.country) === userNorm);
      if (userMarkerIdx >= 0) {
        list[userMarkerIdx] = {
          ...list[userMarkerIdx],
          city: pinpointedData.city,
          lat: pinpointedData.lat,
          lon: pinpointedData.lon
        };
      } else {
        list.push({
          city: pinpointedData.city,
          country: data.userCountry,
          countryCode: data.userCountryCode,
          lat: pinpointedData.lat,
          lon: pinpointedData.lon
        });
      }
    }
    return list.filter(l => typeof l.lat === 'number' && typeof l.lon === 'number' && !isNaN(l.lat) && !isNaN(l.lon));
  }, [data.locations, data.userCountry, data.userCountryCode, pinpointedData]);

  const isLocating = !data.userCountry || data.userCountry === 'LOCATING...';
  const isUnknownLocation = data.userCountry === 'UNKNOWN';

  const titleCase = (s: string) =>
    s.toLowerCase().replace(/(^|[\s-])(\S)/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());

  const hasLocation = !isLocating && !isUnknownLocation;
  const isPinpointed = Boolean(pinpointedData?.city);

  const userPlace = isPinpointed
    ? `${titleCase(pinpointedData!.city)}, ${titleCase(data.userCountry)}`
    : hasLocation
    ? titleCase(data.userCountry)
    : '';

  const countriesCount = Object.keys(data.countryStats).length > 0
    ? Object.keys(data.countryStats).length
    : (hasLocation ? 1 : 0);

  const leaderboard = data.topCountries.slice(0, 5);
  const maxCount = Math.max(1, ...leaderboard.map((c) => c.count));

  const statusLabel = connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting' : 'Offline';
  const statusDot = connectionStatus === 'connected' ? 'bg-[#64ffda]' : connectionStatus === 'connecting' ? 'bg-amber-400' : 'bg-[#495670]';

  const stats = [
    { label: 'Total visits', value: data.totalVisitors > 0 ? data.totalVisitors.toLocaleString() : '—' },
    { label: 'Countries', value: countriesCount.toString() },
    { label: 'Cities mapped', value: activeMarkers.length.toString() },
  ];

  const greeting = isLocating ? (
    <>Finding where you&apos;re reading from…</>
  ) : !hasLocation ? (
    <>Thanks for stopping by.</>
  ) : (
    <span className="flex flex-wrap items-center gap-y-1">
      <span>
        You&apos;re reading from <span className="text-[#ccd6f6] font-semibold">{userPlace}</span>
        {data.userCountryCount > 1
          ? <> — one of <span className="text-[#ccd6f6] tabular-nums">{data.userCountryCount.toLocaleString()}</span> visits from there.</>
          : <>. Welcome.</>}
      </span>
      {isPinpointed ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#64ffda] ml-2 px-2 py-0.5 rounded-full bg-[#112240] border border-[#64ffda]/30">
          <MapPin className="w-3 h-3 text-[#64ffda]" />
          <span>Exact city</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handlePinpointCity}
          disabled={pinpointLoading}
          className="inline-flex items-center gap-1.5 ml-2.5 px-2.5 py-0.5 rounded-full border border-[#233554] hover:border-[#64ffda] text-[#8892b0] hover:text-[#64ffda] text-xs font-mono transition-all cursor-pointer active:scale-95 disabled:opacity-60 bg-[#0a192f]"
          title="Optional: Detect your exact city using device GPS/Wi-Fi"
        >
          {pinpointLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-[#64ffda]" />
              <span>Pinpointing…</span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3 text-[#64ffda]" />
              <span>Pinpoint city</span>
            </>
          )}
        </button>
      )}
    </span>
  );

  return (
    <section id="visitors" className="pt-12 sm:pt-16 pb-4 sm:pb-6 bg-[var(--color-surface-base)] text-[#ccd6f6] relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[#233554] pt-12">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-14 items-end"
          >
            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase tracking-widest text-[#64ffda] font-semibold">
                // Visitors
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#ccd6f6] mt-1">
                <AnimatedWords text="Readers around the world" />
              </h2>
            </div>
            <p className="lg:col-span-5 text-sm leading-relaxed text-[#8892b0]">
              Each highlighted country is somewhere this site has been opened from.
              The numbers update as new people drop by.
            </p>
          </motion.header>

          {/* Figures */}
          <dl className="mt-8 sm:mt-10 grid grid-cols-3 border-y border-[var(--color-border)] divide-x divide-[var(--color-border)]">
            {stats.map((s) => (
              <div key={s.label} className="py-4 sm:py-5 px-2.5 sm:px-8 first:pl-0">
                <dt className="text-[10px] sm:text-xs font-mono text-[var(--color-text-muted)] truncate">{s.label}</dt>
                <dd className="mt-1 sm:mt-1.5 text-lg sm:text-2xl md:text-[2rem] leading-none font-serif font-bold text-[var(--color-text-main)] tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Personal line */}
          <p className="mt-5 sm:mt-6 text-xs sm:text-[15px] text-[var(--color-text-muted)] flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
            <span className="truncate">{greeting}</span>
          </p>

          {/* Map + leaderboard */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

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
                        const geoName = geo.properties?.name || '';
                        const isUserGeo = Boolean(
                          hasLocation &&
                          normalizeCountry(geoName) === normalizeCountry(data.userCountry)
                        );

                        const visitorCount = findCountryCount(geoName, data.countryStats);
                        const hasVisitors = visitorCount > 0 || isUserGeo;
                        const count = isUserGeo ? Math.max(visitorCount, data.userCountryCount) : visitorCount;

                        let fillColor = '#122a4a';
                        let strokeColor = '#0b1d36';
                        let strokeWidth = 0.5;

                        if (isUserGeo) {
                          fillColor = '#2a8f80';
                          strokeColor = '#64ffda';
                          strokeWidth = 0.9;
                        } else if (hasVisitors) {
                          fillColor = count >= 5 ? '#237468' : '#1b5650';
                          strokeColor = '#0b1d36';
                          strokeWidth = 0.5;
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
                              );
                            }}
                            onMouseLeave={() => setHoveredNode(null)}
                            style={{
                              default: { outline: 'none', transition: 'fill 0.15s ease' },
                              hover: {
                                fill: hasVisitors ? '#2fa392' : '#1a3760',
                                outline: 'none',
                                cursor: 'default',
                              },
                              pressed: { outline: 'none' },
                            } as any}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {activeMarkers.map((marker, idx) => {
                    const isUserCountry = normalizeCountry(marker.country) === normalizeCountry(data.userCountry);
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
                    );
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

            <aside className="lg:col-span-4">
              <h3 className="text-sm font-semibold text-[#ccd6f6]">Top countries</h3>
              <p className="text-xs font-mono text-[#8892b0]/70 mt-0.5">By number of visits</p>

              {leaderboard.length > 0 ? (
                <ol className="mt-5 border-t border-[#233554]">
                  {leaderboard.map((c) => (
                    <li key={c.name} className="py-3.5 border-b border-[#233554]">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="flex items-baseline gap-3 min-w-0">
                          <span className="font-mono text-xs text-[#495670] w-5 shrink-0">
                            {String(c.rank).padStart(2, '0')}
                          </span>
                          <span className="text-[#a8b2d1] truncate">{titleCase(c.name)}</span>
                        </span>
                        <span className="font-mono text-xs text-[#ccd6f6] tabular-nums">
                          {c.count.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 ml-8 h-[3px] bg-[#112240] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(c.count / maxCount) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                          className="h-full bg-[#64ffda]/70 rounded-full"
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-5 pt-5 border-t border-[#233554] text-sm text-[#8892b0]">
                  {connectionStatus === 'connecting' ? 'Loading…' : 'No visits recorded yet.'}
                </p>
              )}
            </aside>
          </div>

          {/* Console */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-lg border border-[#233554] bg-[#0b1d36]"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#233554]">
              <span className="font-mono text-xs text-[#8892b0]">guest@amooquadri.dev</span>
              <span className="text-xs text-[#495670] hidden sm:inline">Ask about my work, or pick a command</span>
            </div>

            <div className="h-44 overflow-y-auto px-5 py-4 space-y-2 font-mono text-[13px] leading-relaxed scrollbar-none">
              {terminalLogs.map((log, i) => (
                <div
                  key={i}
                  className={log.type === 'input' ? 'text-[#64ffda]' : 'text-[#a8b2d1]'}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            <div className="border-t border-[#233554] px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTerminalCommand();
                }}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <span className="font-mono text-sm text-[#64ffda]">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type a command or question"
                  aria-label="Terminal command"
                  className="bg-transparent text-[13px] text-[#ccd6f6] placeholder-[#495670] focus:outline-none w-full font-mono"
                />
                <button type="submit" aria-label="Send command" className="text-[#495670] hover:text-[#64ffda] transition-colors">
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                {['help', 'guestbook', 'skills', 'projects', 'contact', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => handleTerminalCommand(cmd)}
                    className="text-[#8892b0] hover:text-[#64ffda] underline-offset-4 hover:underline transition-colors cursor-pointer"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
