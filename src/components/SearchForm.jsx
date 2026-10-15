import { Search, X, Sparkles, Filter, Star, Sun, CloudRain, Cloud, ThermometerSnowflake, Flame } from 'lucide-react';

/**
 * Componente SearchForm (Formulário Controlado)
 * Gerencia a entrada de busca de cidades e botões de filtros por condições meteorológicas.
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Valor controlado do input de busca
 * @param {Function} props.onSearchChange - Callback ao alterar o texto
 * @param {Function} props.onSubmit - Callback ao enviar o formulário
 * @param {string} props.activeFilter - Filtro de categoria selecionado
 * @param {Function} props.onFilterChange - Callback para trocar de filtro
 * @param {Function} props.onQuickCitySelect - Callback para buscar cidade rápida via chip
 * @param {boolean} props.isLoading - Estado de carregamento da busca
 */
export default function SearchForm({
  searchTerm,
  onSearchChange,
  onSubmit,
  activeFilter = 'all',
  onFilterChange,
  onQuickCitySelect,
  isLoading = false
}) {
  const popularCities = ['São Paulo', 'Rio de Janeiro', 'Curitiba', 'Salvador', 'Nova York', 'Tóquio', 'Paris'];

  const filters = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'sunny', label: 'Ensolarado', icon: Sun },
    { id: 'cloudy', label: 'Nublado', icon: Cloud },
    { id: 'rain', label: 'Chuva', icon: CloudRain },
    { id: 'cold', label: 'Frio (<20°C)', icon: ThermometerSnowflake },
    { id: 'warm', label: 'Calor (>25°C)', icon: Flame },
    { id: 'favorites', label: 'Favoritos', icon: Star }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && !isLoading) {
      onSubmit(searchTerm.trim());
    }
  };

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="w-full space-y-4">
      {/* Formulário Controlado Principal */}
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar cidade (ex: São Paulo, Rio, Londres, Tóquio)..."
            disabled={isLoading}
            className="w-full pl-11 pr-10 py-3 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all shadow-inner"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              title="Limpar campo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="search-submit-btn"
          type="submit"
          disabled={!searchTerm.trim() || isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'Buscando...' : 'Buscar Cidade'}</span>
        </button>
      </form>

      {/* Atalhos Rápidos de Cidades Populares */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
        <span className="font-medium text-slate-300">Sugestões:</span>
        {popularCities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onQuickCitySelect && onQuickCitySelect(city)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors cursor-pointer"
          >
            {city}
          </button>
        ))}
      </div>

      {/* Barra de Filtros por Categoria / Condição */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filtrar por Condição ou Temperatura:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange && onFilterChange(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-900 font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-cyan-400'}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
