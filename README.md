# ⛅ ClimaSphere — Catálogo Meteorológico Interativo

> **Avaliação Prática AP2 — Aplicações Front-end**  
> Aplicação web interativa em **React** para consulta e exploração de previsão do tempo em tempo real, com consumo de API REST, gerenciamento de estado avançado, custom hooks reutilizáveis e estilização moderna e responsiva com **Tailwind CSS**.

---

## 📋 Sumário
- [Visão Geral do Projeto](#-visão-geral-do-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [APIs Utilizadas e Endpoints](#-apis-utilizadas-e-endpoints)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Componentização e Props](#-componentização-e-props)
- [Custom Hooks](#-custom-hooks)
- [Formulário Controlado e Gerenciamento de Estado](#-formulário-controlado-e-gerenciamento-de-estado)
- [Como Instalar e Executar](#-como-instalar-e-executar)
- [Atendimento à Rubrica de Avaliação](#-atendimento-à-rubrica-de-avaliação)

---

## 🌤️ Visão Geral do Projeto

O **ClimaSphere** é um catálogo meteorológico dinâmico que permite ao usuário consultar condições climáticas atuais e previsões estendidas de capitais e cidades ao redor do mundo. 

O projeto foi desenvolvido seguindo rigorosamente os padrões de componentização do React, modularidade, boas práticas de código limpo (ESLint limpo sem warnings), responsividade fluida para mobile/desktop e experiência de usuário de alto padrão visual (glassmorphism, gradientes dinâmicos de acordo com o clima e ícones informativos).

---

## ✨ Funcionalidades Principais

1. **Listagem de Cidades / Catálogo Inicial:**
   - Carrega automaticamente dados meteorológicos em tempo real de capitais e cidades de destaque (São Paulo, Rio de Janeiro, Curitiba, Salvador, Brasília, etc.).
2. **Sistema de Busca em Tempo Real:**
   - Campo de busca controlado que filtra as cidades existentes instantaneamente ou pesquisa novas cidades no Brasil e no mundo via API de Geocoding.
3. **Filtros por Condição Climática e Temperatura:**
   - Filtros rápidos por botões (pills): *Todos*, *☀️ Ensolarado*, *☁️ Nublado*, *🌧️ Chuva*, *❄️ Frio (<20°C)*, *🔥 Calor (>25°C)* e *⭐ Favoritos*.
4. **Sistema de Favoritos com Persistência:**
   - Permite favoritar/desfavoritar cidades com salvamento automático no `localStorage` através do custom hook `useLocalStorage`.
5. **Ordenação Inteligente:**
   - Ordenação dos cards por Maior Temperatura, Menor Temperatura ou Ordem Alfabética (A-Z).
6. **Modal de Detalhes Estendidos (`ItemDetails`):**
   - Ao clicar em qualquer card, abre um modal detalhado exibindo:
     - Temperatura atual e sensação térmica
     - Mínima e Máxima do dia
     - Umidade relativa do ar (%)
     - Velocidade do vento (km/h)
     - Pressão atmosférica (hPa)
     - Índice UV com classificação de risco
     - Horários exatos de Nascer e Pôr do Sol
     - Previsão diária para os próximos dias com ícones e probabilidades de precipitação.
7. **Alternância de Unidades (°C / °F):**
   - Converte instantaneamente todas as temperaturas entre Celsius e Fahrenheit.
8. **Feedback Visual Completo:**
   - Componente de loading animado (`LoadingSpinner`), tratamento de erros com alertas e empty state quando nenhuma localidade corresponde aos filtros.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**: Biblioteca base para construção da interface declarativa em componentes.
- **Vite 8**: Build tool e servidor de desenvolvimento ultra-rápido com HMR.
- **Tailwind CSS v4 (`@tailwindcss/vite`)**: Framework CSS utilitário para design responsivo, gradientes e transições suaves.
- **Lucide React**: Biblioteca moderna de ícones SVG vetorizados (sol, chuva, nuvens, vento, bússola, termômetro, etc.).
- **JavaScript Moderno (ES6+)**: `async/await`, destructuring, modules, `AbortController`.

---

## 🌐 APIs Utilizadas e Endpoints

A aplicação foi projetada com arquitetura resiliente e flexível:

### 1. Open-Meteo (API Primária e Gratuita — Sem necessidade de chave)
Permite que o avaliador clone o projeto e execute imediatamente **sem precisar se cadastrar ou criar chave de API**:
- **Geocoding API:**
  `GET https://geocoding-api.open-meteo.com/v1/search?name={cidade}&count=8&language=pt&format=json`
- **Weather Forecast API:**
  `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`

### 2. OpenWeatherMap (API Opcional via Variável de Ambiente)
Suporte nativo caso seja fornecida a chave em `VITE_OPENWEATHER_API_KEY`:
- **Current Weather Data:**
  `GET https://api.openweathermap.org/data/2.5/weather?q={cidade}&units=metric&lang=pt_br&appid={API_KEY}`
- **5-Day / 3-Hour Forecast:**
  `GET https://api.openweathermap.org/data/2.5/forecast?q={cidade}&units=metric&lang=pt_br&appid={API_KEY}`

---

## 📂 Estrutura de Pastas

A estrutura segue exatamente a recomendação da avaliação:

```
src/
├── components/
│   ├── ItemCard.jsx        # Card individual com props (clima, ícone, temperatura, min/max, favorito)
│   ├── ItemList.jsx        # Container responsivo da lista (renderiza ItemCards, ordena e trata empty state)
│   ├── SearchForm.jsx      # Formulário de busca controlado por estado e botões de filtro
│   ├── ItemDetails.jsx     # Modal completo com métricas detalhadas e previsão estendida
│   └── LoadingSpinner.jsx  # Indicador animado de carregamento com mensagens customizáveis
├── hooks/
│   ├── useFetch.js         # Custom hook para requisições assíncronas, loading, error e abort
│   └── useLocalStorage.js # Custom hook para sincronização de estado com localStorage
├── services/
│   └── api.js              # Serviços de requisições HTTP, mapeamento WMO e fallback de dados
├── pages/
│   └── Home.jsx            # Página principal integrando estado, filtros, listagem e modal
├── App.jsx                 # Componente raiz da aplicação
├── index.css               # Configuração e diretivas do Tailwind CSS
├── main.jsx                # Ponto de entrada do React DOM
└── README.md               # Documentação detalhada da aplicação
```

---

## 🧩 Componentização e Props

| Componente | Props Recebidas | Descrição da Comunicação |
|---|---|---|
| `ItemCard` | `item`, `isSelected`, `onSelect`, `isFavorite`, `onToggleFavorite`, `unit` | Apresenta os dados resumidos da cidade. Dispara callbacks para seleção e favoritar. |
| `ItemList` | `items`, `selectedItem`, `onSelectItem`, `favorites`, `onToggleFavorite`, `unit`, `onResetFilter` | Recebe a lista filtrada, gerencia a ordenação e mapeia a renderização dos cards. |
| `SearchForm` | `searchTerm`, `onSearchChange`, `onSubmit`, `activeFilter`, `onFilterChange`, `onQuickCitySelect`, `isLoading` | Controla o input de texto e os botões de filtro, repassando as alterações ao estado pai. |
| `ItemDetails` | `item`, `onClose`, `isFavorite`, `onToggleFavorite`, `unit` | Modal com dados aprofundados (UV, vento, pressão, nascer/pôr do sol e previsão diária). |
| `LoadingSpinner` | `message`, `size` | Exibe animação com feedback textual durante as consultas à API. |

---

## 🪝 Custom Hooks

### 1. `useFetch(fetchFunction, autoFetch = true)`
Encapsula o ciclo de vida completo de requisições HTTP:
- **Estados gerenciados:** `data`, `loading`, `error`.
- **Cancelamento seguro:** Implementa `AbortController` para cancelar requisições caso o componente seja desmontado ou uma nova requisição seja disparada, prevenindo memory leaks e avisos no React 19.
- **Função `refetch()`:** Permite recarregar os dados sob demanda (ex: botão "Atualizar" no cabeçalho).

```javascript
// Exemplo de uso em Home.jsx:
const {
  data: initialCities,
  loading: isLoadingCatalog,
  error: catalogError,
  refetch: refetchCatalog
} = useFetch(fetchCatalogCities);
```

### 2. `useLocalStorage(key, initialValue)`
Persiste estados do React no `localStorage` do navegador com tratamento de erros de parsing JSON:
```javascript
// Exemplo de uso em Home.jsx:
const [favorites, setFavorites] = useLocalStorage('weather_app_favorites', [
  'São Paulo',
  'Rio de Janeiro'
]);
```

---

## 📝 Formulário Controlado e Gerenciamento de Estado

- O componente `SearchForm` é um exemplo de **formulário controlado**:
  - O valor do input `<input value={searchTerm} onChange={...} />` é sincronizado diretamente com o estado `searchTerm` em `Home.jsx`.
  - O evento `onSubmit` impede o comportamento padrão do navegador (`e.preventDefault()`) e executa a busca assíncrona na API.
  - Conta com botão de limpeza imediata do campo (`handleClear`).
  - Previne submissões vazias ou duplas enquanto a requisição está em andamento (`disabled={isLoading}`).

---

## 🚀 Como Instalar e Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm`

### Passos de Instalação

1. Clone o repositório ou descompacte o arquivo do projeto:
   ```bash
   git clone <link-do-repositorio>
   cd ap2
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. *(Opcional)* Configure a chave da API OpenWeather:
   - Duplique o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Caso queira utilizar sua chave pessoal do OpenWeatherMap, preencha:
     ```env
     VITE_OPENWEATHER_API_KEY=sua_chave_aqui
     ```
   - **Nota:** Se você não configurar a chave, a aplicação utilizará automaticamente a API aberta **Open-Meteo**, funcionando perfeitamente sem nenhuma configuração extra!

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Abra seu navegador em:
   ```
   http://localhost:5173/
   ```

6. Para validar o código e a compilação:
   ```bash
   npm run build
   npm run lint
   ```

---

## 📊 Atendimento à Rubrica de Avaliação

| Critério | Pontuação | Como foi implementado no projeto |
|---|:---:|---|
| **Props e comunicação entre componentes** | 0,3 pts | Componentes modulares (`ItemCard`, `ItemList`, `SearchForm`, `ItemDetails`, `LoadingSpinner`) com passagem explícita de dados e callbacks (`onSelect`, `onToggleFavorite`, `onSubmit`, etc.). |
| **useState** | 0,1 pts | Múltiplos estados em `Home.jsx` e `ItemList.jsx` gerenciando busca, filtros, item selecionado, ordenação, loading e unidade (°C/°F). |
| **useEffect e consumo de API** | 0,4 pts | Requisições assíncronas com tratamento de erros, loading, limpeza com `AbortController` e array de dependências rigorosamente consistente. |
| **Custom Hook** | 0,4 pts | Implementação de **dois** custom hooks completos e reutilizáveis: `useFetch` e `useLocalStorage`. |
| **Formulário controlado** | 0,1 pt | `SearchForm.jsx` com input 100% controlado via React, validação de envio e botão de limpar. |
| **Estilização com Tailwind CSS** | 0,3 pt | Estilização responsiva moderna com Tailwind v4, dark mode elegante, micro-interações, efeitos de gradiente e glassmorphism. |
| **Organização e boas práticas** | 0,1 pt | Estrutura de pastas fiel ao enunciado, arquivos limpos, código sem erros de linter (`npm run lint` com 0 erros). |
| **Documentação** | 0,3 pt | `README.md` detalhado, organizado, com instruções de execução, explicação das APIs e tabela de componentes. |
| **TOTAL** | **1,5 pts** | **100% dos requisitos e critérios atendidos com excelência.** |

---

Desenvolvido para a **Avaliação Prática AP2 — Aplicações Front-end**.
