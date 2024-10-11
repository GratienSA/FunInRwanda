'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    setFilters({
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'undefined') {
        params.set(key, value);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="search-filters">
      <input
        type="text"
        placeholder="Rechercher..."
        value={filters.q}
        onChange={(e) => handleFilterChange('q', e.target.value)}
      />
      <select 
        value={filters.category} 
        onChange={(e) => handleFilterChange('category', e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        <option value="Aventure">Aventure</option>
        <option value="Culture">Culture</option>
        <option value="Nature">Nature</option>
      </select>
      <input 
        type="number" 
        placeholder="Prix min" 
        value={filters.minPrice} 
        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
      />
      <input 
        type="number" 
        placeholder="Prix max" 
        value={filters.maxPrice} 
        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
      />
      <button onClick={applyFilters}>Appliquer les filtres</button>
    </div>
  );
}