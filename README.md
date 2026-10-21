CineCatálogo - AP2 React

Catálogo interativo de filmes desenvolvido para a Avaliação Prática AP2.

Descrição do Projeto

Aplicação web interativa que consome a API do TMDB (The Movie Database). O usuário pode visualizar os filmes mais populares, filtrar por ano de lançamento e gênero, buscar por títulos específicos e salvar filmes favoritos (com persistência local).

Tecnologias Utilizadas

React 19

Vite

Tailwind CSS 4

Lucide React

Custom Hooks (useFetch e useLocalStorage)

Instruções de Instalação e Execução

Extraia o arquivo compactado ou clone o repositório.

Acesse a pasta do projeto no terminal.

Instale as dependências:

npm install


Crie um arquivo .env na raiz do projeto e insira a chave da API:

VITE_TMDB_API_KEY=sua_chave_da_api


Execute a aplicação:

npm run dev


API Utilizada

The Movie Database (TMDB) API

Endpoints:

Categorias: https://api.themoviedb.org/3/movie/{category}

Busca: https://api.themoviedb.org/3/search/movie

Filtros Avançados: https://api.themoviedb.org/3/discover/movie# af-ap2
