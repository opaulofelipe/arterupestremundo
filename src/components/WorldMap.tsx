import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  MAP_WIDTH, 
  MAP_HEIGHT, 
  countries, 
  graticulePath, 
  spherePath, 
  pathGenerator, 
  projectCoordinates 
} from '../utils/geoData';
import { RockArtSite, ContinentFilter } from '../data/rockArtSites';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Sparkles, Eye } from 'lucide-react';

interface WorldMapProps {
  sites: RockArtSite[];
  selectedSite: RockArtSite | null;
  onSelectSite: (site: RockArtSite) => void;
  onCloseSite: () => void;
  continentFilter: ContinentFilter;
  searchQuery: string;
}

interface TransformState {
  x: number;
  y: number;
  scale: number;
}

const DEFAULT_TRANSFORM: TransformState = {
  x: 0,
  y: 0,
  scale: 1
};

export const WorldMap: React.FC<WorldMapProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  continentFilter,
  searchQuery
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredSite, setHoveredSite] = useState<RockArtSite | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Smooth animation to a target transform
  const animateTo = useCallback((target: TransformState, duration = 650) => {
    setIsAnimating(true);
    const start = { ...transform };
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic: 1 - pow(1 - x, 3)
      const ease = 1 - Math.pow(1 - progress, 3);

      setTransform({
        x: start.x + (target.x - start.x) * ease,
        y: start.y + (target.y - start.y) * ease,
        scale: start.scale + (target.scale - start.scale) * ease
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(step);
  }, [transform]);

  // When selectedSite changes:
  // If site is selected -> zoom in and center on it smoothly
  // If site is null (closed) -> reset zoom to default smoothly!
  useEffect(() => {
    if (selectedSite) {
      const pt = projectCoordinates(selectedSite.coordinates);
      if (pt) {
        const targetScale = 3.4;
        // On desktop, offset slightly to the left (0.35) so the right panel doesn't occlude it
        const isWide = window.innerWidth >= 1024;
        const targetCenterX = isWide ? MAP_WIDTH * 0.35 : MAP_WIDTH * 0.5;
        const targetCenterY = isWide ? MAP_HEIGHT * 0.5 : MAP_HEIGHT * 0.36;

        const targetX = targetCenterX - pt[0] * targetScale;
        const targetY = targetCenterY - pt[1] * targetScale;

        animateTo({ x: targetX, y: targetY, scale: targetScale }, 700);
      }
    } else {
      // Zoom back to default world view!
      animateTo(DEFAULT_TRANSFORM, 600);
    }
  }, [selectedSite]);

  // Dragging / Panning handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isAnimating) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setTransform((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Wheel Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isAnimating) return;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.85), 6.5);

    // Zoom relative to map center
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse to SVG space
    const svgX = (mouseX / rect.width) * MAP_WIDTH;
    const svgY = (mouseY / rect.height) * MAP_HEIGHT;

    const newX = svgX - (svgX - transform.x) * (newScale / transform.scale);
    const newY = svgY - (svgY - transform.y) * (newScale / transform.scale);

    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  };

  // Manual Zoom In / Out
  const zoomIn = () => {
    const newScale = Math.min(transform.scale * 1.4, 6.0);
    animateTo({
      scale: newScale,
      x: MAP_WIDTH / 2 - (MAP_WIDTH / 2 - transform.x) * (newScale / transform.scale),
      y: MAP_HEIGHT / 2 - (MAP_HEIGHT / 2 - transform.y) * (newScale / transform.scale)
    }, 300);
  };

  const zoomOut = () => {
    const newScale = Math.max(transform.scale / 1.4, 1.0);
    if (newScale <= 1.05) {
      animateTo(DEFAULT_TRANSFORM, 400);
    } else {
      animateTo({
        scale: newScale,
        x: MAP_WIDTH / 2 - (MAP_WIDTH / 2 - transform.x) * (newScale / transform.scale),
        y: MAP_HEIGHT / 2 - (MAP_HEIGHT / 2 - transform.y) * (newScale / transform.scale)
      }, 300);
    }
  };

  const resetZoom = () => {
    animateTo(DEFAULT_TRANSFORM, 600);
  };

  // Filter sites matching search and continent
  const filteredSites = sites.filter((site) => {
    const matchContinent = continentFilter === 'Todos' || site.continent === continentFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchContinent && matchSearch;
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-[#F6F2EA]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Background subtle antique paper texture styling */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#CFC3B0_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />

      {/* SVG Canvas Map */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-full transition-transform"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle drop shadow for pins */}
          <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#3F291C" floodOpacity="0.25" />
          </filter>
          
          {/* Active pin glow */}
          <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ocean subtle pastel gradient */}
          <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#F9F6F0" />
            <stop offset="100%" stopColor="#F1ECE0" />
          </radialGradient>
        </defs>

        {/* Ocean Background sphere */}
        <path d={spherePath} fill="url(#oceanGradient)" stroke="#E4DBD0" strokeWidth="1" />

        {/* Camera Group: Pans and Zooms */}
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          
          {/* Graticule Grid Lines (Latitudes & Longitudes) */}
          <path
            d={graticulePath}
            fill="none"
            stroke="#E3D9C9"
            strokeWidth="0.6"
            strokeDasharray="2 3"
            opacity="0.8"
          />

          {/* Equator highlighted hairline */}
          <line
            x1="80"
            y1={MAP_HEIGHT / 2 + 15}
            x2="920"
            y2={MAP_HEIGHT / 2 + 15}
            stroke="#D6CBB8"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            opacity="0.65"
          />

          {/* Countries / Landmasses */}
          <g className="countries-layer">
            {countries.map((country: any, idx: number) => {
              const d = pathGenerator(country);
              if (!d) return null;
              return (
                <path
                  key={country.id || idx}
                  d={d}
                  fill="#EDE5D4"
                  stroke="#D3C7B2"
                  strokeWidth="0.6"
                  className="transition-colors duration-150 hover:fill-[#E5DC C7]"
                />
              );
            })}
          </g>

          {/* Equator & Tropics subtle text annotations */}
          <text x="85" y={MAP_HEIGHT / 2 + 12} fill="#A89E8F" fontSize="6.5" fontStyle="italic" fontFamily="serif">
            Equador 0°
          </text>
          <text x="85" y={MAP_HEIGHT / 2 - 58} fill="#BDB3A5" fontSize="5.5" fontStyle="italic" fontFamily="serif">
            Trópico de Câncer 23.5° N
          </text>
          <text x="85" y={MAP_HEIGHT / 2 + 88} fill="#BDB3A5" fontSize="5.5" fontStyle="italic" fontFamily="serif">
            Trópico de Capricórnio 23.5° S
          </text>

          {/* Prehistoric Rock Art Sites (Interactive Pins) */}
          <g className="pins-layer">
            {filteredSites.map((site) => {
              const pt = projectCoordinates(site.coordinates);
              if (!pt) return null;
              const [px, py] = pt;

              const isSelected = selectedSite?.id === site.id;
              const isHovered = hoveredSite?.id === site.id;

              // Dynamically adjust pin radius based on current zoom scale for crisp visibility
              const baseRadius = isSelected ? 7 : isHovered ? 6 : 5;
              const visualScale = Math.max(1 / Math.sqrt(transform.scale), 0.55);

              return (
                <g
                  key={site.id}
                  transform={`translate(${px}, ${py}) scale(${visualScale})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSite(site);
                  }}
                  onMouseEnter={() => setHoveredSite(site)}
                  onMouseLeave={() => setHoveredSite(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${site.name}, ${site.country}`}
                >
                  {/* Subtle pulsing beacon halo */}
                  <circle
                    r={baseRadius * 2.8}
                    fill="#C25A38"
                    className="pin-ring pointer-events-none"
                    opacity={isSelected ? 0.45 : 0.25}
                  />

                  {/* Concentric aesthetic target for selected pin */}
                  {isSelected && (
                    <circle
                      r={baseRadius * 1.9}
                      fill="none"
                      stroke="#C25A38"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      className="animate-spin-slow pointer-events-none"
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    r={baseRadius + 2.5}
                    fill={isSelected ? '#F7F4EE' : '#FFFDF9'}
                    stroke={isSelected ? '#99351C' : '#C25A38'}
                    strokeWidth={isSelected ? '2' : '1.2'}
                    filter="url(#pinShadow)"
                  />

                  {/* Center core point */}
                  <circle
                    r={baseRadius}
                    fill={isSelected ? '#8C2E17' : '#B84D2E'}
                    className="transition-colors duration-200"
                  />

                  {/* Little central golden dot */}
                  <circle
                    r={baseRadius * 0.35}
                    fill={isSelected ? '#FFDE87' : '#FAF6EE'}
                  />

                  {/* Hover or Selected Text Label on Map */}
                  {(isHovered || isSelected) && (
                    <g 
                      transform={`translate(0, -${baseRadius + 14})`} 
                      className="pointer-events-none transition-opacity duration-200"
                    >
                      {/* Badge Background */}
                      <rect
                        x="-65"
                        y="-16"
                        width="130"
                        height="22"
                        rx="4"
                        fill="#1F1B18"
                        fillOpacity="0.9"
                        stroke="#8A7768"
                        strokeWidth="0.8"
                      />
                      {/* Little triangle arrow pointing down to pin */}
                      <polygon
                        points="0,6 -4,0 4,0"
                        fill="#1F1B18"
                        fillOpacity="0.9"
                      />
                      {/* Site Name in tooltip */}
                      <text
                        x="0"
                        y="-2"
                        textAnchor="middle"
                        fill="#FAF6EE"
                        fontSize="8.5"
                        fontFamily="serif"
                        fontWeight="600"
                      >
                        {site.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

        </g>
      </svg>

      {/* Map Control Utilities (Floating elegant controls) */}
      <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2">
        <div className="bg-[#FAF8F5]/92 backdrop-blur-md border border-[#E0D7C8] rounded-xl shadow-lg p-1 flex flex-col gap-1">
          <button
            onClick={zoomIn}
            aria-label="Aproximar mapa"
            className="p-2 text-[#5E544B] hover:text-[#1F1B18] hover:bg-[#EDE5D6] rounded-lg transition-colors cursor-pointer"
            title="Aproximar (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            aria-label="Afastar mapa"
            className="p-2 text-[#5E544B] hover:text-[#1F1B18] hover:bg-[#EDE5D6] rounded-lg transition-colors cursor-pointer"
            title="Afastar (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-[#E4DC CE] mx-1" />
          <button
            onClick={resetZoom}
            aria-label="Restaurar mapa mundi inteiro"
            className="p-2 text-[#5E544B] hover:text-[#1F1B18] hover:bg-[#EDE5D6] rounded-lg transition-colors cursor-pointer"
            title="Visão global (Ver mapa inteiro)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Sites counter badge (zero pill discipline: clean box) */}
        <div className="bg-[#FAF8F5]/90 backdrop-blur-xs border border-[#E0D7C8] rounded-lg px-3 py-1.5 shadow-sm text-[11px] text-[#6E6357] font-sans">
          <span>{filteredSites.length} sítios arqueológicos</span>
        </div>
      </div>

      {/* Antarctica & Global Educational Legend (Bottom right) */}
      <div className="hidden md:flex absolute bottom-5 right-5 z-10 items-center gap-2 bg-[#FAF8F5]/88 backdrop-blur-xs border border-[#E0D7C8] rounded-lg px-3 py-1.5 text-[11px] text-[#73675A] shadow-sm">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B84D2E]" />
        <span>Artes rupestres paleolíticas e arcaicas</span>
        <span aria-hidden="true" className="text-[#C8BFB2]">·</span>
        <span className="italic text-[#8A7E72]">Clique em um ponto para navegar</span>
      </div>

    </div>
  );
};
