import React from 'react';
import { X, Clock, MapPin, ArrowRight } from 'lucide-react';
import { RockArtSite } from '../data/rockArtSites';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: RockArtSite[];
  onSelectSite: (site: RockArtSite) => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  sites,
  onSelectSite,
}) => {
  if (!isOpen) return null;

  // Sort sites chronologically (oldest to newest)
  const sortedSites = [...sites].sort((a, b) => b.estimatedAgeYears - a.estimatedAgeYears);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cronologia das Artes Rupestres"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[85vh] flex flex-col bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E0D7C6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E1D3] bg-[#F7F4EE]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFE7D8] flex items-center justify-center text-[#8C3A27]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-[#29231E]">
                Cronologia da Criação Humana
              </h2>
              <p className="text-xs text-[#7B7166] mt-0.5">
                Uma jornada através de mais de 45 milênios de arte rupestre mundial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar cronologia"
            className="p-2 text-[#73685E] hover:text-[#1F1B18] hover:bg-[#EBE3D3] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline list */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DDD4C4]">
            {sortedSites.map((site) => (
              <div
                key={site.id}
                onClick={() => {
                  onSelectSite(site);
                  onClose();
                }}
                className="group relative mb-6 cursor-pointer"
              >
                {/* Timeline node marker */}
                <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#FAF8F5] border-2 border-[#8C3A27] group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E5DDCF] group-hover:bg-[#EFE8DC] group-hover:border-[#D5C9B4] transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#8C3A27] tracking-wider uppercase">
                      {site.approxAge}
                    </span>
                    <span className="text-xs text-[#7C7267] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B05C42]" />
                      {site.country} · {site.continent}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-medium text-[#29231F] mt-1 group-hover:text-[#8C3A27] transition-colors flex items-center justify-between">
                    <span>{site.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#8C3A27]" />
                  </h3>

                  <p className="text-xs text-[#5C534A] line-clamp-2 mt-1 leading-relaxed">
                    {site.didacticSummary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F4EFE6] border-t border-[#E8E1D3] text-center text-xs text-[#7C7267]">
          <span>Clique em qualquer obra da linha do tempo para voar e aproximar a câmera do mapa.</span>
        </div>
      </div>
    </div>
  );
};
