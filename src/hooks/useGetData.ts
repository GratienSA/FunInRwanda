import { useState, useCallback } from 'react';

// Interface pour la structure de la réponse
interface GetDataResponse<T> {
  data: T;
}

// Définition du hook useGetData
const useGetData = () => {
  // État pour gérer le chargement
  const [isLoading, setIsLoading] = useState(false);
  // État pour gérer les erreurs
  const [error, setError] = useState<Error | null>(null);
  // État pour stocker les données récupérées
  const [data, setData] = useState<any>(null); 

  // Fonction pour obtenir les données
  const getData = useCallback(async <T>(
    linstings: string, // URL de l'API à appeler
    callback?: (data: GetDataResponse<T>) => void // Callback optionnel pour traiter les données
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Appel à l'API
      const response = await fetch(`/api/${linstings}`);

      // Vérification de la réponse
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Récupération et parsing des données JSON
      const jsonData: GetDataResponse<T> = await response.json();
      setData(jsonData);
      
      // Appel du callback avec les données si défini
      if (callback) {
        callback(jsonData);
      }
    } catch (err) {
      // Gestion des erreurs
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      // Fin du chargement
      setIsLoading(false);
    }
  }, []); // Dépendances vides pour que la fonction ne soit pas recréée à chaque rendu

  // Fonction pour réinitialiser l'erreur
  const resetError = () => {
    setError(null); 
  };

  // Retour des valeurs et fonctions du hook
  return { getData, isLoading, error, data, resetError };
};

export default useGetData;

// Ce hook utilise des états (useState) pour gérer le chargement, les erreurs et les données.
// La fonction getData est mémorisée avec useCallback pour éviter des re-rendus inutiles.
// getData est une fonction générique qui peut être utilisée pour différents types de données (<T>).
// La fonction gère les erreurs de réseau et de parsing JSON.
// Un callback optionnel permet de traiter les données immédiatement après leur récupération.
// La fonction resetError permet de réinitialiser l'état d'erreur.
// Le hook retourne un objet contenant la fonction getData, les états isLoading et error, les data récupérées, et la fonction resetError.