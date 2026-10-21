import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Terminal, ExternalLink, ChevronDown, Check, Settings, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { format, subDays, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedWords } from '../components/AnimatedWords';
import { apiUrl } from '../lib/api';

interface ContributionDay {
  date: Date;
  dateStr: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

type ColorTheme = 'classic' | 'cyberpunk' | 'ocean' | 'sunset';

const currentYear = new Date().getFullYear();
const DYNAMIC_YEARS = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

export const GithubActivitySection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [username, setUsername] = useState<string>('AmooAyomikun');
  const [realContributions, setRealContributions] = useState<{
    totalContributions: number;
    daysMap: Record<string, { level: 0 | 1 | 2 | 3 | 4; count: number }>;
  } | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);

  // Settings State (Issue 3.8)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('classic');
  const [includePrivate, setIncludePrivate] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    if (settingsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [settingsOpen]);

  // Fetch real GitHub contribution graph from backend API
  useEffect(() => {
    let isMounted = true;

    const fetchRealContributions = async () => {
      try {
        const res = await fetch(apiUrl(`/api/github-contributions?year=${selectedYear}`));
        if (res.ok) {
          const data = await res.json();
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

  // Generate 52 weeks contribution calendar matrix
  const { contributionMatrix, totalContributions, monthLabels } = useMemo(() => {
    const today = new Date();
    
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

    const multiplier = includePrivate ? 1 : 0.65;
    const baseTotal = realContributions ? realContributions.totalContributions : 0;
    const displayTotal = Math.round(baseTotal * multiplier);

    const daysData: ContributionDay[] = allDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      let count = 0;

      if (realContributions && realContributions.daysMap[dateStr]) {
        level = realContributions.daysMap[dateStr].level;
        count = realContributions.daysMap[dateStr].count;
        if (!includePrivate && level > 0) {
          level = Math.max(0, level - 1) as 0 | 1 | 2 | 3 | 4;
          count = Math.max(0, Math.floor(count * 0.65));
        }
      }

      return {
        date: d,
        dateStr,
        count,
        level
      };
    });

    const columns: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    const firstDayOfWeek = startDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: new Date(0),
        dateStr: '',
        count: -1,
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
  }, [selectedYear, realContributions, includePrivate]);

  // Color theme generator
  const getLevelColor = (level: number, isEmptyPlaceholder: boolean) => {
    if (isEmptyPlaceholder) return 'transparent';

    if (colorTheme === 'cyberpunk') {
      switch (level) {
        case 0: return 'bg-[#112240] border border-[#233554]';
        case 1: return 'bg-[#0d3b43] border border-[#134e56]';
        case 2: return 'bg-[#165a65] border border-[#1f7583]';
        case 3: return 'bg-[#299d95] border border-[#37b8af]';
        case 4: return 'bg-[#64ffda] border border-[#9bfce5] shadow-[0_0_8px_rgba(100,255,218,0.5)]';
        default: return 'bg-[#112240]';
      }
    }

    if (colorTheme === 'ocean') {
      switch (level) {
        case 0: return 'bg-[#161B22] border border-neutral-900/60';
        case 1: return 'bg-[#0A3069] border border-[#0A3069]';
        case 2: return 'bg-[#0969DA] border border-[#0969DA]';
        case 3: return 'bg-[#54AEFF] border border-[#54AEFF]';
        case 4: return 'bg-[#80CCFF] border border-[#B6E3FF] shadow-[0_0_8px_rgba(84,174,255,0.4)]';
        default: return 'bg-[#161B22]';
      }
    }

    if (colorTheme === 'sunset') {
      switch (level) {
        case 0: return 'bg-[#161B22] border border-neutral-900/60';
        case 1: return 'bg-[#5C1D11] border border-[#5C1D11]';
        case 2: return 'bg-[#BD561D] border border-[#BD561D]';
        case 3: return 'bg-[#FA8900] border border-[#FA8900]';
        case 4: return 'bg-[#FFB703] border border-[#FFD000] shadow-[0_0_8px_rgba(255,183,3,0.4)]';
        default: return 'bg-[#161B22]';
      }
    }

    // Default: classic GitHub Green
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
    <section className="py-12 sm:py-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)] font-mono relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[#233554] pt-12">
        
        {/* Retro Command Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[#64ffda] text-xs font-mono font-bold border border-[var(--color-border)] mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>github_activity.ts</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold text-[var(--color-text-main)] tracking-tight mb-2">
            <AnimatedWords text="GitHub Activity" />
          </h2>
          <p className="text-[var(--color-text-muted)] font-mono text-xs sm:text-sm">
            Latest contributions, pull requests, and code activity from{' '}
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#64ffda] font-bold hover:underline inline-flex items-center gap-1"
            >
              @{username} <ExternalLink className="w-3 h-3 inline" />
            </a>
          </p>
        </motion.div>

        {/* Main Grid Container matching GitHub Official Profile UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main 52-Week Contribution Heatmap Box */}
          <div className="lg:col-span-10 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-2xl relative">
            
            {/* Header: Total count & Contribution settings */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--color-border)]">
              <h3 className="text-base sm:text-lg font-sans font-semibold text-[var(--color-text-main)]">
                <span className="font-bold text-white">{totalContributions.toLocaleString()}</span> contributions in {selectedYear === currentYear ? 'the last year' : selectedYear}
              </h3>

              {/* Functional Contribution settings menu (Issue 3.8) */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(prev => !prev)}
                  className="px-3 py-1.5 bg-[var(--color-surface-elevated)] hover:bg-[#233554] text-xs text-[var(--color-text-muted)] font-sans rounded-md border border-[var(--color-border)] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#64ffda]" />
                  <span>Contribution settings</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Settings Popover Dropdown */}
                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-[#112240] border border-[#233554] rounded-xl p-4 shadow-2xl z-50 text-xs font-sans text-neutral-200 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#233554]">
                        <span className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px]">
                          <Settings className="w-3.5 h-3.5 text-[#64ffda]" /> HEATMAP SETTINGS
                        </span>
                        <button onClick={() => setSettingsOpen(false)} className="text-neutral-400 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Private Contributions Toggle */}
                      <div>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-neutral-300">Include private activity</span>
                          <input
                            type="checkbox"
                            checked={includePrivate}
                            onChange={(e) => setIncludePrivate(e.target.checked)}
                            className="rounded accent-[#64ffda] w-4 h-4 cursor-pointer"
                          />
                        </label>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Simulate public-only vs total activity across repositories.
                        </p>
                      </div>

                      {/* Color Palette Selector */}
                      <div>
                        <span className="block text-[11px] font-bold text-neutral-300 uppercase font-mono mb-2">
                          COLOR THEME
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                          {[
                            { key: 'classic', label: 'Classic Green', color: '#39D353' },
                            { key: 'cyberpunk', label: 'Neon Teal', color: '#64ffda' },
                            { key: 'ocean', label: 'Ocean Blue', color: '#54AEFF' },
                            { key: 'sunset', label: 'Sunset Orange', color: '#FA8900' }
                          ].map(t => (
                            <button
                              key={t.key}
                              onClick={() => setColorTheme(t.key as ColorTheme)}
                              className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                colorTheme === t.key
                                  ? 'border-[#64ffda] bg-white/5 font-bold text-white'
                                  : 'border-[#233554] text-neutral-400 hover:border-neutral-500'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                                <span>{t.label}</span>
                              </div>
                              {colorTheme === t.key && <Check className="w-3 h-3 text-[#64ffda]" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* External profile link */}
                      <div className="pt-2 border-t border-[#233554] flex justify-between items-center text-[11px] text-neutral-400">
                        <span>Profile activity overview</span>
                        <a
                          href="https://github.com/settings/profile"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#64ffda] hover:underline flex items-center gap-1"
                        >
                          GitHub Settings ↗
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] pt-4 mt-2 border-t border-[var(--color-border)]/60">
                  <a 
                    href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/showing-an-overview-of-your-activity-on-your-profile" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-[#64ffda] hover:underline"
                  >
                    Learn how we count contributions
                  </a>

                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(0, false)}`} />
                    <div className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(1, false)}`} />
                    <div className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(2, false)}`} />
                    <div className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(3, false)}`} />
                    <div className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(4, false)}`} />
                    <span>More</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Year Filter Tabs */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {DYNAMIC_YEARS.map(yr => {
              const isActive = yr === selectedYear;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`shrink-0 lg:w-full py-2 px-4 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer text-left flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-[#64ffda] text-[#0a192f] shadow-lg font-bold'
                      : 'bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                  }`}
                >
                  <span>{yr}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0a192f] animate-pulse" />}
                </button>
              );
            })}
          </div>

        </div>

        {/* Hover Tooltip display */}
        {hoveredDay && (
          <div
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-[#020c1b]/95 text-[#ccd6f6] text-[11px] font-mono px-3 py-1.5 rounded-lg border border-[#64ffda] shadow-xl pointer-events-none animate-fade-in"
            style={{ left: `${hoveredDay.x}px`, top: `${hoveredDay.y}px` }}
          >
            <span className="font-bold text-[#64ffda]">
              {hoveredDay.day.count === 0 ? 'No' : hoveredDay.day.count} contribution{hoveredDay.day.count === 1 ? '' : 's'}
            </span>{' '}
            on {format(hoveredDay.day.date, 'MMM d, yyyy')}
          </div>
        )}
        </div>
      </div>
    </section>
  );
};
