import { useState, useCallback } from 'react';

interface GetDataResponse<T> {
  data: T;
}


const useGetData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null); 

  // Fonction pour obtenir les données
  const getData = useCallback(async <T>(
    linstings: string,
    callback?: (data: GetDataResponse<T>) => void // Callback optionnel
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/${linstings}`);

      // Vérifiez si la réponse est OK
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const jsonData: GetDataResponse<T> = await response.json(); // Récupérer les données JSON
      setData(jsonData);
      
      if (callback) {
        callback(jsonData); // Appel du callback avec les données si défini
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []); // Dépendances vides pour que la fonction ne soit pas recréée à chaque rendu

  const resetError = () => {
    setError(null); 
  };

  return { getData, isLoading, error, data, resetError };
};

export default useGetData;

