/**
 * @file api.js
 * @description Módulo de serviços para integração com APIs de Clima/Meteorologia.
 * Suporta OpenWeatherMap (com chave em VITE_OPENWEATHER_API_KEY) e
 * fallback automático para Open-Meteo (API aberta e gratuita, sem necessidade de chave).
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Lista de cidades padrão para exibição inicial no catálogo
export const DEFAULT_CITIES = [
  { name: 'São Paulo', state: 'SP', country: 'BR', lat: -23.5505, lon: -46.6333 },
  { name: 'Rio de Janeiro', state: 'RJ', country: 'BR', lat: -22.9068, lon: -43.1729 },
  { name: 'Brasília', state: 'DF', country: 'BR', lat: -15.7939, lon: -47.8828 },
  { name: 'Curitiba', state: 'PR', country: 'BR', lat: -25.4284, lon: -49.2733 },
  { name: 'Salvador', state: 'BA', country: 'BR', lat: -12.9714, lon: -38.5014 },
  { name: 'Belo Horizonte', state: 'MG', country: 'BR', lat: -19.9217, lon: -43.9345 },
  { name: 'Florianópolis', state: 'SC', country: 'BR', lat: -27.5954, lon: -48.5480 },
  { name: 'Fortaleza', state: 'CE', country: 'BR', lat: -3.7319, lon: -38.5267 },
  { name: 'Porto Alegre', state: 'RS', country: 'BR', lat: -30.0346, lon: -51.2177 },
  { name: 'Manaus', state: 'AM', country: 'BR', lat: -3.1190, lon: -60.0217 }
];

/**
 * Mapeamento de códigos meteorológicos WMO (Open-Meteo) para descrições e categorias amigáveis
 */
export function interpretWmoCode(code) {
  const map = {
    0: { description: 'Céu limpo', condition: 'sunny', icon: 'Sun' },
    1: { description: 'Principalmente limpo', condition: 'sunny', icon: 'Sun' },
    2: { description: 'Parcialmente nublado', condition: 'partly-cloudy', icon: 'CloudSun' },
    3: { description: 'Encoberto', condition: 'cloudy', icon: 'Cloud' },
    45: { description: 'Nevoeiro', condition: 'cloudy', icon: 'CloudFog' },
    48: { description: 'Nevoeiro com geada', condition: 'cloudy', icon: 'CloudFog' },
    51: { description: 'Garoa leve', condition: 'rain', icon: 'CloudDrizzle' },
    53: { description: 'Garoa moderada', condition: 'rain', icon: 'CloudDrizzle' },
    55: { description: 'Garoa densa', condition: 'rain', icon: 'CloudRain' },
    61: { description: 'Chuva fraca', condition: 'rain', icon: 'CloudRain' },
    63: { description: 'Chuva moderada', condition: 'rain', icon: 'CloudRain' },
    65: { description: 'Chuva forte', condition: 'rain', icon: 'CloudRain' },
    71: { description: 'Neve fraca', condition: 'snow', icon: 'Snowflake' },
    73: { description: 'Neve moderada', condition: 'snow', icon: 'Snowflake' },
    75: { description: 'Neve intensa', condition: 'snow', icon: 'Snowflake' },
    80: { description: 'Pancadas de chuva leves', condition: 'rain', icon: 'CloudDrizzle' },
    81: { description: 'Pancadas de chuva moderadas', condition: 'rain', icon: 'CloudRain' },
    82: { description: 'Pancadas de chuva violentas', condition: 'rain', icon: 'CloudLightning' },
    95: { description: 'Tempestade com trovões', condition: 'storm', icon: 'CloudLightning' },
    96: { description: 'Tempestade com granizo leve', condition: 'storm', icon: 'CloudLightning' },
    99: { description: 'Tempestade com granizo forte', condition: 'storm', icon: 'CloudLightning' }
  };

  return map[code] || { description: 'Tempo instável', condition: 'cloudy', icon: 'Cloud' };
}

/**
 * Converte data ISO em dia da semana abreviado (ex: "Seg", "Ter")
 */
function getWeekday(dateString) {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  } catch {
    return dateString;
  }
}

/**
 * Formata horário de ISO para HH:MM
 */
function formatTime(isoString) {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}

/**
 * Busca dados de clima de uma cidade via Open-Meteo (Totalmente livre de API key)
 */
export async function fetchWeatherFromOpenMeteo(cityInfo, signal) {
  const { name, state = '', country = 'BR', lat, lon } = cityInfo;

  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    timezone: 'auto'
  });

  const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error(`Erro ao obter clima para ${name} (${response.status})`);
  }

  const data = await response.json();
  const current = data.current || {};
  const daily = data.daily || {};
  const weatherInfo = interpretWmoCode(current.weather_code);

  const forecast = (daily.time || []).slice(0, 6).map((timeStr, idx) => {
    const code = daily.weather_code ? daily.weather_code[idx] : 0;
    const wInfo = interpretWmoCode(code);
    return {
      date: timeStr,
      dayOfWeek: idx === 0 ? 'Hoje' : getWeekday(timeStr),
      tempMin: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[idx] : 0),
      tempMax: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[idx] : 0),
      condition: wInfo.condition,
      description: wInfo.description,
      icon: wInfo.icon,
      precipitationProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[idx] : 0,
      uvIndex: daily.uv_index_max ? daily.uv_index_max[idx] : 0
    };
  });

  return {
    id: `${name}-${lat.toFixed(2)}-${lon.toFixed(2)}`,
    city: name,
    state: state,
    country: country,
    lat: lat,
    lon: lon,
    temp: Math.round(current.temperature_2m ?? 0),
    tempMin: forecast[0] ? forecast[0].tempMin : Math.round(current.temperature_2m ?? 0),
    tempMax: forecast[0] ? forecast[0].tempMax : Math.round(current.temperature_2m ?? 0),
    feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
    humidity: current.relative_humidity_2m ?? 0,
    windSpeed: Math.round(current.wind_speed_10m ?? 0),
    pressure: Math.round(current.surface_pressure ?? 1013),
    uvIndex: daily.uv_index_max && daily.uv_index_max[0] ? daily.uv_index_max[0] : 0,
    condition: weatherInfo.condition,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    isDay: current.is_day === 1,
    sunrise: daily.sunrise && daily.sunrise[0] ? formatTime(daily.sunrise[0]) : '--:--',
    sunset: daily.sunset && daily.sunset[0] ? formatTime(daily.sunset[0]) : '--:--',
    precipitation: current.precipitation ?? 0,
    forecast: forecast,
    source: 'Open-Meteo (API Aberta)'
  };
}

/**
 * Busca dados de clima via OpenWeatherMap (usado se VITE_OPENWEATHER_API_KEY existir)
 */
export async function fetchWeatherFromOpenWeather(cityName, signal) {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('Chave de API do OpenWeatherMap não configurada.');
  }

  // 1. Busca clima atual
  const weatherRes = await fetch(
    `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&units=metric&lang=pt_br&appid=${OPENWEATHER_API_KEY}`,
    { signal }
  );

  if (!weatherRes.ok) {
    throw new Error(`Cidade "${cityName}" não encontrada no OpenWeatherMap.`);
  }

  const weatherData = await weatherRes.json();

  // 2. Busca previsão de 5 dias
  let forecastList = [];
  try {
    const forecastRes = await fetch(
      `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&units=metric&lang=pt_br&appid=${OPENWEATHER_API_KEY}`,
      { signal }
    );
    if (forecastRes.ok) {
      const fData = await forecastRes.json();
      // Agrupa 1 leitura por dia por volta das 12h
      const dailyMap = {};
      (fData.list || []).forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0];
        if (!dailyMap[dateStr] || item.dt_txt.includes('12:00:00')) {
          dailyMap[dateStr] = item;
        }
      });

      forecastList = Object.entries(dailyMap).slice(0, 5).map(([dateStr, item], idx) => {
        const mainCond = (item.weather && item.weather[0] ? item.weather[0].main.toLowerCase() : '');
        let cond = 'cloudy';
        if (mainCond.includes('clear')) cond = 'sunny';
        else if (mainCond.includes('rain')) cond = 'rain';
        else if (mainCond.includes('thunderstorm')) cond = 'storm';
        else if (mainCond.includes('snow')) cond = 'snow';

        return {
          date: dateStr,
          dayOfWeek: idx === 0 ? 'Hoje' : getWeekday(dateStr),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          condition: cond,
          description: item.weather && item.weather[0] ? item.weather[0].description : '',
          icon: cond === 'sunny' ? 'Sun' : cond === 'rain' ? 'CloudRain' : 'Cloud',
          precipitationProb: item.pop ? Math.round(item.pop * 100) : 0,
          uvIndex: 5
        };
      });
    }
  } catch (err) {
    console.warn('Não foi possível obter previsão estendida do OpenWeather:', err);
  }

  const main = weatherData.main || {};
  const weather = (weatherData.weather && weatherData.weather[0]) || {};
  const wind = weatherData.wind || {};
  const sys = weatherData.sys || {};

  let cond = 'cloudy';
  const mainCond = (weather.main || '').toLowerCase();
  if (mainCond.includes('clear')) cond = 'sunny';
  else if (mainCond.includes('rain')) cond = 'rain';
  else if (mainCond.includes('thunderstorm')) cond = 'storm';
  else if (mainCond.includes('snow')) cond = 'snow';

  return {
    id: weatherData.id || `${weatherData.name}-${weatherData.coord?.lat}`,
    city: weatherData.name,
    state: '',
    country: sys.country || 'BR',
    lat: weatherData.coord?.lat,
    lon: weatherData.coord?.lon,
    temp: Math.round(main.temp ?? 0),
    tempMin: Math.round(main.temp_min ?? main.temp ?? 0),
    tempMax: Math.round(main.temp_max ?? main.temp ?? 0),
    feelsLike: Math.round(main.feels_like ?? main.temp ?? 0),
    humidity: main.humidity ?? 0,
    windSpeed: Math.round((wind.speed ?? 0) * 3.6), // m/s para km/h
    pressure: main.pressure ?? 1013,
    uvIndex: 6,
    condition: cond,
    description: weather.description || 'Sem descrição',
    icon: cond === 'sunny' ? 'Sun' : cond === 'rain' ? 'CloudRain' : 'Cloud',
    isDay: weather.icon ? weather.icon.includes('d') : true,
    sunrise: sys.sunrise ? new Date(sys.sunrise * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
    sunset: sys.sunset ? new Date(sys.sunset * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--',
    precipitation: 0,
    forecast: forecastList.length > 0 ? forecastList : [
      {
        date: new Date().toISOString().split('T')[0],
        dayOfWeek: 'Hoje',
        tempMin: Math.round(main.temp_min),
        tempMax: Math.round(main.temp_max),
        condition: cond,
        description: weather.description,
        icon: cond === 'sunny' ? 'Sun' : 'Cloud',
        precipitationProb: 10,
        uvIndex: 5
      }
    ],
    source: 'OpenWeatherMap'
  };
}

/**
 * Busca coordenadas e informações de cidades pelo nome (Geocoding)
 */
export async function searchCitiesGeocoding(cityName, signal) {
  if (!cityName || cityName.trim().length < 2) return [];

  const url = `${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(cityName.trim())}&count=8&language=pt&format=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Falha na busca de localidades.');

  const data = await res.json();
  if (!data.results || data.results.length === 0) return [];

  return data.results.map(item => ({
    name: item.name,
    state: item.admin1 || '',
    country: item.country_code || item.country || '',
    lat: item.latitude,
    lon: item.longitude
  }));
}

/**
 * Função unificada para carregar uma lista de cidades padrão
 */
export async function fetchCatalogCities(signal) {
  // Carrega previsão para cada cidade do catálogo padrão
  const promises = DEFAULT_CITIES.map(async city => {
    try {
      return await fetchWeatherFromOpenMeteo(city, signal);
    } catch (err) {
      console.error(`Erro ao carregar clima para ${city.name}:`, err);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

/**
 * Função inteligente de busca: tenta OpenWeatherMap se houver chave configurada,
 * senão usa Open-Meteo Geocoding + Previsão em tempo real.
 */
export async function searchCityWeather(query, signal) {
  if (!query || query.trim().length === 0) {
    throw new Error('Digite o nome de uma cidade para pesquisar.');
  }

  // Se houver chave do OpenWeatherMap configurada, tenta primeiro
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.trim() !== '') {
    try {
      return await fetchWeatherFromOpenWeather(query, signal);
    } catch (openWeatherErr) {
      console.warn('Falha no OpenWeatherMap, alternando para Open-Meteo:', openWeatherErr);
    }
  }

  // Fallback transparente e robusto para Open-Meteo
  const locations = await searchCitiesGeocoding(query, signal);
  if (locations.length === 0) {
    throw new Error(`Nenhuma cidade encontrada para "${query}". Verifique a ortografia.`);
  }

  // Pega a cidade mais relevante encontrada
  const bestMatch = locations[0];
  return await fetchWeatherFromOpenMeteo(bestMatch, signal);
}
