import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Sincroniza um estado do React com o localStorage do navegador.
 *
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial se não houver dados salvos
 * @returns {[any, Function]} - Retorna o estado atual e a função de atualização
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler chave "${key}" do localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Erro ao salvar chave "${key}" no localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
