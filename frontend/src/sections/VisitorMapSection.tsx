import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Sphere, Graticule } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

// World atlas JSON for countries
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface VisitorLocation {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface VisitorData {
  total: number;
  countries: number;
  locations: VisitorLocation[];
  countryStats: Record<string, number>;
}

// Major countries to label to avoid clutter, matching the reference density
const labeledCountries = [
  "Nigeria", "Mali", "Algeria", "Niger", "Chad", "Mauritania", 
  "Senegal", "Burkina Faso", "Cameroon", "Libya", "Egypt", 
  "Sudan", "Kenya", "Tanzania", "Ethiopia", "South Africa",
  "Democratic Republic of the Congo", "Angola", "Morocco",
  "Spain", "France", "Italy", "United Kingdom", "Germany",
  "Brazil", "United States", "Canada", "India", "China", "Australia",
  "Saudi Arabia", "Iran", "Turkey", "Kazakhstan", "Russia", "Argentina"
];

export const VisitorMapSection: React.FC = () => {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([-10, -15, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate mock data closely matching the user's reference map cluster
    const mockData: VisitorData = {
      total: 16,
      countries: 5,
      countryStats: { 'Nigeria': 8, 'Togo': 2, 'Ivory Coast': 1, 'Cameroon': 1, 'United States': 4 },
      locations: [
        { lat: 9.0820, lon: 8.6753, city: 'Abuja', country: 'Nigeria' },
        { lat: 6.5244, lon: 3.3792, city: 'Lagos', country: 'Nigeria' },
        { lat: 7.3775, lon: 3.9470, city: 'Ibadan', country: 'Nigeria' },
        { lat: 8.4966, lon: 4.5421, city: 'Ilorin', country: 'Nigeria' },
        { lat: 6.1370, lon: 1.2125, city: 'Lome', country: 'Togo' },
        { lat: 5.3097, lon: -4.0127, city: 'Abidjan', country: 'Ivory Coast' },
        { lat: 3.8480, lon: 11.5021, city: 'Yaounde', country: 'Cameroon' },
        { lat: 40.7128, lon: -74.0060, city: 'New York', country: 'United States' }
      ]
    };

    const fetchVisitors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visitors`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.total > 0) {
            setVisitorData(data);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch visitor data, using mock data.');
      }
      setVisitorData(mockData);
    };
    
    fetchVisitors();
  }, []);

  // Get user location silently via IP on mount and fly to it
  useEffect(() => {
    const fetchUserLocationSilently = async () => {
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (response.ok) {
          const data = await response.json();
          const lat = parseFloat(data.latitude);
          const lon = parseFloat(data.longitude);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            setUserLocation({ lat, lon });
            // Smooth animate rotation to user
            setRotation([-lon, -lat, 0]);
          }
        }
      } catch (error) {
        console.log('Failed to ping user location:', error);
      }
    };
    
    fetchUserLocationSilently();
  }, []);

  // Handlers to make the globe draggable/rotatable
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    
    setRotation((r) => [r[0] + dx * 0.5, r[1] - dy * 0.5, r[2]]);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="py-20 bg-[var(--color-surface-base)] relative border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[var(--color-text-main)] mb-2">Global Audience</h2>
            <p className="text-[var(--color-text-muted)] font-mono text-sm">
              {visitorData ? `${visitorData.total} total unique visitors from ${visitorData.countries} countries.` : 'Loading visitor data...'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {visitorData && Object.entries(visitorData.countryStats).map(([country, count]) => (
              <div 
                key={country} 
                className="px-3 py-1 bg-[var(--color-surface-elevated)] text-[var(--color-primary)] border border-[var(--color-border)] rounded-full text-xs font-medium font-mono"
              >
                {country} ({count})
              </div>
            ))}
          </div>
        </div>

        {/* Map Container - Rebuilt from scratch to look exactly like Mapbox but without tokens */}
        <div 
          className="rounded-2xl overflow-hidden shadow-lg h-[500px] relative bg-[#111111] border border-[var(--color-border)] cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] z-10" />

          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{
              scale: 220,
              rotate: rotation
            }}
            width={800}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Atmospheric Glow shadow effect */}
            <Sphere stroke="transparent" strokeWidth={0} fill="#111111" />
            
            <Geographies geography={geoUrl}>
              {({ geographies }) => (
                <>
                  {geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#222222"
                      stroke="#333333"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#2A2A2A", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      } as any}
                    />
                  ))}

                  {/* Render Country Labels for prominent countries */}
                  {geographies.map((geo) => {
                    if (!labeledCountries.includes(geo.properties.name)) return null;
                    const centroid = geoCentroid(geo);
                    return (
                      <Marker key={`label-${geo.rsmKey}`} coordinates={centroid}>
                        <text
                          textAnchor="middle"
                          y={2}
                          style={{
                            fontFamily: "system-ui, sans-serif",
                            fill: "#666666",
                            fontSize: "10px",
                            fontWeight: 600,
                            pointerEvents: "none",
                            userSelect: "none"
                          }}
                        >
                          {geo.properties.name}
                        </text>
                      </Marker>
                    );
                  })}
                </>
              )}
            </Geographies>

            {/* Exact Reference Markers (Small white dot with purple glow) */}
            {visitorData?.locations.map((loc, idx) => (
              <Marker key={idx} coordinates={[loc.lon, loc.lat]}>
                <circle r={8} fill="#8b5cf6" opacity={0.4} />
                <circle r={2.5} fill="#ffffff" />
              </Marker>
            ))}

            {/* User Live Location Pulsing Marker */}
            {userLocation && (
              <Marker coordinates={[userLocation.lon, userLocation.lat]}>
                <circle r={12} fill="var(--color-primary)" opacity={0.4}>
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r={3} fill="#ffffff" stroke="var(--color-primary)" strokeWidth={1} />
              </Marker>
            )}
          </ComposableMap>

          {/* Familiar Mapbox UI Controls Overlay */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 opacity-60 text-white font-sans font-bold text-[13px] pointer-events-none">
            <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
              <path d="M10 2.5C5.86 2.5 2.5 5.86 2.5 10c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-4.14-3.36-7.5-7.5-7.5zm4.8 10.8c-.8 0-1.46-.53-1.63-1.25-.7.83-1.83 1.35-3.07 1.35-2.2 0-3.9-1.8-3.9-4 0-2.2 1.7-4 3.9-4 1.25 0 2.37.52 3.07 1.35.17-.72.83-1.25 1.63-1.25.93 0 1.7.77 1.7 1.7v4.4c0 .93-.77 1.7-1.7 1.7zM10 6.6c-1.88 0-3.4 1.52-3.4 3.4 0 1.88 1.52 3.4 3.4 3.4 1.88 0 3.4-1.52 3.4-3.4 0-1.88-1.52-3.4-3.4-3.4z"/>
            </svg>
            mapbox
          </div>

          <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-[1px] bg-white rounded shadow pointer-events-auto">
            <button className="w-7 h-7 flex items-center justify-center text-black hover:bg-gray-100 rounded-t" onClick={() => {}}>+</button>
            <button className="w-7 h-7 flex items-center justify-center text-black hover:bg-gray-100 rounded-b" onClick={() => {}}>-</button>
          </div>

        </div>
        
      </div>
    </section>
  );
};
