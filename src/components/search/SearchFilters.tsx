'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FaGift, FaBirthdayCake, FaGlassCheers, FaBuilding } from 'react-icons/fa';
import { GiPartyPopper } from 'react-icons/gi';
import CategoryBox from "../CategoryBox";
import Container from "../Container";

interface Filters {
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

export const categories = [
    {
        label: 'Leisure',
        icon: GiPartyPopper,
        description: "Fun activities for everyone"
    },
    {
        label: 'Gifts',
        icon: FaGift,
        description: "Perfect gift ideas"
    },
    {
        label: 'Child birthday',
        icon: FaBirthdayCake,
        description: "Celebrations and activities for kids"
    },
    {
        label: 'Bachelor/Bachelorette',
        icon: FaGlassCheers,
        description: "Celebrate adventures and fun activities with friends."
    },
    {
        label: 'Corporate',
        icon: FaBuilding,
        description: "Corporate events and team building"
    }
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filters, setFilters] = useState<Filters>({
    q: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const isMainPage = pathname === '/';

  useEffect(() => {
    setFilters({
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
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

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="search-filters py-4 md:py-8">
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.q}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          className="mb-2 p-2 border rounded"
        />
        <nav aria-label="Category navigation">
          <ul className="flex flex-row items-center justify-start md:justify-between overflow-x-auto space-x-4 md:space-x-8">
            {categories.map((item) => (
              <li key={item.label}>
                <CategoryBox
                  label={item.label}
                  selected={filters.category === item.label}
                  icon={item.icon}
                  description={item.description}
                  onClick={() => handleFilterChange('category', item.label)}
                />
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 flex space-x-2">
          <input 
            type="number" 
            placeholder="Prix min" 
            value={filters.minPrice} 
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="p-2 border rounded"
          />
          <input 
            type="number" 
            placeholder="Prix max" 
            value={filters.maxPrice} 
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <button 
          onClick={applyFilters}
          className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Appliquer les filtres
        </button>
      </div>
    </Container>
  );
}