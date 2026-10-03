import React from 'react';
import { X, ZoomIn, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { RockArtSite } from '../data/rockArtSites';

interface ImageLightboxProps {
  site: RockArtSite | null;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ site, onClose }) => {
  const [imageError, setImageError] = React.useState(false);

  if (!site) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografia de ${site.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#1A1816] rounded-xl overflow-hidden shadow-2xl border border-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar inside modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#141210]">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-sans tracking-wide">
              <span>{site.continent}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-500" />
                {site.country}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-500" />
                {site.approxAge}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-stone-100 mt-1 font-medium">
              {site.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar visualização"
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image viewport */}
        <div className="relative flex-1 min-h-[350px] max-h-[65vh] flex items-center justify-center bg-[#0D0B0A] overflow-hidden p-2">
          {!imageError ? (
            <img
              src={site.imageUrl}
              alt={`${site.name} — ${site.imageCaption}`}
              referrerPolicy="no-referrer"
              className="max-h-[62vh] max-w-full object-contain rounded transition-all duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-stone-400">
              <ZoomIn className="w-12 h-12 text-stone-600 mb-3" />
              <p className="font-serif text-lg text-stone-300">{site.name}</p>
              <p className="text-xs text-stone-500 max-w-md mt-1">
                Registro fotográfico documentado em {site.region}, {site.country}.
              </p>
            </div>
          )}
        </div>

        {/* Caption & Metadata Footer */}
        <div className="px-6 py-4 bg-[#141210] border-t border-stone-800 text-stone-300">
          <p className="text-xs md:text-sm font-sans leading-relaxed text-stone-300">
            {site.imageCaption}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
            <span>
              Técnica: <strong className="text-stone-300 font-medium">{site.technique}</strong>
            </span>
            <span className="flex items-center gap-1.5 text-stone-500">
              Fotografia histórica e acervo documental oficial Wikimedia Commons
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
