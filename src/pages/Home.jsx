import { useState, useCallback, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchMovies } from '../services/api';
import NavBar from '../components/NavBar';
import ItemList from '../components/ItemList';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemDetails from '../components/ItemDetails';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'popular',
    genre: '',
    year: ''
  });
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [favoritos, setFavoritos] = useLocalStorage('filmes_favoritos', []);

  const fetchFn = useCallback(
    (signal) => fetchMovies(signal, filters),
    [filters]
  );

  const { data: movies, loading, error, refetch } = useFetch(fetchFn);

  useEffect(() => {
    refetch();
  }, [fetchFn, refetch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({
      search: searchInput,
      category: 'popular',
      genre: '',
      year: ''
    });
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setSearchInput('');
      setFilters({ search: '', category: 'popular', genre: '', year: '' });
      return;
    }

    setSearchInput('');
    setFilters(prev => {
      const newFilters = { ...prev, search: '', [key]: value };
      
      // Se clicou numa categoria, zera gênero e ano
      if (key === 'category') {
        newFilters.genre = '';
        newFilters.year = '';
      }
      
      // Se filtrou por gênero ou ano, zera a categoria para a API usar o Discover
      if (key === 'genre' || key === 'year') {
        newFilters.category = '';
      }

      return newFilters;
    });
  };

  const handleToggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((favId) => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <header className="mb-6 mt-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CineCatálogo
          </h1>
        </header>

        <NavBar 
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <main className="w-full">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-8 text-center text-sm max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Localizando filmes no banco de dados..." />
          ) : (
            <ItemList
              items={movies || []}
              favoritos={favoritos}
              onToggleFavorito={handleToggleFavorito}
              onSelect={setSelectedItem}
            />
          )}
        </main>
      </div>

      {selectedItem && (
        <ItemDetails 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          isFavorite={favoritos.includes(selectedItem.id)}
          onToggleFavorite={handleToggleFavorito}
        />
      )}
    </div>
  );
}