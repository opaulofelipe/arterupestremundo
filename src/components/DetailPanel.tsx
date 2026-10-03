import React from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Layers, 
  Award, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { RockArtSite } from '../data/rockArtSites';

interface DetailPanelProps {
  site: RockArtSite;
  onClose: () => void;
  onOpenLightbox: () => void;
  onSelectSite: (site: RockArtSite) => void;
  allSites: RockArtSite[];
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  site,
  onClose,
  onOpenLightbox,
  onSelectSite,
  allSites
}) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  // Reset image state when site changes
  React.useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [site.id]);

  const currentIndex = allSites.findIndex((s) => s.id === site.id);
  const prevSite = currentIndex > 0 ? allSites[currentIndex - 1] : allSites[allSites.length - 1];
  const nextSite = currentIndex < allSites.length - 1 ? allSites[currentIndex + 1] : allSites[0];

  return (
    <aside 
      aria-label={`Informações detalhadas sobre ${site.name}`}
      className="w-full md:w-[440px] lg:w-[480px] h-full max-h-[100dvh] flex flex-col bg-[#FAF8F5]/98 backdrop-blur-md border-l border-[#E5DECF] shadow-2xl overflow-hidden z-30 transition-all duration-300"
    >
      {/* Top Bar with curatorial metadata and close button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E1D3] bg-[#FAF8F5]">
        <div className="flex items-center gap-2 text-xs font-sans text-[#786F66]">
          <span className="font-semibold text-[#8C3A27] uppercase tracking-wider text-[11px]">
            {site.continent}
          </span>
          <span aria-hidden="true" className="text-[#C5BDAF]">·</span>
          <span>{site.country}</span>
          {site.unesco && (
            <>
              <span aria-hidden="true" className="text-[#C5BDAF]">·</span>
              <span className="inline-flex items-center gap-1 text-[#6B5A3E] font-medium">
                <Award className="w-3 h-3 text-[#A67C37]" />
                UNESCO
              </span>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar painel e restaurar visão do mapa mundi"
          className="p-1.5 text-[#73685E] hover:text-[#1F1B18] hover:bg-[#EFE9DD] rounded-full transition-colors cursor-pointer group"
          title="Fechar e ver mapa inteiro"
        >
          <X className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        
        {/* Title Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#241F1C] tracking-tight leading-tight">
            {site.name}
          </h1>
          {site.originalName && site.originalName !== site.name && (
            <p className="text-xs text-[#7A7167] font-serif italic mt-0.5">
              {site.originalName}
            </p>
          )}
        </div>

        {/* Real Photograph with Click to Inspect */}
        <div className="space-y-2">
          <div 
            onClick={onOpenLightbox}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenLightbox()}
            className="group relative w-full h-56 md:h-64 rounded-xl overflow-hidden bg-[#ECE5D8] border border-[#DDD5C5] shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C3A27]"
            title="Clique para ampliar a fotografia em alta resolução"
          >
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#EDE6D9] animate-pulse">
                <span className="text-xs text-[#8A8074] font-serif">Carregando acervo fotográfico...</span>
              </div>
            )}

            {!imgError ? (
              <img
                src={site.imageUrl}
                alt={`${site.name} — ${site.imageCaption}`}
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EBE4D5]">
                <BookOpen className="w-10 h-10 text-[#A89C8B] mb-2" />
                <p className="font-serif text-sm font-medium text-[#4A423A]">{site.name}</p>
                <p className="text-xs text-[#7A7064] mt-1">{site.region}, {site.country}</p>
              </div>
            )}

            {/* Hover overlay affordance */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
              <span className="text-xs text-white/90 font-sans flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                Ampliar fotografia
              </span>
              <span className="text-[11px] text-white/75 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                Foto real
              </span>
            </div>
          </div>

          <p className="text-[12px] font-sans text-[#786E64] italic leading-snug">
            {site.imageCaption}
          </p>
        </div>

        {/* Key Archival Metrics Grid (Zero-Pill Discipline) */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#EAE3D5]">
          <div className="space-y-1">
            <span className="text-[11px] font-sans text-[#8C8276] uppercase tracking-wider block">
              Idade Estimada
            </span>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#2E2824]">
              <Calendar className="w-4 h-4 text-[#A8583E] shrink-0" />
              <span>{site.approxAge}</span>
            </div>
            <span className="text-[11px] text-[#786E63] block font-serif">
              {site.period}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-sans text-[#8C8276] uppercase tracking-wider block">
              Localização Atual
            </span>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#2E2824]">
              <MapPin className="w-4 h-4 text-[#A8583E] shrink-0" />
              <span className="truncate">{site.country}</span>
            </div>
            <span className="text-[11px] text-[#786E63] block truncate" title={site.region}>
              {site.region}
            </span>
          </div>
        </div>

        {/* Didactic Overview Paragraph (Core prompt requirement) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C3A27] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sobre a Obra</span>
          </div>
          <p className="text-[#352F2B] font-sans text-[14px] leading-relaxed text-justify first-letter:text-3xl first-letter:font-serif first-letter:font-semibold first-letter:text-[#8C3A27] first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            {site.didacticSummary}
          </p>
        </div>

        {/* Archaeological Context & Discovery */}
        <div className="p-4 rounded-xl bg-[#F3EDE2] border border-[#E4DC CE] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#655848]">
            <Sparkles className="w-3.5 h-3.5 text-[#B26E35]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Importância Histórica
            </span>
          </div>
          <p className="text-xs text-[#4A423A] leading-relaxed">
            {site.historicalSignificance}
          </p>
          {site.discoveryYear && (
            <div className="pt-2 border-t border-[#E5DEC C] flex items-center justify-between text-[11px] text-[#7A7064]">
              <span>Registro / Descoberta: <strong>{site.discoveryYear}</strong></span>
              <span>Destaque: <strong>{site.highlightedElement}</strong></span>
            </div>
          )}
        </div>

        {/* Technique & Medium */}
        <div className="space-y-1.5 text-xs text-[#5D544B]">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#786E63] uppercase tracking-wider">
            <Layers className="w-3 h-3 text-[#A8583E]" />
            <span>Técnica & Pigmentos</span>
          </div>
          <p className="text-xs text-[#423B34] pl-4 border-l-2 border-[#D8CEBE]">
            {site.technique}
          </p>
        </div>

        {/* Coordinates indicator */}
        <div className="flex items-center justify-between text-[11px] text-[#857B70] pt-2 border-t border-[#EAE3D5]">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#A8583E]" />
            Coordenadas: {site.coordinates[1].toFixed(4)}° N, {site.coordinates[0].toFixed(4)}° E
          </span>
          <span>{currentIndex + 1} de {allSites.length} obras</span>
        </div>

      </div>

      {/* Footer Navigation Bar */}
      <div className="px-6 py-3.5 border-t border-[#E8E1D3] bg-[#FAF8F5] flex items-center justify-between gap-3">
        <button
          onClick={() => onSelectSite(prevSite)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-[#544B43] bg-[#EFE8DC] hover:bg-[#E5DDCF] rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>

        <button
          onClick={onClose}
          className="flex-1 py-2 px-4 text-xs font-medium text-white bg-[#8C3A27] hover:bg-[#773121] rounded-lg shadow-sm transition-colors cursor-pointer text-center"
          title="Fechar painel e voltar ao mapa inteiro"
        >
          Voltar ao Mapa
        </button>

        <button
          onClick={() => onSelectSite(nextSite)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-[#544B43] bg-[#EFE8DC] hover:bg-[#E5DDCF] rounded-lg transition-colors cursor-pointer"
        >
          <span>Próxima</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
