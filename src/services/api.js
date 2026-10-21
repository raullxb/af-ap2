const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (signal, filters) => {
  const { search, category, genre, year } = filters;
  let url = '';

  if (search.trim() !== '') {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(search)}`;
  } else if (genre || year) {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc`;
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
  } else {
    url = `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=pt-BR`;
  }

  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao conectar com o catálogo.`);
  }
  
  const json = await response.json();
  return json.results; 
};