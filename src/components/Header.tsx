import React from 'react';
import { ContinentFilter, CONTINENT_FILTERS } from '../data/rockArtSites';
import { Compass, Clock, Search, Shuffle } from 'lucide-react';

interface HeaderProps {
  currentContinent: ContinentFilter;
  onSelectContinent: (c: ContinentFilter) => void;
  onOpenTimeline: () => void;
  onRandomTour: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentContinent,
  onSelectContinent,
  onOpenTimeline,
  onRandomTour,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 bg-[#FAF7F2] border-b border-[#E6DEC9] flex items-center justify-between gap-4 z-40 shrink-0">
      
      {/* Zone 1: Single Text Element Brand Wordmark */}
      <div className="flex items-center gap-3">
        <a 
          href="/" 
          className="text-xl md:text-2xl font-serif font-medium tracking-tight text-[#2D2622] hover:text-[#8C3A27] transition-colors whitespace-nowrap"
        >
          Atlas Rupestre
        </a>
      </div>

      {/* Zone 2: Navigation Links / Continent Tabs (Single-line controls) */}
      <nav 
        aria-label="Filtro por continente" 
        className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none"
      >
        {CONTINENT_FILTERS.map((continent) => {
          const isActive = currentContinent === continent;
          return (
            <button
              key={continent}
              onClick={() => onSelectContinent(continent)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EAE2D2] text-[#8C3A27] shadow-xs font-semibold'
                  : 'text-[#695F54] hover:text-[#2A241F] hover:bg-[#F2ECE0]'
              }`}
            >
              {continent}
            </button>
          );
        })}
      </nav>

      {/* Search Input (Collapsible on mobile) */}
      <div className="flex items-center gap-2 max-w-xs w-full lg:w-48">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#998E82]" />
          <input
            type="text"
            placeholder="Buscar sítio ou país..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#F0E9DC]/75 border border-[#DFD6C5] focus:outline-none focus:border-[#8C3A27] focus:bg-white text-[#2C2723] placeholder-[#9E9489] transition-all"
          />
        </div>
      </div>

      {/* Zone 3: 1–2 Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTimeline}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4D443C] bg-[#ECE5D6] hover:bg-[#E2DAC9] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          title="Ver linha do tempo arqueológica das obras"
        >
          <Clock className="w-3.5 h-3.5 text-[#8C3A27]" />
          <span className="hidden sm:inline">Cronologia</span>
        </button>

        <button
          onClick={onRandomTour}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#8C3A27] hover:bg-[#78301F] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          title="Viajar aleatoriamente para uma arte rupestre"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sítio Aleatório</span>
        </button>
      </div>

    </header>
  );
};
