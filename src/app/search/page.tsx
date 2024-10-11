'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchFilters from '@/src/components/search/SearchFilters';
import SearchResults from '@/src/components/search/SearchResults';
import Search from '@/src/components/navbar/Search';


export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = searchParams.toString();
        const response = await fetch(`/api/search?${query}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des résultats');
        }
        const data = await response.json();
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
        <div className="mb-8">
          <Search />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Résultats de recherche</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <SearchFilters />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-600 mb-4">Total des résultats : <span className="font-semibold">{totalResults}</span></p>
            <SearchResults results={results} />
          </>
        )}
      </div>
    </div>
  );
}