import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Star,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  MapPin
} from 'lucide-react';

/**
 * Retorna o ícone do Lucide correspondente à condição meteorológica
 */
function getWeatherIcon(iconName, condition) {
  switch (iconName) {
    case 'Sun':
      return <Sun className="w-9 h-9 text-amber-400 animate-spin-slow" />;
    case 'CloudSun':
      return <CloudSun className="w-9 h-9 text-amber-300" />;
    case 'Cloud':
      return <Cloud className="w-9 h-9 text-slate-300" />;
    case 'CloudDrizzle':
      return <CloudDrizzle className="w-9 h-9 text-cyan-300" />;
    case 'CloudRain':
      return <CloudRain className="w-9 h-9 text-blue-400" />;
    case 'CloudLightning':
      return <CloudLightning className="w-9 h-9 text-purple-400 animate-pulse" />;
    case 'Snowflake':
      return <Snowflake className="w-9 h-9 text-cyan-200" />;
    default:
      if (condition === 'sunny') return <Sun className="w-9 h-9 text-amber-400" />;
      if (condition === 'rain') return <CloudRain className="w-9 h-9 text-blue-400" />;
      return <Cloud className="w-9 h-9 text-slate-300" />;
  }
}

/**
 * Retorna classes de estilo de fundo gradiente dependendo da condição do clima
 */
function getConditionTheme(condition) {
  switch (condition) {
    case 'sunny':
      return 'from-amber-500/10 via-slate-800/80 to-slate-900 border-amber-500/30 hover:border-amber-400/60';
    case 'rain':
      return 'from-blue-600/10 via-slate-800/80 to-slate-900 border-blue-500/30 hover:border-blue-400/60';
    case 'storm':
      return 'from-purple-600/15 via-slate-800/80 to-slate-900 border-purple-500/30 hover:border-purple-400/60';
    case 'snow':
      return 'from-cyan-400/10 via-slate-800/80 to-slate-900 border-cyan-400/30 hover:border-cyan-300/60';
    default:
      return 'from-slate-800/80 via-slate-850/80 to-slate-900 border-slate-700/60 hover:border-cyan-400/50';
  }
}

/**
 * Converte Celsius para Fahrenheit se necessário
 */
function formatTemp(celsius, unit = 'C') {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
}

/**
 * Componente ItemCard
 * Representa um card individual com o resumo meteorológico de uma cidade.
 *
 * @param {Object} props
 * @param {Object} props.item - Dados do clima da cidade
 * @param {boolean} props.isSelected - Se este card está atualmente selecionado
 * @param {Function} props.onSelect - Callback ao clicar no card para selecionar
 * @param {boolean} props.isFavorite - Se a cidade está nos favoritos
 * @param {Function} props.onToggleFavorite - Callback ao clicar na estrela de favorito
 * @param {"C"|"F"} [props.unit="C"] - Unidade de medida de temperatura
 */
export default function ItemCard({
  item,
  isSelected = false,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  unit = 'C'
}) {
  if (!item) return null;

  const {
    city,
    state,
    country,
    temp,
    tempMin,
    tempMax,
    humidity,
    windSpeed,
    condition,
    description,
    icon
  } = item;

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita disparar onSelect do card
    if (onToggleFavorite) {
      onToggleFavorite(item);
    }
  };

  const themeClass = getConditionTheme(condition);

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect && onSelect(item);
        }
      }}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b ${themeClass} backdrop-blur-md border transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer text-left ${
        isSelected
          ? 'ring-2 ring-cyan-400 border-cyan-400 shadow-cyan-400/20'
          : ''
      }`}
    >
      {/* Topo do Card: Localização & Botão Favorito */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="truncate">
            <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors truncate">
              {city}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {state ? `${state}, ` : ''}{country}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remover ${city} dos favoritos` : `Adicionar ${city} aos favoritos`}
          title={isFavorite ? 'Remover dos favoritos' : 'Favoritar cidade'}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700/50 transition-all cursor-pointer"
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-400 group-hover:text-amber-400'
            }`}
          />
        </button>
      </div>

      {/* Meio do Card: Ícone e Temperatura Principal */}
      <div className="my-4 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {formatTemp(temp, unit)}
            </span>
            <span className="text-xl font-medium text-cyan-400">°{unit}</span>
          </div>
          <p className="text-xs capitalize text-slate-300 mt-1 font-medium">
            {description}
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-800/50 border border-slate-700/40 shadow-inner">
          {getWeatherIcon(icon, condition)}
        </div>
      </div>

      {/* Estatísticas Secundárias: Min/Max, Umidade, Vento */}
      <div className="pt-3 border-t border-slate-700/40 grid grid-cols-3 gap-2 text-center text-xs">
        {/* Min / Max */}
        <div className="bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/30">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
            <ArrowDown className="w-2.5 h-2.5 text-blue-400" />
            <span>Min</span>
          </div>
          <span className="font-semibold text-slate-200">
            {formatTemp(tempMin, unit)}°
          </span>
        </div>

        <div className="bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/30">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
            <ArrowUp className="w-2.5 h-2.5 text-rose-400" />
            <span>Max</span>
          </div>
          <span className="font-semibold text-slate-200">
            {formatTemp(tempMax, unit)}°
          </span>
        </div>

        {/* Umidade */}
        <div className="bg-slate-800/40 p-1.5 rounded-lg border border-slate-700/30">
          <div className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
            <Droplets className="w-2.5 h-2.5 text-cyan-400" />
            <span>Umidade</span>
          </div>
          <span className="font-semibold text-slate-200">{humidity}%</span>
        </div>
      </div>

      {/* Rodapé com Ação de Ver Detalhes */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300 pt-1 transition-colors">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Wind className="w-3 h-3 text-slate-400" />
          {windSpeed} km/h
        </span>
        <span className="inline-flex items-center font-medium gap-0.5">
          Detalhes <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
}
