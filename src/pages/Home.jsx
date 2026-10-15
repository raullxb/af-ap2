import { useState, useMemo, useCallback } from 'react';
import SearchForm from '../components/SearchForm';
import ItemList from '../components/ItemList';
import ItemDetails from '../components/ItemDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchCatalogCities, searchCityWeather } from '../services/api';
import { CloudSun, RefreshCw, AlertCircle, X } from 'lucide-react';

export default function Home() {
  // Estados da aplicação (useState)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [unit, setUnit] = useState('C'); // 'C' ou 'F'
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Custom Hook: useLocalStorage para persistir favoritos
  const [favorites, setFavorites] = useLocalStorage('weather_app_favorites', [
    'São Paulo',
    'Rio de Janeiro'
  ]);

  // Custom Hook: useFetch para carregar catálogo inicial de cidades
  const {
    data: initialCities,
    loading: isLoadingCatalog,
    error: catalogError,
    refetch: refetchCatalog
  } = useFetch(fetchCatalogCities);

  // Lista local combinada (permite adicionar novas cidades pesquisadas)
  const [customCities, setCustomCities] = useState([]);

  // Agrupa todas as cidades (padrão + pesquisadas pelo usuário)
  const allCities = useMemo(() => {
    const base = initialCities || [];
    // Evita duplicatas pelo nome da cidade
    const map = new Map();
    base.forEach((c) => map.set(c.city.toLowerCase(), c));
    customCities.forEach((c) => map.set(c.city.toLowerCase(), c));
    return Array.from(map.values());
  }, [initialCities, customCities]);

  // Filtragem combinada por busca textual e condição climática
  const filteredCities = useMemo(() => {
    return allCities.filter((item) => {
      // 1. Filtro textual
      const matchesSearch =
        !searchTerm.trim() ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (item.state && item.state.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (item.country && item.country.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      if (!matchesSearch) return false;

      // 2. Filtro por categoria / condição
      switch (activeFilter) {
        case 'sunny':
          return item.condition === 'sunny';
        case 'cloudy':
          return item.condition === 'cloudy';
        case 'rain':
          return item.condition === 'rain' || item.condition === 'storm';
        case 'cold':
          return item.temp < 20;
        case 'warm':
          return item.temp > 25;
        case 'favorites':
          return favorites.includes(item.id) || favorites.includes(item.city);
        default:
          return true;
      }
    });
  }, [allCities, searchTerm, activeFilter, favorites]);

  // Handler para alternar favorito
  const handleToggleFavorite = useCallback((cityItem) => {
    setFavorites((prev) => {
      const id = cityItem.city;
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id);
      }
      return [...prev, id];
    });
  }, [setFavorites]);

  // Handler para busca de nova cidade via API
  const handleSearchSubmit = async (cityQuery) => {
    if (!cityQuery || !cityQuery.trim()) return;

    setIsSearchingCity(true);
    setErrorMessage(null);

    try {
      const cityResult = await searchCityWeather(cityQuery.trim());
      if (cityResult) {
        // Adiciona à lista de cidades customizadas
        setCustomCities((prev) => [cityResult, ...prev]);
        // Abre imediatamente os detalhes da cidade encontrada
        setSelectedItem(cityResult);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : `Não foi possível encontrar a cidade "${cityQuery}".`
      );
    } finally {
      setIsSearchingCity(false);
    }
  };

  // Handler de seleção rápida de sugestão
  const handleQuickCitySelect = (cityName) => {
    setSearchTerm(cityName);
    handleSearchSubmit(cityName);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      {/* Background Decorativo com Efeito Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Cabeçalho / Navbar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 text-white">
              <CloudSun className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  ClimaSphere
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AP2 React
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                Catálogo meteorológico interativo com consumo de API REST
              </p>
            </div>
          </div>

          {/* Controles de Topo: Unidade & Recarregar */}
          <div className="flex items-center gap-3">
            {/* Seletor de Unidade °C / °F */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setUnit('C')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unit === 'C'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setUnit('F')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unit === 'F'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            {/* Botão de Atualizar Dados */}
            <button
              type="button"
              onClick={() => refetchCatalog()}
              disabled={isLoadingCatalog}
              title="Recarregar dados meteorológicos"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCatalog ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </header>

        {/* Mensagem de Erro / Alerta */}
        {(errorMessage || catalogError) && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-fade-in shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage || catalogError}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Seção de Busca e Filtros */}
        <section className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg">
          <SearchForm
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSubmit={handleSearchSubmit}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onQuickCitySelect={handleQuickCitySelect}
            isLoading={isSearchingCity}
          />
        </section>

        {/* Seção da Listagem de Itens (ItemList) */}
        <main className="space-y-4">
          {isLoadingCatalog ? (
            <LoadingSpinner message="Consultando API de meteorologia em tempo real..." size="lg" />
          ) : (
            <ItemList
              items={filteredCities}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              unit={unit}
              onResetFilter={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
            />
          )}
        </main>
      </div>

      {/* Modal de Detalhes da Cidade Selecionada (ItemDetails) */}
      {selectedItem && (
        <ItemDetails
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isFavorite={favorites.includes(selectedItem.city) || favorites.includes(selectedItem.id)}
          onToggleFavorite={handleToggleFavorite}
          unit={unit}
        />
      )}

      {/* Rodapé Informativo */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Desenvolvido para a <strong className="text-slate-300">Avaliação Prática AP2</strong> • Aplicações Front-end
          </p>
          <p className="flex items-center gap-1.5">
            <span>Tecnologias:</span>
            <span className="text-cyan-400 font-semibold">React</span> •
            <span className="text-cyan-400 font-semibold">Tailwind CSS</span> •
            <span className="text-cyan-400 font-semibold">REST API</span>
          </p>
        </div>
      </footer>
    </div>
  );
}