import { useState, useEffect, useCallback } from 'react';
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
  latitude: number;
  longitude: number;
}
const RWANDA_CODE = 'RWA';

const RWANDA_REGIONS: RegionData[] = [
  { name: 'Kigali', code: 'KV', latitude: -1.9441, longitude: 30.0619 },
  { name: 'Eastern Province', code: 'EP', latitude: -1.9474, longitude: 30.4742 },
  { name: 'Northern Province', code: 'NP', latitude: -1.4823, longitude: 29.8309 },
  { name: 'Southern Province', code: 'SP', latitude: -2.3373, longitude: 29.7394 },
  { name: 'Western Province', code: 'WP', latitude: -2.1734, longitude: 29.3189 },
];

const useCountryData = (countryCode: string = RWANDA_CODE) => {
  const [country, setCountry] = useState<CountryData | null>(null);
  const [regions, setRegions] = useState<RegionData[]>([]);

  const getCountryData = useCallback((code: string): CountryData | null => {
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

  useEffect(() => {
    const selectedCountry = getCountryData(countryCode);
    
    if (selectedCountry) {
      setCountry(selectedCountry);
      setRegions(countryCode === RWANDA_CODE ? RWANDA_REGIONS : []);
    } else {
      setCountry(null);
      setRegions([]);
    }
  }, [countryCode, getCountryData]);

  const getByValue = useCallback((code: string) => getCountryData(code), [getCountryData]);

  return { country, regions, getByValue };
};

export default useCountryData;