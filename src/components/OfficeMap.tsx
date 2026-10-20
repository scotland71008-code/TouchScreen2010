import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';

export interface Office {
  id: string;
  city: string;
  country: string;
  region: 'Americas' | 'EMEA' | 'APAC';
  role: string;
  address: string;
  lat: number;
  lng: number;
  timezone: string;
  staffCount: number;
  isHQ?: boolean;
  functions: string[];
  weather: {
    temp: string;
    condition: string;
    icon: string;
  };
}

const OFFICES: Office[] = [
  {
    id: 'huntsville',
    city: 'Huntsville',
    country: 'United States',
    region: 'Americas',
    role: 'Global Headquarters',
    address: 'Octave Systems HQ, Huntsville, AL 35805, USA',
    lat: 34.7304,
    lng: -86.5861,
    timezone: 'America/Chicago',
    staffCount: 180,
    isHQ: true,
    functions: ['Executive Leadership', 'Core R&D', 'Engineering Systems', 'Global Support'],
    weather: {
      temp: '28°C',
      condition: 'Partly Cloudy',
      icon: 'CloudSun'
    }
  },
  {
    id: 'khobar',
    city: 'Khobar',
    country: 'Saudi Arabia',
    region: 'EMEA',
    role: 'Eastern Province Hub',
    address: 'King Salman Road, Al Khobar 34423, Saudi Arabia',
    lat: 26.2941,
    lng: 50.2144,
    timezone: 'Asia/Riyadh',
    staffCount: 52,
    functions: ['Enterprise Sales', 'Regional Engineering Support', 'Middle East Energy Hub', 'Client Success'],
    weather: {
      temp: '38°C',
      condition: 'Sunny',
      icon: 'Sun'
    }
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'EMEA',
    role: 'Middle East Regional HQ',
    address: 'Dubai Internet City, Building 3, Dubai, UAE',
    lat: 25.2048,
    lng: 55.2708,
    timezone: 'Asia/Dubai',
    staffCount: 88,
    functions: ['Regional Executive Operations', 'Cloud Infrastructure', 'Commercial Strategy', 'Innovation Lab'],
    weather: {
      temp: '39°C',
      condition: 'Clear',
      icon: 'Sun'
    }
  },
  {
    id: 'houston',
    city: 'Houston',
    country: 'United States',
    region: 'Americas',
    role: 'Energy & Offshore Solutions Center',
    address: '1000 Louisiana St, Suite 4200, Houston, TX 77002, USA',
    lat: 29.7604,
    lng: -95.3698,
    timezone: 'America/Chicago',
    staffCount: 65,
    functions: ['Offshore Engineering', 'Energy Transition Tech', 'Petrochemical Solutions', 'North America Sales'],
    weather: {
      temp: '31°C',
      condition: 'Sunny',
      icon: 'Sun'
    }
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    region: 'EMEA',
    role: 'Europe Regional Operations',
    address: '25 Bank Street, Canary Wharf, London E14 5JP, UK',
    lat: 51.5074,
    lng: -0.1278,
    timezone: 'Europe/London',
    staffCount: 74,
    functions: ['European Operations', 'Legal & Regulatory Compliance', 'Financial Systems', 'Regional Consulting'],
    weather: {
      temp: '22°C',
      condition: 'Breezy',
      icon: 'Cloud'
    }
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    region: 'APAC',
    role: 'Asia-Pacific Regional Hub',
    address: '1 Marina Boulevard, #28-00, Singapore 018989',
    lat: 1.3521,
    lng: 103.8198,
    timezone: 'Asia/Singapore',
    staffCount: 60,
    functions: ['APAC Market Expansion', 'Maritime Engineering', 'Smart City Solutions', 'Technical Support'],
    weather: {
      temp: '32°C',
      condition: 'Tropical Sunshine',
      icon: 'Sun'
    }
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'APAC',
    role: 'East Asia Engineering & R&D Hub',
    address: 'Roppongi Hills Mori Tower, Minato-ku, Tokyo 106-6108, Japan',
    lat: 35.6762,
    lng: 139.6503,
    timezone: 'Asia/Tokyo',
    staffCount: 45,
    functions: ['Robotics Integration', 'Advanced AI Analytics', 'Japan Enterprise Relations', 'Hardware Testing'],
    weather: {
      temp: '26°C',
      condition: 'Clear',
      icon: 'Sun'
    }
  },
  {
    id: 'calgary',
    city: 'Calgary',
    country: 'Canada',
    region: 'Americas',
    role: 'Resources & Mining Center',
    address: '400 3rd Avenue SW, Calgary, AB T2P 4H2, Canada',
    lat: 51.0447,
    lng: -114.0719,
    timezone: 'America/Edmonton',
    staffCount: 40,
    functions: ['Heavy Oil & Mining Tech', 'Cold Climate Asset Management', 'Environmental Modeling', 'Canada Support'],
    weather: {
      temp: '20°C',
      condition: 'Fair',
      icon: 'CloudSun'
    }
  }
];

export default function OfficeMap() {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('khobar');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [liveTimes, setLiveTimes] = useState<{ [key: string]: string }>({});
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  // Dynamic Lucide Icon Helper
  const LucideIcon = ({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.HelpCircle className={className} style={style} />;
    return <IconComponent className={className} style={style} />;
  };

  // Load Leaflet dynamically
  useEffect(() => {
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const scriptId = 'leaflet-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    } else if ((window as any).L) {
      setLeafletLoaded(true);
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapElementRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (mapInstanceRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [25, 20],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dark sleek basemap - using OpenStreetMap to avoid API watermarks
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: ''
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add Custom Markers
    OFFICES.forEach((office) => {
      const isSelected = office.id === selectedOfficeId;

      let outerHalo = 'bg-sky-500/20 border-sky-400/50';
      let dotBg = 'bg-sky-400';
      let badgeBorder = 'border-sky-400/50 text-sky-300';
      let badgeLabel = office.city;

      if (office.isHQ) {
        outerHalo = 'bg-amber-500/30 border-amber-400/70';
        dotBg = 'bg-amber-500';
        badgeBorder = 'border-amber-400/70 text-amber-300 font-bold';
        badgeLabel = '★ HUNTSVILLE (HQ)';
      } else if (office.id === 'khobar') {
        outerHalo = 'bg-emerald-500/30 border-emerald-400/70';
        dotBg = 'bg-emerald-500';
        badgeBorder = 'border-emerald-400/70 text-emerald-300 font-bold';
        badgeLabel = 'KHOBAR HUB';
      } else if (office.id === 'dubai') {
        outerHalo = 'bg-purple-500/30 border-purple-400/70';
        dotBg = 'bg-purple-500';
        badgeBorder = 'border-purple-400/70 text-purple-300 font-bold';
        badgeLabel = 'DUBAI REGIONAL HQ';
      }

      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 80px; height: 80px;">
            <div class="absolute w-10 h-10 rounded-full border ${outerHalo} shadow-lg transition-transform duration-300 group-hover:scale-125 ${isSelected ? 'ring-2 ring-sky-400 scale-110' : ''}"></div>
            <div class="w-3.5 h-3.5 rounded-full border-2 border-white ${dotBg} shadow-xl relative z-10"></div>
            <div class="absolute top-11 border ${badgeBorder} bg-[#090d18]/90 rounded px-1.5 py-0.5 whitespace-nowrap z-20 backdrop-blur-md">
              <span class="text-[9px] font-mono tracking-wider uppercase block">${badgeLabel}</span>
            </div>
          </div>
        `,
        className: 'custom-office-marker',
        iconSize: [80, 80],
        iconAnchor: [40, 40]
      });

      const marker = L.marker([office.lat, office.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        handleSelectOffice(office.id);
      });

      markersRef.current[office.id] = marker;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Fly to office on select
  const handleSelectOffice = (officeId: string) => {
    setSelectedOfficeId(officeId);
    const map = mapInstanceRef.current;
    const office = OFFICES.find(o => o.id === officeId);
    if (map && office) {
      map.flyTo([office.lat, office.lng], 6, {
        animate: true,
        duration: 1.2
      });
    }
  };

  // Region filtering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (window as any).L;
    if (!L) return;

    if (selectedRegion === 'ALL') {
      map.invalidateSize();
      map.flyTo([25, 20], 2, { animate: true, duration: 1.2 });

      OFFICES.forEach(o => {
        const marker = markersRef.current[o.id];
        if (marker) {
          marker.setOpacity(1.0);
          if (marker.setZIndexOffset) marker.setZIndexOffset(o.isHQ ? 1000 : 100);
        }
      });
    } else {
      const regionalOffices = OFFICES.filter(o => o.region === selectedRegion);
      if (regionalOffices.length > 0) {
        let bounds: any;
        if (selectedRegion === 'Americas') {
          bounds = L.latLngBounds([[22.0, -125.0], [56.0, -65.0]]);
        } else if (selectedRegion === 'EMEA') {
          bounds = L.latLngBounds([[15.0, -15.0], [56.0, 60.0]]);
        } else if (selectedRegion === 'APAC') {
          bounds = L.latLngBounds([[-5.0, 90.0], [42.0, 145.0]]);
        } else {
          bounds = L.latLngBounds(regionalOffices.map(o => [o.lat, o.lng]));
        }

        map.fitBounds(bounds, { padding: [40, 40], animate: true, duration: 1.2 });

        OFFICES.forEach(o => {
          const marker = markersRef.current[o.id];
          if (marker) {
            const inRegion = o.region === selectedRegion;
            marker.setOpacity(inRegion ? 1.0 : 0.2);
            if (marker.setZIndexOffset) marker.setZIndexOffset(inRegion ? 800 : 0);
          }
        });

        const currentOffice = OFFICES.find(o => o.id === selectedOfficeId);
        if (!currentOffice || currentOffice.region !== selectedRegion) {
          setSelectedOfficeId(regionalOffices[0].id);
        }
      }
    }
  }, [selectedRegion, leafletLoaded]);

  // Fit all offices
  const handleFitAllOffices = () => {
    setSelectedRegion('ALL');
    const map = mapInstanceRef.current;
    if (map) {
      map.invalidateSize();
      map.flyTo([25, 20], 2, { animate: true, duration: 1.2 });
    }
  };

  // Live clocks ticker
  useEffect(() => {
    const updateTimes = () => {
      const times: { [key: string]: string } = {};
      OFFICES.forEach((office) => {
        try {
          times[office.id] = new Intl.DateTimeFormat('en-US', {
            timeZone: office.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }).format(new Date());
        } catch {
          times[office.id] = new Date().toLocaleTimeString();
        }
      });
      setLiveTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredOffices = OFFICES.filter(o => {
    const matchesRegion = selectedRegion === 'ALL' || o.region === selectedRegion;
    const matchesQuery = searchQuery === '' || 
      o.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  const selectedOffice = OFFICES.find(o => o.id === selectedOfficeId) || OFFICES[0];
  const totalStaff = OFFICES.reduce((acc, o) => acc + o.staffCount, 0);

  return (
    <div id="office-map-container" className="flex flex-col gap-4 animate-fade-in w-full text-white">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0a0f1d]/90 border border-sky-950/80 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/60 text-sky-300 font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            GLOBAL PRESENCE
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <span>OCTAVE GLOBAL OFFICES & REGIONAL HUBS</span>
            </h2>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
              Strategic locations serving enterprise infrastructure across <strong className="text-sky-400">3 Continents</strong> &bull; Total Staff: <strong className="text-sky-400">{totalStaff}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-neutral-300 text-xs font-mono flex items-center gap-2">
            <Icons.Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>8 Enterprise Centers</span>
          </span>
        </div>
      </div>

      {/* 2. Main Spatial Map & Detail Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        
        {/* Left Map Panel (Col-span 8) */}
        <div className="xl:col-span-8 p-3.5 sm:p-4 rounded-2xl bg-[#090e1d]/90 border border-sky-950/80 flex flex-col justify-between min-h-[520px] xl:min-h-[580px] relative overflow-hidden shadow-2xl">
          
          {/* Top Controls Overlay Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            {/* Region Selector Pills */}
            <div className="flex items-center gap-1 bg-[#040711] border border-white/10 rounded-xl p-1">
              {['ALL', 'Americas', 'EMEA', 'APAC'].map((reg) => {
                const isSelected = selectedRegion === reg;
                let activeClass = 'bg-sky-500 text-slate-950 shadow-md font-extrabold';
                if (reg === 'EMEA') activeClass = 'bg-purple-500 text-white shadow-md font-extrabold';
                if (reg === 'APAC') activeClass = 'bg-emerald-500 text-slate-950 shadow-md font-extrabold';

                return (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? activeClass
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleFitAllOffices}
              className="px-3 py-1.5 bg-[#0e1729] hover:bg-[#16243f] border border-sky-500/40 text-sky-300 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Icons.Globe className="w-3.5 h-3.5" />
              <span>Fit World</span>
            </button>
          </div>

          {/* Interactive Map Container */}
          <div className="flex-1 w-full min-h-[440px] relative rounded-xl overflow-hidden border border-sky-900/40 bg-[#02050e]">
            {/* Region Zoom Highlight Pill */}
            {selectedRegion !== 'ALL' && (
              <div className="absolute top-3 left-3 z-[400] bg-[#090d18]/95 border border-sky-400/60 rounded-xl px-3.5 py-2 backdrop-blur-md shadow-2xl flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  selectedRegion === 'EMEA' ? 'bg-purple-400' : selectedRegion === 'APAC' ? 'bg-emerald-400' : 'bg-sky-400'
                }`} />
                <div>
                  <span className={`text-[11px] font-mono font-black uppercase tracking-wider block ${
                    selectedRegion === 'EMEA' ? 'text-purple-300' : selectedRegion === 'APAC' ? 'text-emerald-300' : 'text-sky-300'
                  }`}>
                    Region: {selectedRegion}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 block">
                    {OFFICES.filter(o => o.region === selectedRegion).length} Centers Located
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRegion('ALL')}
                  className="ml-1 text-[10px] font-mono font-bold text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-all cursor-pointer border border-white/10"
                >
                  Reset (ALL)
                </button>
              </div>
            )}

            {!leafletLoaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#030712]">
                <Icons.Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  Loading Global Map View...
                </span>
              </div>
            ) : (
              <div ref={mapElementRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />
            )}
          </div>

          {/* Map Footer Metadata & Legend */}
          <div className="border-t border-white/10 pt-3 mt-3 flex flex-wrap items-center justify-between gap-2.5 text-[10px] font-mono text-neutral-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Global HQ (Huntsville)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Khobar Hub (Saudi Arabia)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                Dubai Regional HQ
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold">&bull; 24/7 Global Engineering Operations</span>
            </div>
          </div>
        </div>

        {/* Right Directory & Details Panel (Col-span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          
          {/* Active Office Details Card */}
          <div className="rounded-2xl p-4 sm:p-5 bg-[#090e1d]/90 border border-sky-950/80 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400" />

            <div className="space-y-3.5">
              {/* Head Info */}
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-sky-400 font-bold uppercase block">
                    SELECTED REGIONAL HUB
                  </span>
                  <h3 className="text-xl font-black mt-0.5 tracking-tight flex items-center gap-2">
                    <span>{selectedOffice.city}</span>
                    <span className="text-xs font-mono font-normal opacity-70">({selectedOffice.country})</span>
                  </h3>

                  {selectedOffice.isHQ && (
                    <p className="text-xs text-amber-400 font-bold leading-relaxed mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {selectedOffice.role}
                    </p>
                  )}
                  {selectedOffice.id === 'khobar' && (
                    <p className="text-xs text-emerald-400 font-bold leading-relaxed mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {selectedOffice.role}
                    </p>
                  )}
                  {selectedOffice.id === 'dubai' && (
                    <p className="text-xs text-purple-300 font-bold leading-relaxed mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                      {selectedOffice.role}
                    </p>
                  )}
                  {!selectedOffice.isHQ && selectedOffice.id !== 'khobar' && selectedOffice.id !== 'dubai' && (
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed mt-1">
                      {selectedOffice.role}
                    </p>
                  )}
                </div>

                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  selectedOffice.isHQ
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : selectedOffice.id === 'khobar'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : selectedOffice.id === 'dubai'
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                    : 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                }`}>
                  <Icons.Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* Weather */}
              <div className="p-2.5 rounded-xl bg-[#040711] border border-white/10 flex flex-col gap-0.5">
                <span className="text-[8.5px] font-mono uppercase text-neutral-400">Current Weather</span>
                <div className="flex items-center gap-1.5">
                  <LucideIcon name={selectedOffice.weather.icon} className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-neutral-200">{selectedOffice.weather.temp}</span>
                </div>
              </div>

              {/* Timezone & Clock */}
              <div className="p-3 rounded-xl bg-[#040711] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icons.Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <p className="text-[8.5px] font-mono text-neutral-400 uppercase">Timezone</p>
                    <p className="text-xs font-mono font-bold">{selectedOffice.timezone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-mono text-neutral-400 uppercase">Local Time</p>
                  <p className="text-base font-mono font-black text-amber-300 tracking-wider">
                    {liveTimes[selectedOffice.id] || '--:--'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Directory Selector List with Filter Search */}
          <div className="rounded-2xl p-4 bg-[#090e1d]/90 border border-sky-950/80 flex flex-col gap-3 flex-1 shadow-2xl">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                OFFICE DIRECTORY ({filteredOffices.length})
              </span>
              <span className="text-[9px] font-mono text-neutral-400">Click to Fly</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search by city, country, or function..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#040711] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* List of Offices */}
            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredOffices.map((off) => {
                const isActive = off.id === selectedOfficeId;
                let dotColor = 'bg-sky-400';
                if (off.isHQ) dotColor = 'bg-amber-400';
                else if (off.id === 'khobar') dotColor = 'bg-emerald-400';
                else if (off.id === 'dubai') dotColor = 'bg-purple-400';

                return (
                  <button
                    key={off.id}
                    onClick={() => handleSelectOffice(off.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-sky-500/20 border-sky-400/60 shadow-md font-bold' 
                        : 'bg-[#040711] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold leading-none">{off.city}</span>
                          {off.isHQ && (
                            <span className="text-[7.5px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded uppercase">HQ</span>
                          )}
                          {off.id === 'khobar' && (
                            <span className="text-[7.5px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1 rounded uppercase">LEAP</span>
                          )}
                        </div>
                        <span className="text-[9.5px] text-neutral-400 block mt-0.5">{off.country}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9.5px] font-mono text-neutral-300 font-bold block">
                        {liveTimes[off.id]?.split(' ')[0] || '--:--'}
                      </span>
                      <span className="text-[8px] font-mono text-sky-400 block">
                        {off.staffCount} Staff
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
