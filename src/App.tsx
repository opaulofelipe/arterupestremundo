/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ROCK_ART_SITES, RockArtSite, ContinentFilter, CONTINENT_FILTERS } from './data/rockArtSites';
import { Header } from './components/Header';
import { WorldMap } from './components/WorldMap';
import { DetailPanel } from './components/DetailPanel';
import { TimelineModal } from './components/TimelineModal';
import { ImageLightbox } from './components/ImageLightbox';
import { AntarcticaNoteModal } from './components/AntarcticaNoteModal';
import { Globe, HelpCircle } from 'lucide-react';

export default function App() {
  const [selectedSite, setSelectedSite] = useState<RockArtSite | null>(null);
  const [currentContinent, setCurrentContinent] = useState<ContinentFilter>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isAntarcticaNoteOpen, setIsAntarcticaNoteOpen] = useState(false);
  const [lightboxSite, setLightboxSite] = useState<RockArtSite | null>(null);

  // Close detail card and restore default world map zoom
  const handleCloseDetail = () => {
    setSelectedSite(null);
  };

  // Pick random site for interactive discovery tour
  const handleRandomTour = () => {
    const availableSites = currentContinent === 'Todos' 
      ? ROCK_ART_SITES 
      : ROCK_ART_SITES.filter(s => s.continent === currentContinent);
    
    // Pick different site than current if possible
    const candidates = availableSites.filter(s => s.id !== selectedSite?.id);
    const pool = candidates.length > 0 ? candidates : availableSites;
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    setSelectedSite(randomPick);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF7F2] font-sans text-[#2D2723]">
      
      {/* Top Bar Contract (Wordmark, Nav links, Actions) */}
      <Header
        currentContinent={currentContinent}
        onSelectContinent={(c) => {
          setCurrentContinent(c);
          // If the selected site is not in the newly chosen continent, close it to restore zoom
          if (selectedSite && c !== 'Todos' && selectedSite.continent !== c) {
            setSelectedSite(null);
          }
        }}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onRandomTour={handleRandomTour}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mobile continent sub-bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-[#F3EDE2] border-b border-[#E3D9C9] scrollbar-none shrink-0">
        {CONTINENT_FILTERS.map((continent) => (
          <button
            key={continent}
            onClick={() => {
              setCurrentContinent(continent);
              if (selectedSite && continent !== 'Todos' && selectedSite.continent !== continent) {
                setSelectedSite(null);
              }
            }}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              currentContinent === continent
                ? 'bg-[#E5DBC7] text-[#8C3A27] font-semibold'
                : 'text-[#63594E] hover:bg-[#EBE2D2]'
            }`}
          >
            {continent}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex flex-col md:flex-row">
        
        {/* World Map Viewport (Takes full space or left area) */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          <WorldMap
            sites={ROCK_ART_SITES}
            selectedSite={selectedSite}
            onSelectSite={(site) => setSelectedSite(site)}
            onCloseSite={handleCloseDetail}
            continentFilter={currentContinent}
            searchQuery={searchQuery}
          />
        </div>

        {/* Informative Detail Panel (Smooth slide-in on selection) */}
        {selectedSite && (
          <div className="absolute inset-x-0 bottom-0 md:relative md:inset-auto h-[68vh] md:h-full z-30 transition-transform duration-300 ease-out animate-fadeIn">
            <DetailPanel
              site={selectedSite}
              onClose={handleCloseDetail}
              onOpenLightbox={() => setLightboxSite(selectedSite)}
              onSelectSite={(site) => setSelectedSite(site)}
              allSites={ROCK_ART_SITES}
            />
          </div>
        )}

      </main>

      {/* Subtle Scholarly Footnote & Antarctica query button */}
      <footer className="h-8 px-4 md:px-6 bg-[#FAF7F2] border-t border-[#EAE2D2] flex items-center justify-between text-[11px] text-[#7A7064] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <span className="font-serif">
            Atlas Rupestre · Arqueologia e Paleantropologia Global
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-[#C5BCAE]">·</span>
          <span className="hidden sm:inline">Fotografias reais catalogadas</span>
        </div>

        <button
          onClick={() => setIsAntarcticaNoteOpen(true)}
          className="flex items-center gap-1 hover:text-[#8C3A27] transition-colors cursor-pointer"
          title="Por que a Antártida não possui arte rupestre?"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#9E9283]" />
          <span>Nota sobre a Antártida</span>
        </button>
      </footer>

      {/* Modals & Dialogs */}
      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        sites={ROCK_ART_SITES}
        onSelectSite={(site) => {
          setSelectedSite(site);
          setIsTimelineOpen(false);
        }}
      />

      <ImageLightbox
        site={lightboxSite}
        onClose={() => setLightboxSite(null)}
      />

      <AntarcticaNoteModal
        isOpen={isAntarcticaNoteOpen}
        onClose={() => setIsAntarcticaNoteOpen(false)}
      />

    </div>
  );
}
