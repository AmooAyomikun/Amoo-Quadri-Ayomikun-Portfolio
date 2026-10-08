import React, { useEffect, useState, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Terminal, Globe, CornerDownLeft } from 'lucide-react';

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
          } catch {
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
      } catch {
        console.warn('Visitor API fallback active');
      }
    };

    logAndFetchVisitor();
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

    // Add user input to terminal logs
    setTerminalLogs(prev => [...prev, { text: `GUEST ~ $ ${rawInput}`, type: 'input' }]);
    setTerminalInput('');

    // Instant local static command responses
    if (command === 'help') {
      setTerminalLogs(prev => [...prev, { text: "AVAILABLE COMMANDS: help, about, skills, projects, contact, clear. Or ask me ANY natural question!", type: 'output' }]);
      return;
    } else if (command === 'about') {
      setTerminalLogs(prev => [...prev, { text: "Quadri Ayomikun Amoo | First-Class Software Engineering Graduate (5.0/5.0 Major GPA, 4.45/5.00 CGPA) @ Abiola Ajimobi Technical University | Full-Stack & AI Engineer.", type: 'output' }]);
      return;
    } else if (command === 'skills') {
      setTerminalLogs(prev => [...prev, { text: "React, TypeScript, Node.js, Python, PWA, SQL, PostgreSQL, Machine Learning, Generative AI, Geospatial Recommender Systems.", type: 'output' }]);
      return;
    } else if (command === 'projects') {
      setTerminalLogs(prev => [...prev, { text: "1. CleanReport PWA | 2. Location-Based Hotel Recommender | 3. KYNDA AI Assistant | 4. Pathly LMS | 5. Financial Churn ML Models", type: 'output' }]);
      return;
    } else if (command === 'contact') {
      setTerminalLogs(prev => [...prev, { text: "Email: amooquadri555@gmail.com | Phone: +234 9071812921 | LinkedIn: linkedin.com/in/ayomikun-amoo-6b836428b | GitHub: github.com/amooquadri", type: 'output' }]);
      return;
    }

    // Temporary thinking log
    setTerminalLogs(prev => [...prev, { text: "AI: THINKING...", type: 'output' }]);

    try {
      const endpoints = [
        'http://localhost:5000/api/chat',
        'https://portfolio-backend-st78.onrender.com/api/chat'
      ];

      let reply = '';
      for (const ep of endpoints) {
        try {
          const res = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: rawInput })
          });
          if (res.ok) {
            const json = await res.json();
            if (json.reply) {
              reply = json.reply;
              break;
            }
          }
        } catch {
          // try next endpoint
        }
      }

      if (!reply) {
        // Fallback local smart response engine if backend offline
        const lower = command;

        const isGreeting = /\b(yo|wassup|what's up|sup|hi|hello|hey|heyy|howdy|hola|good morning|good afternoon|good evening|how are you|how far|wagywan)\b/i.test(lower);

        if (isGreeting && !/\b(study|studied|school|gpa|cgpa|education|degree|where|research|thesis|project|projects|skill|skills|job|experience|contact|email|phone|goal|goals|vision|aim|award|awards|who)\b/i.test(lower)) {
          reply = "Yo! What's up? 👋 I'm Quadri's AI Assistant. I'm doing great! Ask me anything about Quadri's software engineering projects, AI research, 5.0/5.0 Major GPA, education, or how to get in touch!";
        } else if (/\b(study|studied|where|education|degree|university|school|college|gpa|cgpa|major|french|entrepreneurship|diploma|honors|rank|class)\b/i.test(lower)) {
          reply = "Quadri earned his B.Sc. in Software Engineering from Abiola Ajimobi Technical University (formerly First Technical University), Ibadan, graduating with First-Class Honors (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA, Top 10% of class). He also holds Diplomas in French (Lower Credit) and Entrepreneurship (Upper Credit).";
        } else if (/\b(goal|goals|vision|future|career|aspire|aspirations|aim|msc|phd|postgraduate|scholarship|scholarships|next step)\b/i.test(lower)) {
          reply = "Quadri's primary goal is to pursue M.Sc. and Ph.D. research in Artificial Intelligence, Software Engineering, and Natural Language Processing while engineering intelligent computing systems that solve high-impact, real-world problems.";
        } else if (/\b(award|awards|honors|prizes|prize|best student|subject honors|recognition)\b/i.test(lower)) {
          reply = "Quadri received 4 Best Graduating Student Subject Honors: Operating Systems I, Human Computer Interaction (HCI), Software Engineering Professional Practice, and Fundamentals of Data Structures. He was also in the Top 10% of his graduating class.";
        } else if (/\b(who|bio|summary|background|identity|intro|overview)\b/i.test(lower)) {
          reply = "Quadri Ayomikun Amoo is a Software Engineering Researcher & Full-Stack Engineer with a First-Class Honors degree (5.0/5.0 Major GPA, 4.45/5.00 CGPA) from Abiola Ajimobi Technical University. He specializes in AI for Software Engineering, intelligent web systems (React, TypeScript, PWA, Node.js), and data analytics.";
        } else if (/\b(research|thesis|supervisor|supervisors|sinebe|akinsola|hotel|recommender|geospatial|lab|publication|publications|scholar)\b/i.test(lower)) {
          reply = "Quadri's research focuses on AI for Software Engineering and Intelligent Systems. His B.Sc. thesis under Dr. J.E.T. Akinsola developed a location-based hotel management & recommendation engine. He also served as Research Assistant (NYSC) under Prof. Jude Sinebe at the Postgraduate Research Lab.";
        } else if (/\b(experience|work|job|jobs|intern|internship|internships|company|companies|circo|orange|codealpha|coast)\b/i.test(lower)) {
          reply = "Industrial Experience:\n• Frontend Intern @ Circo Digital / Orange Programme (built CleanReport PWA with offline sync & maps)\n• Full Stack Intern @ CodeAlpha (built React/TypeScript/Node.js web apps)\n• Data Analyst Intern @ Coast Research Tech (built 10 financial ML models in Python/SQL & Power BI dashboards)";
        } else if (/\b(cleanreport|sanitation|civic|pwa|offline)\b/i.test(lower)) {
          reply = "CleanReport is a civic-tech PWA built by Quadri during his Circo Digital / Orange internship. It enables citizens to report sanitation issues offline, automatically syncing reports to the cloud upon reconnection with interactive maps and admin management.";
        } else if (/\b(kynda|pathly|lms|study assistant)\b/i.test(lower)) {
          reply = "• KYNDA AI: An AI-powered study assistant delivering interactive learning, question generation, and real-time study feedback.\n• Pathly LMS: A modern learning management system streamlining online course delivery and student-instructor workflows.";
        } else if (/\b(teach|teaching|tutor|tutoring|mentor|mentorship|nassa|students)\b/i.test(lower)) {
          reply = "Teaching Experience:\n• Undergraduate Tutor: Tutored ~350 computer science students weekly in Data Structures, Algorithms, and OOP.\n• Asst. Academic Support Officer @ NASSA: Taught 100 lower-level students Mathematics and Python programming.";
        } else if (/\b(skill|skills|stack|tech|technology|technologies|language|languages|python|react|typescript|javascript|node|sql|postgresql|tailwind|ml|machine learning)\b/i.test(lower)) {
          reply = "Core Technical Stack:\n• Frontend: React, TypeScript, JavaScript, HTML5, Modern CSS, Tailwind CSS, PWA\n• Backend & Databases: Python, Node.js, Express.js, Django REST, SQL, PostgreSQL, MySQL, Supabase, Prisma\n• AI & Data Science: Machine Learning, Generative AI, NLP, Data Analytics, Power BI\n• Tools: Git, GitHub, Postman, Vite";
        } else if (/\b(project|projects|portfolio|built|apps|systems)\b/i.test(lower)) {
          reply = "Featured Projects:\n1. CleanReport PWA (Civic-tech offline sanitation platform)\n2. Location-Based Hotel Recommender System (B.Sc. Thesis)\n3. KYNDA AI Study Assistant\n4. Pathly LMS\n5. Financial Churn Prediction ML Models (10 models built with Python/SQL)";
        } else if (/\b(contact|email|phone|hire|recruiter|reach|linkedin|github|address|location|where live|nigeria|ibadan)\b/i.test(lower)) {
          reply = "Get in Touch with Quadri:\n• Email: amooquadri555@gmail.com\n• Phone: +234 9071812921\n• LinkedIn: linkedin.com/in/ayomikun-amoo-6b836428b\n• GitHub: github.com/amooquadri\n• Location: Ibadan, Oyo State, Nigeria (Available worldwide for research, engineering, and graduate positions!)";
        } else {
          reply = "I am Quadri's AI Portfolio Assistant! Quadri Amoo is a First-Class Software Engineering Graduate (5.0/5.0 Major GPA) specializing in AI, React, TypeScript, and Data Science.\n\nYou can ask me about:\n• Education & GPA (e.g., 'where did he study', 'awards')\n• Research & Thesis (e.g., 'tell me about his thesis')\n• Projects & Work Experience (e.g., 'what has he built', 'internships')\n• Technical Skills (e.g., 'what languages does he use')\n• Future Goals (e.g., 'what are his goals')\n• Contact Details (e.g., 'how can I hire or email Quadri')";
        }
      }

      // Replace THINKING... with actual AI reply
      setTerminalLogs(prev => {
        const filtered = prev.filter(l => l.text !== "AI: THINKING...");
        return [...filtered, { text: reply, type: 'output' }];
      });

    } catch {
      setTerminalLogs(prev => {
        const filtered = prev.filter(l => l.text !== "AI: THINKING...");
        return [...filtered, { text: "Sorry, I couldn't process your request right now. Try 'help' for available commands!", type: 'output' }];
      });
    }

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

