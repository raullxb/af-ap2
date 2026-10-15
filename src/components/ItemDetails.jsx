import {
  X,
  MapPin,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Gauge,
  ShieldAlert,
  Calendar,
  CloudRain,
  Cloud,
  CloudSun,
  CloudDrizzle,
  CloudLightning,
  Snowflake
} from 'lucide-react';

/**
 * Retorna o ícone meteorológico correspondente
 */
function getForecastIcon(iconName) {
  switch (iconName) {
    case 'Sun':
      return <Sun className="w-6 h-6 text-amber-400" />;
    case 'CloudSun':
      return <CloudSun className="w-6 h-6 text-amber-300" />;
    case 'Cloud':
      return <Cloud className="w-6 h-6 text-slate-300" />;
    case 'CloudDrizzle':
      return <CloudDrizzle className="w-6 h-6 text-cyan-300" />;
    case 'CloudRain':
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    case 'CloudLightning':
      return <CloudLightning className="w-6 h-6 text-purple-400" />;
    case 'Snowflake':
      return <Snowflake className="w-6 h-6 text-cyan-200" />;
    default:
      return <Sun className="w-6 h-6 text-amber-400" />;
  }
}

/**
 * Converte temperatura conforme unidade
 */
function formatTemp(celsius, unit = 'C') {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
}

/**
 * Classificação textual do índice UV
 */
function getUvRating(uv) {
  if (uv <= 2) return { text: 'Baixo', color: 'text-emerald-400' };
  if (uv <= 5) return { text: 'Moderado', color: 'text-amber-400' };
  if (uv <= 7) return { text: 'Alto', color: 'text-orange-400' };
  if (uv <= 10) return { text: 'Muito Alto', color: 'text-rose-400' };
  return { text: 'Extremo', color: 'text-purple-400' };
}

/**
 * Componente ItemDetails
 * Modal interativo apresentando dados detalhados da cidade selecionada e previsão estendida.
 *
 * @param {Object} props
 * @param {Object} props.item - Dados detalhados do clima
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {boolean} props.isFavorite - Indica se a cidade está nos favoritos
 * @param {Function} props.onToggleFavorite - Callback para favoritar
 * @param {"C"|"F"} [props.unit="C"] - Unidade de temperatura
 */
export default function ItemDetails({
  item,
  onClose,
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
    feelsLike,
    humidity,
    windSpeed,
    pressure,
    uvIndex,
    description,
    sunrise,
    sunset,
    forecast = [],
    source
  } = item;

  const uvRating = getUvRating(uvIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-city-title"
      >
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-city-title" className="text-2xl font-bold text-white flex items-center gap-2">
                {city}
                <button
                  type="button"
                  onClick={() => onToggleFavorite && onToggleFavorite(item)}
                  title={isFavorite ? 'Remover dos favoritos' : 'Favoritar cidade'}
                  className="p-1 rounded-lg hover:bg-slate-700/60 transition-colors cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-400'
                    }`}
                  />
                </button>
              </h2>
              <p className="text-xs text-slate-400">
                {state ? `${state}, ` : ''}{country} • Fonte: <span className="text-cyan-400">{source}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal de detalhes"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bloco Central: Temperatura e Condição */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800/40 rounded-2xl p-5 my-5 border border-slate-700/40">
          <div className="text-center md:text-left">
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-6xl font-black text-white">{formatTemp(temp, unit)}</span>
              <span className="text-3xl font-semibold text-cyan-400">°{unit}</span>
            </div>
            <p className="text-base text-slate-200 capitalize font-medium mt-1">{description}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Sensação térmica de <span className="font-semibold text-slate-300">{formatTemp(feelsLike, unit)}°{unit}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-center bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Mínima</span>
              <span className="text-lg font-bold text-blue-400">{formatTemp(tempMin, unit)}°</span>
            </div>
            <div className="text-center bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">Máxima</span>
              <span className="text-lg font-bold text-rose-400">{formatTemp(tempMax, unit)}°</span>
            </div>
          </div>
        </div>

        {/* Métricas Atmosféricas Detalhadas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {/* Umidade */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Umidade</span>
            </div>
            <span className="text-lg font-bold text-white">{humidity}%</span>
          </div>

          {/* Vento */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Vento</span>
            </div>
            <span className="text-lg font-bold text-white">{windSpeed} km/h</span>
          </div>

          {/* Pressão */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pressão</span>
            </div>
            <span className="text-lg font-bold text-white">{pressure} hPa</span>
          </div>

          {/* Índice UV */}
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Índice UV</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">{uvIndex}</span>
              <span className={`text-[11px] font-semibold ${uvRating.color}`}>({uvRating.text})</span>
            </div>
          </div>
        </div>

        {/* Nascer e Pôr do Sol */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Nascer do Sol</span>
              <span className="text-sm font-bold text-slate-200">{sunrise}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Pôr do Sol</span>
              <span className="text-sm font-bold text-slate-200">{sunset}</span>
            </div>
          </div>
        </div>

        {/* Previsão para os Próximos Dias */}
        {forecast && forecast.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700/60">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-300">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Previsão Estendida</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {forecast.map((day, idx) => (
                <div
                  key={`${day.date}-${idx}`}
                  className="flex flex-col items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/50 text-center"
                >
                  <span className="text-xs font-semibold text-slate-300 uppercase">{day.dayOfWeek}</span>
                  <div className="my-2">{getForecastIcon(day.icon)}</div>
                  <div className="text-xs font-bold text-slate-200">
                    <span className="text-rose-400">{formatTemp(day.tempMax, unit)}°</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-blue-400">{formatTemp(day.tempMin, unit)}°</span>
                  </div>
                  {day.precipitationProb > 0 && (
                    <span className="text-[10px] text-cyan-300 flex items-center gap-0.5 mt-1 font-medium">
                      <CloudRain className="w-2.5 h-2.5" /> {day.precipitationProb}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão de Fechar no Rodapé */}
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-md"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
