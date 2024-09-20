import { useState, useEffect, useMemo } from 'react';
import countries from 'world-countries';

interface CountryData {
  name: string;
  code: string;
  flag: string;
  region: string;
  latlng: [number, number];
  capital: string;
}

interface RegionData {
  name: string;
  code: string;
}

const RWANDA_CODE = 'RWA';

const useCountryData = (countryCode: string = RWANDA_CODE) => {
  const [country, setCountry] = useState<CountryData | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);

  useEffect(() => {
    const selectedCountry = countries.find(c => c.cca3 === countryCode);
    
    if (selectedCountry) {
      setCountry({
        name: selectedCountry.name.common,
        code: selectedCountry.cca3,
        flag: selectedCountry.flag,
        region: selectedCountry.region,
        latlng: selectedCountry.latlng,
        capital: selectedCountry.capital?.[0] || 'N/A',
      });

      if (countryCode === RWANDA_CODE) {
        setRegions([
          { name: 'Kigali', code: 'KV' },
          { name: 'Eastern Province', code: 'EP' },
          { name: 'Northern Province', code: 'NP' },
          { name: 'Southern Province', code: 'SP' },
          { name: 'Western Province', code: 'WP' },
        ]);
      } else {
        setRegions([]);
      }
    }
  }, [countryCode]);

  const getByValue = useMemo(() => (code: string) => {
    const foundCountry = countries.find(c => c.cca3 === code);
    return foundCountry ? {
      name: foundCountry.name.common,
      code: foundCountry.cca3,
      flag: foundCountry.flag,
      region: foundCountry.region,
      latlng: foundCountry.latlng,
      capital: foundCountry.capital?.[0] || 'N/A',
    } : null;
  }, []);

  return { country, regions, getByValue };
};

export default useCountryData;