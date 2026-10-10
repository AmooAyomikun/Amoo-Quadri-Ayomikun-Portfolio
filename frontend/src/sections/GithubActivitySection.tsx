import React, { useEffect, useState, useMemo } from 'react';
import { Terminal, ExternalLink, ChevronDown } from 'lucide-react';
import { format, subDays, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';

interface ContributionDay {
  date: Date;
  dateStr: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const currentYear = new Date().getFullYear();
const DYNAMIC_YEARS = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

export const GithubActivitySection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [username, setUsername] = useState<string>('AmooAyomikun'); // Will update from backend
  const [realContributions, setRealContributions] = useState<{
    totalContributions: number;
    daysMap: Record<string, { level: 0 | 1 | 2 | 3 | 4; count: number }>;
  } | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

  // Fetch real GitHub contribution graph from backend API or GitHub direct
  useEffect(() => {
    let isMounted = true;

    const fetchRealContributions = async () => {
      try {
        const endpoints = [
          `http://localhost:5000/api/github-contributions?year=${selectedYear}`,
          `https://portfolio-backend-st78.onrender.com/api/github-contributions?year=${selectedYear}`
        ];

        let data: any = null;
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (res.ok) {
              data = await res.json();
              break;
            }
          } catch {
            // try next endpoint
          }
        }

        if (data && isMounted) {
          if (data.username) {
            setUsername(data.username);
          }
          const map: Record<string, { level: 0 | 1 | 2 | 3 | 4; count: number }> = {};
          if (Array.isArray(data.days)) {
            data.days.forEach((d: any) => {
              if (d.date) {
                map[d.date] = {
                  level: Math.min(4, Math.max(0, d.level || 0)) as 0 | 1 | 2 | 3 | 4,
                  count: d.count || 0
                };
              }
            });
          }
          setRealContributions({
            totalContributions: data.totalContributions ?? 0,
            daysMap: map
          });
        }
      } catch (err) {
        console.warn('Real GitHub contribution fetch fallback active:', err);
      }
    };

    fetchRealContributions();

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Generate 52 weeks (365 days) contribution calendar matrix for selected year
  const { contributionMatrix, totalContributions, monthLabels } = useMemo(() => {
    const today = new Date(); // Use actual current date
    
    // Determine start and end date for the selected year grid
    let startDate: Date;
    let endDate: Date;

    if (selectedYear === currentYear) {
      endDate = today;
      startDate = subDays(today, 364);
    } else {
      startDate = startOfYear(new Date(selectedYear, 0, 1));
      endDate = endOfYear(new Date(selectedYear, 0, 1));
    }

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    const displayTotal = realContributions
      ? realContributions.totalContributions
      : 0;

    const daysData: ContributionDay[] = allDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      let count = 0;

      if (realContributions && realContributions.daysMap[dateStr]) {
        level = realContributions.daysMap[dateStr].level;
        count = realContributions.daysMap[dateStr].count;
      }

      return {
        date: d,
        dateStr,
        count,
        level
      };
    });

    // Group into 52/53 columns (weeks), each containing up to 7 days
    const columns: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Pad first week if start date is not Sunday
    const firstDayOfWeek = startDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: new Date(0),
        dateStr: '',
        count: -1, // Empty placeholder slot
        level: 0
      });
    }

    daysData.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        columns.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      columns.push(currentWeek);
    }

    // Build month header labels across columns
    const months: { name: string; colIndex: number }[] = [];
    let lastMonth = -1;

    columns.forEach((col, colIdx) => {
      const validDay = col.find(d => d.count !== -1);
      if (validDay) {
        const m = validDay.date.getMonth();
        if (m !== lastMonth) {
          months.push({
            name: format(validDay.date, 'MMM'),
            colIndex: colIdx
          });
          lastMonth = m;
        }
      }
    });

    return {
      contributionMatrix: columns,
      totalContributions: displayTotal,
      monthLabels: months
    };
  }, [selectedYear, realContributions]);

  // Contribution level color mappings matching GitHub UI
  const getLevelColor = (level: number, isEmptyPlaceholder: boolean) => {
    if (isEmptyPlaceholder) return 'transparent';
    switch (level) {
      case 0: return 'bg-[#161B22] border border-neutral-900/60';
      case 1: return 'bg-[#0E4429] border border-[#0E4429]';
      case 2: return 'bg-[#006D32] border border-[#006D32]';
      case 3: return 'bg-[#26A641] border border-[#26A641]';
      case 4: return 'bg-[#39D353] border border-[#39D353] shadow-[0_0_8px_rgba(57,211,83,0.4)]';
      default: return 'bg-[#161B22]';
    }
  };

  return (
    <section className="py-16 bg-[#050505] text-white border-t border-neutral-900 font-mono relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Retro Command Section Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-900 text-[#C4FA4C] text-xs font-mono font-bold border border-neutral-800 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>github_activity.ts</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold text-white tracking-tight mb-2">GitHub Activity</h2>
          <p className="text-neutral-400 font-mono text-xs sm:text-sm">
            Latest contributions, pull requests, and code activity from{' '}
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#C4FA4C] font-bold hover:underline inline-flex items-center gap-1"
            >
              @{username} <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>
        </div>

        {/* Main Grid Container matching GitHub Official Profile UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main 52-Week Contribution Heatmap Box */}
          <div className="lg:col-span-10 bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 shadow-2xl relative">
            
            {/* Header: Total count & Contribution settings */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#21262D]">
              <h3 className="text-base sm:text-lg font-sans font-semibold text-neutral-100">
                <span className="font-bold text-white">{totalContributions.toLocaleString()}</span> contributions in {selectedYear === currentYear ? 'the last year' : selectedYear}
              </h3>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-[#21262D] hover:bg-[#30363D] text-xs text-neutral-300 font-sans rounded-md border border-neutral-700/60 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span>Contribution settings</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Heatmap Canvas Container */}
            <div className="overflow-x-auto scrollbar-none pb-2">
              <div className="min-w-[720px]">
                
                {/* Month labels row */}
                <div className="flex text-[11px] font-mono text-neutral-400 mb-2 pl-8 relative h-4">
                  {monthLabels.map((m, idx) => (
                    <span 
                      key={idx} 
                      className="absolute transform -translate-x-1/2"
                      style={{ left: `${32 + m.colIndex * 13.5}px` }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Grid Body: Day labels on left + 52 Column heatmap */}
                <div className="flex items-start gap-2">
                  
                  {/* Day labels column */}
                  <div className="flex flex-col justify-between text-[10px] font-mono text-neutral-400 h-[104px] py-1 select-none pr-1">
                    <span className="h-3 leading-none"></span>
                    <span className="h-3 leading-none">Mon</span>
                    <span className="h-3 leading-none"></span>
                    <span className="h-3 leading-none">Wed</span>
                    <span className="h-3 leading-none"></span>
                    <span className="h-3 leading-none">Fri</span>
                    <span className="h-3 leading-none"></span>
                  </div>

                  {/* 52 Column Grid */}
                  <div className="flex gap-[3px] flex-1">
                    {contributionMatrix.map((col, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-[3px]">
                        {col.map((day, dayIdx) => {
                          const isEmpty = day.count === -1;
                          return (
                            <div
                              key={dayIdx}
                              onMouseEnter={(e) => {
                                if (!isEmpty) {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setHoveredDay({
                                    day,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 8
                                  });
                                }
                              }}
                              onMouseLeave={() => setHoveredDay(null)}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-all duration-150 ${
                                getLevelColor(day.level, isEmpty)
                              } ${!isEmpty ? 'hover:scale-125 hover:z-10 cursor-pointer' : ''}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer Legend Row matching GitHub */}
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 pt-4 mt-2 border-t border-[#21262D]/60">
                  <a 
                    href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/showing-an-overview-of-your-activity-on-your-profile" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-[#C4FA4C] hover:underline"
                  >
                    Learn how we count contributions
                  </a>

                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[#161B22] border border-neutral-800" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[#0E4429]" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[#006D32]" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[#26A641]" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-[#39D353]" />
                    <span>More</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Year Filter Tabs matching GitHub profile sidebar */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {DYNAMIC_YEARS.map(yr => {
              const isActive = yr === selectedYear;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`shrink-0 lg:w-full py-2 px-4 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer text-left flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-[#1F6FEB] text-white shadow-lg font-bold'
                      : 'bg-[#0D1117] hover:bg-[#161B22] text-neutral-400 border border-[#21262D]'
                  }`}
                >
                  <span>{yr}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </div>

        </div>

        {/* Hover Tooltip display */}
        {hoveredDay && (
          <div
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-black/90 text-white text-[11px] font-mono px-3 py-1.5 rounded-lg border border-[#39D353] shadow-xl pointer-events-none animate-fade-in"
            style={{ left: `${hoveredDay.x}px`, top: `${hoveredDay.y}px` }}
          >
            <span className="font-bold text-[#C4FA4C]">
              {hoveredDay.day.count === 0 ? 'No' : hoveredDay.day.count} contribution{hoveredDay.day.count === 1 ? '' : 's'}
            </span>{' '}
            on {format(hoveredDay.day.date, 'MMM d, yyyy')}
          </div>
        )}

      </div>
    </section>
  );
};

