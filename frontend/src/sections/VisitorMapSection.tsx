import React, { useEffect, useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Terminal, Globe, MapPin, Sparkles, CornerDownLeft } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface TopCountry {
  rank: number;
  name: string;
  code: string;
  count: number;
}

interface VisitorResponse {
  userCountry: string;
  userCountryCode: string;
  userCity: string;
  userCountryCount: number;
  totalVisitors: number;
  topCountries: TopCountry[];
  countryStats: Record<string, number>;
}

// Major country coordinates for glowing map pins
const COUNTRY_MARKERS = [
  { name: 'NIGERIA', city: 'Lagos', coordinates: [3.3792, 6.5244] },
  { name: 'BRAZIL', city: 'Brasília', coordinates: [-47.8919, -15.7975] },
  { name: 'FRANCE', city: 'Paris', coordinates: [2.3522, 48.8566] },
  { name: 'UNITED STATES', city: 'New York', coordinates: [-74.0060, 40.7128] },
  { name: 'SPAIN', city: 'Madrid', coordinates: [-3.7038, 40.4168] },
  { name: 'JAPAN', city: 'Tokyo', coordinates: [139.6503, 35.6762] },
  { name: 'GERMANY', city: 'Berlin', coordinates: [13.4050, 52.5200] },
  { name: 'UNITED KINGDOM', city: 'London', coordinates: [-0.1276, 51.5074] },
  { name: 'CANADA', city: 'Toronto', coordinates: [-79.3832, 43.6532] },
  { name: 'AUSTRALIA', city: 'Sydney', coordinates: [151.2093, -33.8688] }
];

export const VisitorMapSection: React.FC = () => {
  const [data, setData] = useState<VisitorResponse>({
    userCountry: 'DETECTING...',
    userCountryCode: 'NG',
    userCity: '...',
    userCountryCount: 1,
    totalVisitors: 1,
    topCountries: [],
    countryStats: {}
  });

  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type: 'input' | 'output' }>>([
    { text: "HI. THIS IS QUADRI'S TERMINAL.", type: 'output' },
    { text: "TYPE A COMMAND AND PRESS ENTER, OR JUST USE THE BUTTONS BELOW.", type: 'output' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logAndFetchVisitor = async () => {
      try {
        // Try local backend first, then production API
        const endpoints = [
          'http://localhost:5000/api/visitors/log',
          'https://portfolio-backend-st78.onrender.com/api/visitors/log'
        ];

        let res: Response | null = null;
        for (const ep of endpoints) {
          try {
            res = await fetch(ep, { method: 'POST' });
            if (res.ok) break;
          } catch (e) {
            // try next
          }
        }

        if (res && res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(prev => ({
              ...prev,
              userCountry: json.userCountry || prev.userCountry,
              userCountryCode: json.userCountryCode || prev.userCountryCode,
              userCity: json.userCity || prev.userCity,
              userCountryCount: json.userCountryCount || prev.userCountryCount,
              totalVisitors: json.totalVisitors || prev.totalVisitors,
              topCountries: json.topCountries || prev.topCountries,
              countryStats: json.countryStats || prev.countryStats
            }));
          }
        } else {
          // Client-side fallback geolocation lookup if backend offline
          const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
          if (geoRes.ok) {
            const geo = await geoRes.json();
            const country = (geo.country || 'NIGERIA').toUpperCase();
            setData(prev => ({
              ...prev,
              userCountry: country,
              userCountryCode: geo.country_code || 'NG',
              userCity: geo.city || 'Lagos'
            }));
          }
        }
      } catch (err) {
        console.warn('Visitor API fallback active');
      }
    };

    logAndFetchVisitor();
  }, []);

  const handleTerminalCommand = (cmdStr?: string) => {
    const command = (cmdStr || terminalInput).trim().toLowerCase();
    if (!command) return;

    const newLogs = [...terminalLogs, { text: `GUEST ~ $ ${command}`, type: 'input' as const }];

    if (command === 'help') {
      newLogs.push({ text: "AVAILABLE COMMANDS: help, about, skills, projects, contact, clear", type: 'output' });
    } else if (command === 'about') {
      newLogs.push({ text: "Quadri Ayomikun Amoo | M.Sc. Computer Science @ DSU | Software Engineer & AI Researcher.", type: 'output' });
    } else if (command === 'skills') {
      newLogs.push({ text: "React, TypeScript, Node.js, Python, PWA, Machine Learning, Geospatial Recommender Systems.", type: 'output' });
    } else if (command === 'projects') {
      newLogs.push({ text: "CleanReport PWA, Location-Based Hotel Recommender, KYNDA AI Assistant, Pathly LMS.", type: 'output' });
    } else if (command === 'contact') {
      newLogs.push({ text: "Email: amooayomikun12@gmail.com | LinkedIn: @amoo-quadri | GitHub: @AmooAyomikun", type: 'output' });
    } else if (command === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else {
      newLogs.push({ text: `Command not recognized: '${command}'. Type 'help' for available commands.`, type: 'output' });
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');

    setTimeout(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <section className="py-16 bg-[#050505] text-white border-t border-neutral-900 font-mono relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Retro Header Section */}
        <div className="mb-8 border-b border-neutral-900 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4FA4C] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#C4FA4C] font-bold">
              REAL-TIME VISITOR GEOLOCATION
            </span>
          </div>

          {/* Title and Explanation matching Samuel Rizzon screenshot */}
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-2 uppercase">
            VISITORS
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed mb-4 font-mono uppercase">
            EVERY LIT BLOCK IS A COUNTRY SOMEONE OPENED THIS SITE FROM. THE BRIGHTER, THE MORE OF THEM.
          </p>

          {/* Quick Metrics Bar matching screenshot */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono tracking-widest mb-6 border-y border-neutral-900/80 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[#C4FA4C] font-bold text-base sm:text-lg">{data.totalVisitors.toLocaleString()}</span>
              <span className="text-neutral-400 uppercase font-semibold">VISITORS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C4FA4C] font-bold text-base sm:text-lg">{Object.keys(data.countryStats).length || 1}</span>
              <span className="text-neutral-400 uppercase font-semibold">COUNTRIES</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C4FA4C] animate-pulse" />
              <span className="text-[#C4FA4C] font-bold text-base sm:text-lg">1</span>
              <span className="text-[#C4FA4C] uppercase font-semibold">HERE NOW</span>
            </div>
          </div>

          {/* Dynamic Geolocation Banner */}
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-[#C4FA4C] leading-snug mb-4 uppercase">
            YOU'RE IN {data.userCountry}. {data.userCountryCount.toLocaleString()} CAME FROM THERE TOO.
          </h3>

          {/* Top 5 Leaderboard Row */}
          {data.topCountries.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs sm:text-sm tracking-wider">
              {data.topCountries.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="text-neutral-500 font-bold">{c.rank}</span>
                  <span className="text-neutral-200 font-bold">{c.name}</span>
                  <span className="text-[#C4FA4C] font-bold">{c.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grid Container: Retro Pixel World Map + Interactive Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Map Box */}
          <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-center mb-3 px-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#C4FA4C]" /> Interactive Audience Map
              </span>
              <span className="text-neutral-500 text-[11px]">
                {data.totalVisitors.toLocaleString()} Total Global Visits
              </span>
            </div>

            {/* Map Canvas / ComposableMap */}
            <div className="relative w-full h-[320px] sm:h-[400px] bg-[#050505] rounded-xl border border-neutral-900 overflow-hidden">
              
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
                      const isUserGeo = geo.properties?.name?.toUpperCase() === data.userCountry;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isUserGeo ? "#1C3505" : "#111111"}
                          stroke={isUserGeo ? "#C4FA4C" : "#222222"}
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#1F3B08", outline: "none", cursor: "pointer" },
                            pressed: { outline: "none" }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* Country Markers */}
                {COUNTRY_MARKERS.map((marker) => {
                  const isUserCountry = marker.name === data.userCountry;
                  const count = data.countryStats[marker.name] || (isUserCountry ? data.userCountryCount : 100);

                  return (
                    <Marker 
                      key={marker.name} 
                      coordinates={marker.coordinates as [number, number]}
                      onMouseEnter={() => setHoveredCountry(`${marker.name} (${marker.city}): ${count.toLocaleString()} Visitors`)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >
                      {/* Pulse effect for user country */}
                      {isUserCountry && (
                        <circle r={12} fill="#C4FA4C" opacity={0.3}>
                          <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}

                      <circle 
                        r={isUserCountry ? 4.5 : 3} 
                        fill={isUserCountry ? "#C4FA4C" : "#A3E635"} 
                        stroke="#050505" 
                        strokeWidth={1}
                        className="cursor-pointer hover:scale-150 transition-transform"
                      />
                    </Marker>
                  );
                })}
              </ComposableMap>

              {/* Hover Tooltip overlay */}
              {hoveredCountry && (
                <div className="absolute top-4 left-4 bg-black/90 border border-[#C4FA4C] text-[#C4FA4C] px-3 py-1.5 rounded-lg text-xs font-mono shadow-lg pointer-events-none animate-fade-in">
                  {hoveredCountry}
                </div>
              )}

              {/* Map Footer Metadata */}
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px] text-neutral-500 font-mono bg-black/60 backdrop-blur-xs p-2 rounded-lg border border-neutral-900">
                <span>ACTIVE NODE: {data.userCity.toUpperCase()}, {data.userCountry}</span>
                <span className="text-[#C4FA4C]">LIVE STATS CONNECTED</span>
              </div>
            </div>

          </div>

          {/* Interactive Terminal Widget (Right Column) */}
          <div className="lg:col-span-5 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 shadow-xl flex flex-col h-[420px]">
            {/* Terminal Top Window Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-900 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold text-neutral-300">GUEST@AMOOQUADRI.DEV</span>
              </div>
              <Terminal className="w-4 h-4 text-[#C4FA4C]" />
            </div>

            {/* Terminal Logs Output Scroll View */}
            <div className="flex-1 overflow-y-auto space-y-2 text-xs leading-relaxed scrollbar-none pr-1">
              {terminalLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={log.type === 'input' ? 'text-[#C4FA4C] font-bold' : 'text-neutral-300'}
                >
                  {log.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick Action Button Shortcuts */}
            <div className="pt-3 border-t border-neutral-900 mt-2">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['help', 'about', 'skills', 'projects', 'contact', 'clear'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => handleTerminalCommand(cmd)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-[#C4FA4C] text-[10px] font-mono rounded border border-neutral-800 transition-colors cursor-pointer"
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
                className="flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800 focus-within:border-[#C4FA4C]"
              >
                <span className="text-[#C4FA4C] font-bold">GUEST ~ $</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="TYPE A COMMAND..."
                  className="bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none w-full font-mono"
                />
                <button type="submit" aria-label="Send command" className="text-neutral-400 hover:text-[#C4FA4C]">
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

