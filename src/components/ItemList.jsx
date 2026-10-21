import ItemCard from './ItemCard';

export default function ItemList({ items, favoritos, onToggleFavorito, onSelect }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-900 max-w-md mx-auto">
        <p className="text-slate-400 text-sm">Nenhum filme encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 w-full">
      {items.map((filme) => (
        <ItemCard 
          key={filme.id}
          filme={filme}
          isFavorito={favoritos.includes(filme.id)}
          onToggleFavorito={onToggleFavorito}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}