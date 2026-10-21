import { X } from 'lucide-react';

export default function ItemDetails({ item, onClose, isFavorite, onToggleFavorite }) {
  if (!item) return null;

  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Proporção travada no poster pra não esmagar a imagem */}
        <div className="w-full md:w-[320px] shrink-0 bg-slate-950 aspect-[2/3] md:aspect-auto">
          <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>

        {/* Informações */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-2 leading-tight">
              {item.title}
            </h2>
            <div className="flex gap-3 items-center text-sm mb-6">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
                {item.release_date ? item.release_date.substring(0, 4) : 'Ano N/A'}
              </span>
              <span className="px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold">
                ★ {item.vote_average?.toFixed(1) || 'N/A'}
              </span>
            </div>
            
            <h4 className="text-slate-100 font-semibold mb-2">Sinopse</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
              {item.overview || "Nenhuma sinopse disponível para este filme no momento."}
            </p>
          </div>

          <button 
            onClick={() => onToggleFavorite(item.id)}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20' 
                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-500/20'
            }`}
          >
            {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </button>
        </div>

      </div>
    </div>
  );
}