'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import Search from '@/components/navbar/Search';

export default function SearchPage() {
  // États pour gérer les résultats de recherche, le chargement, les erreurs et le total des résultats
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Hook pour accéder aux paramètres de recherche de l'URL
  const searchParams = useSearchParams();

  // Effet pour effectuer la recherche chaque fois que les paramètres de recherche changent
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construire la requête à partir des paramètres de recherche
        const query = searchParams.toString();
        const response = await fetch(`/api/search?${query}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des résultats');
        }
        
        const data = await response.json();
        
        // Mettre à jour les états avec les résultats
        setResults(Array.isArray(data.results) ? data.results : []);
        setTotalResults(data.total || 0);
      } catch (err) {
        console.error('Erreur de recherche:', err);
        setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <Search />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Résultats de recherche</h1>
        
        {/* Filtres de recherche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SearchFilters />
        </div>

        {/* Affichage conditionnel basé sur l'état de chargement et les erreurs */}
        {loading ? (
          // Indicateur de chargement
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          // Message d'erreur
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          // Affichage des résultats
          <>
            <p className="text-lg text-gray-600 mb-4">Total des résultats : <span className="font-semibold">{totalResults}</span></p>
            <SearchResults results={results} />
          </>
        )}
      </div>
    </div>
  );
}