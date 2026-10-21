export default function ItemCard({ filme, isFavorito, onToggleFavorito, onSelect }) {
  const imageUrl = filme.poster_path 
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

  return (
    <div className="bg-slate-900/50 rounded-2xl overflow-hidden shadow-lg border border-slate-900 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
      
      {/* Container com aspect-[2/3] garante a proporção de pôster perfeita sem cortar */}
      <div 
        className="w-full aspect-[2/3] overflow-hidden bg-slate-950 relative cursor-pointer" 
        onClick={() => onSelect(filme)}
      >
        <img 
          src={imageUrl} 
          alt={filme.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm transition-opacity duration-300">
            Ver Sinopse
          </span>
        </div>
        <div className="absolute top-2 right-2 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-500 shadow-md">
          ★ {filme.vote_average?.toFixed(1) || 'N/A'}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between text-center">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-200 line-clamp-2 mb-1" title={filme.title}>
            {filme.title}
          </h3>
          <p className="text-xs text-slate-500">
            {filme.release_date ? filme.release_date.substring(0, 4) : 'Ano N/A'}
          </p>
        </div>
        
        <button 
          onClick={() => onToggleFavorito(filme.id)}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
            isFavorito 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isFavorito ? '❤️ Favoritado' : '🖤 Favoritar'}
        </button>
      </div>
    </div>
  );
}