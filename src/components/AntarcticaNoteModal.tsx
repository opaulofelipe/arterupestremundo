import React from 'react';
import { X, Globe2, Snowflake, Compass } from 'lucide-react';

interface AntarcticaNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AntarcticaNoteModal: React.FC<AntarcticaNoteModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nota sobre a Antártida e os Continentes"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E0D7C6] overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8EEF2] flex items-center justify-center text-[#4A728E]">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-[#29231E]">
                E quanto à Antártida?
              </h2>
              <span className="text-xs text-[#7B7166]">
                Rigor geográfico e arqueológico
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar nota"
            className="p-1.5 text-[#73685E] hover:text-[#1F1B18] hover:bg-[#EBE3D3] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs md:text-sm text-[#453D35] leading-relaxed">
          <p>
            A <strong>Antártida</strong> é o único continente da Terra onde não existem registros arqueológicos de arte rupestre pré-histórica.
          </p>
          <p>
            Diferente de todos os outros seis continentes — onde populações ancestrais de caçadores-coletores e pastores prosperaram durante o Pleistoceno e Holoceno —, a calota polar antártica permaneceu isolada pelos mares austrais congelados e inabitada pela espécie humana até as primeiras expedições de exploração científica no século XIX.
          </p>
          <div className="p-3 bg-[#F0EBE0] rounded-xl border border-[#E2D8C6] text-xs text-[#5D5347]">
            Nosso atlas reúne obras-primas autênticas de todos os continentes habitados na pré-história: <strong>África, América do Sul, América do Norte, Ásia, Europa e Oceania</strong>.
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-[#8C3A27] hover:bg-[#78301F] rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
