export default function SearchForm({ searchTerm, onSearchChange, onSubmit, category, onCategoryChange }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10 flex flex-col gap-4">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquise por qualquer filme (ex: Batman, Forrest Gump)..."
          className="flex-1 p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 outline-none focus:border-cyan-500 shadow-inner text-sm transition-all"
        />
        <button 
          type="submit"
          className="px-6 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-cyan-500/20"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onCategoryChange('popular')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            category === 'popular' && !searchTerm
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔥 Populares
        </button>
        <button
          onClick={() => onCategoryChange('top_rated')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            category === 'top_rated' && !searchTerm
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          ⭐ Mais Bem Avaliados
        </button>
        <button
          onClick={() => onCategoryChange('upcoming')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            category === 'upcoming' && !searchTerm
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          📅 Lançamentos
        </button>
      </div>
    </div>
  );
}