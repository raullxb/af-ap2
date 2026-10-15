import { useState, useMemo } from 'react';
import ItemCard from './ItemCard';
import { ArrowUpDown, CloudOff, RefreshCw } from 'lucide-react';

/**
 * Componente ItemList
 * Contêiner responsivo que renderiza uma coleção de cards meteorológicos (ItemCard).
 * Oferece ordenação dinâmica por nome e temperatura, além de tratamento para lista vazia.
 *
 * @param {Object} props
 * @param {Array} props.items - Lista de itens/cidades meteorológicas
 * @param {Object|null} props.selectedItem - Item atualmente selecionado
 * @param {Function} props.onSelectItem - Callback ao selecionar uma cidade
 * @param {Array<string>} props.favorites - Lista de IDs ou nomes de cidades favoritas
 * @param {Function} props.onToggleFavorite - Callback para favoritar/desfavoritar
 * @param {"C"|"F"} [props.unit="C"] - Unidade de temperatura atual
 * @param {Function} [props.onResetFilter] - Callback para limpar filtros
 */
export default function ItemList({
  items = [],
  selectedItem,
  onSelectItem,
  favorites = [],
  onToggleFavorite,
  unit = 'C',
  onResetFilter
}) {
  const [sortBy, setSortBy] = useState('default'); // 'default', 'temp-desc', 'temp-asc', 'name'

  // Ordenação dos itens
  const sortedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const list = [...items];

    switch (sortBy) {
      case 'temp-desc':
        return list.sort((a, b) => b.temp - a.temp);
      case 'temp-asc':
        return list.sort((a, b) => a.temp - b.temp);
      case 'name':
        return list.sort((a, b) => a.city.localeCompare(b.city));
      default:
        return list;
    }
  }, [items, sortBy]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-slate-800/40 border border-slate-700/50">
        <div className="p-4 rounded-full bg-slate-800 text-slate-400 mb-3 shadow-inner">
          <CloudOff className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">Nenhuma localidade encontrada</h3>
        <p className="text-sm text-slate-400 max-w-md mt-1 mb-5">
          Não há resultados que correspondam à sua busca ou filtro atual. Tente buscar outro nome de cidade ou limpe os filtros.
        </p>
        {onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-300 rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar todos os filtros</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de Contagem e Ordenação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-slate-400">
        <p>
          Exibindo <span className="font-semibold text-cyan-400">{sortedItems.length}</span>{' '}
          {sortedItems.length === 1 ? 'localidade' : 'localidades'}
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-cyan-400 focus:outline-none cursor-pointer"
          >
            <option value="default">Padrão</option>
            <option value="temp-desc">Maior Temperatura (🔥)</option>
            <option value="temp-asc">Menor Temperatura (❄️)</option>
            <option value="name">Nome da Cidade (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Responsiva com ItemCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedItems.map((item) => {
          const isFav = favorites.includes(item.id) || favorites.includes(item.city);
          const isSelected = selectedItem && (selectedItem.id === item.id || selectedItem.city === item.city);

          return (
            <ItemCard
              key={item.id || item.city}
              item={item}
              isSelected={isSelected}
              onSelect={onSelectItem}
              isFavorite={isFav}
              onToggleFavorite={onToggleFavorite}
              unit={unit}
            />
          );
        })}
      </div>
    </div>
  );
}
