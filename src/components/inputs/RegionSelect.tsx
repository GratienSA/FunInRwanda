"use client";

import React, { useCallback, useMemo } from 'react';
import Select from 'react-select';
import useCountryData from '../../hooks/useCountryData';
import { RegionSelectValue } from '@/src/types';

interface RegionOption {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
  isRegion: boolean;
}

interface RegionSelectProps {
  value: RegionSelectValue | null;
  onChange: (value: RegionSelectValue | null) => void;
  disabled?: boolean;
}

const RegionSelect: React.FC<RegionSelectProps> = ({
  value,
  onChange,
  disabled
}) => {
  const { regions } = useCountryData();

  const options: RegionOption[] = useMemo(() => {
    const regionOptions = regions.map(region => ({
      value: region.code,
      label: region.name,
      latitude: region.latitude,
      longitude: region.longitude,
      isRegion: true
    }));

    // Tri des options pour placer les régions en premier
    return regionOptions.sort((a, b) => {
      if (a.isRegion === b.isRegion) {
        return a.label.localeCompare(b.label);
      }
      return a.isRegion ? -1 : 1;
    });
  }, [regions]);

  const handleChange = useCallback((selectedOption: RegionOption | null) => {
    if (selectedOption) {
      onChange({
        value: selectedOption.value,
        label: selectedOption.label,
        latitude: selectedOption.latitude,
        longitude: selectedOption.longitude
      });
    } else {
      onChange(null);
    }
  }, [onChange]);

  const selectedOption = options.find(option => option.label === value?.label);

  return (
    <div>
      <Select<RegionOption>
        placeholder="Sélectionnez une région"
        isClearable
        options={options}
        value={selectedOption}
        onChange={handleChange}
        isDisabled={disabled}
        formatOptionLabel={(option: RegionOption) => (
          <div className="flex flex-row items-center gap-3">
            {option.isRegion && <span className="text-blue-500">🏠</span>}
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg'
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6'
          }
        })}
      />
    </div>
  );
}

export default React.memo(RegionSelect);