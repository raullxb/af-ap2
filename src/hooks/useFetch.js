import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook: useFetch
 * Executa requisições assíncronas com controle de estado (data, loading, error)
 * e suporte a cancelamento de requisições pendentes via AbortController.
 *
 * @param {Function} fetchFunction - Função assíncrona que recebe um AbortSignal e retorna os dados
 * @param {boolean} [autoFetch=true] - Se deve executar a requisição automaticamente ao montar
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: Function, setData: Function }}
 */
export function useFetch(fetchFunction, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0);

  const fetchFnRef = useRef(fetchFunction);
  useEffect(() => {
    fetchFnRef.current = fetchFunction;
  }, [fetchFunction]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!autoFetch && trigger === 0) return;

    let isMounted = true;
    const controller = new AbortController();

    fetchFnRef.current(controller.signal)
      .then((result) => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted && err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Erro na requisição.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [autoFetch, trigger]);

  return { data, loading, error, refetch, setData };
}

export default useFetch;
