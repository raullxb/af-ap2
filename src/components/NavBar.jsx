import { useState } from 'react';
import { Menu, X, Search, Film, Star, Flame } from 'lucide-react';

export default function NavBar({ searchInput, setSearchInput, onSearchSubmit, filters, onFilterChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customYear, setCustomYear] = useState('');

  const genres = [
    { id: 28, name: 'Ação' }, { id: 35, name: 'Comédia' }, { id: 18, name: 'Drama' },
    { id: 878, name: 'Ficção Científica' }, { id: 27, name: 'Terror' },
    { id: 10749, name: 'Romance' }, { id: 16, name: 'Animação' }
  ];

  const quickYears = ['2024', '2023', '2022', '2020', '2015', '2010', '2000'];

  const handleSelectFilter = (key, value) => {
    onFilterChange(key, value);
    // Não fecha o menu para permitir clicar em Gênero E Ano
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 flex flex-col gap-4">
      
      {/* Barra de Pesquisa */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-lg">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
          title="Filtros Avançados"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={onSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Pesquise filmes (ex: Batman)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 outline-none focus:border-cyan-500 text-sm transition-all"
            />
          </div>
          <button 
            type="submit"
            className="hidden sm:block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-cyan-500/20"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Atalhos Fora do Menu (Tags) */}
      <div className="flex flex-wrap justify-center gap-2">
        <button 
          onClick={() => onFilterChange('category', 'popular')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filters.category === 'popular' && !filters.genre && !filters.year && !filters.search ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          <Flame className="w-4 h-4" /> Em Alta
        </button>
        <button 
          onClick={() => onFilterChange('category', 'top_rated')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filters.category === 'top_rated' && !filters.genre && !filters.year && !filters.search ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          <Star className="w-4 h-4" /> Bem Avaliados
        </button>
      </div>

      {/* Menu Hambúrguer (Drawer Lateral mais fino) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>

          {/* w-72 para deixar o menu menos largo */}
          <div className="relative w-72 bg-slate-900 h-full border-r border-slate-800 shadow-2xl flex flex-col animate-fade-in">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-500" /> Filtros
              </h2>
              <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6 scrollbar-thin">
              
              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ano de Lançamento</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickYears.map(y => (
                    <button
                      key={y}
                      onClick={() => handleSelectFilter('year', y)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.year === y ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Outro ano..." 
                    value={customYear}
                    onChange={(e) => setCustomYear(e.target.value)}
                    className="flex-1 p-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 outline-none focus:border-cyan-500 text-sm"
                  />
                  <button 
                    onClick={() => { if(customYear) handleSelectFilter('year', customYear); }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    OK
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Gêneros</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => handleSelectFilter('genre', genre.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filters.genre === genre.id ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </section>

              <button 
                onClick={() => {
                  handleSelectFilter('clear', null);
                  setCustomYear('');
                  setIsMenuOpen(false);
                }}
                className="mt-auto px-4 py-3 bg-rose-500/10 text-rose-400 font-bold rounded-xl text-sm hover:bg-rose-500/20 transition-colors border border-rose-500/20"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}