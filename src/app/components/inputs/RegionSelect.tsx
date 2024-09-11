'use client';

import React from 'react';
import Select from 'react-select';
import useCountryData from '../../hooks/useCountryData';


export type RegionSelectValue = {
    label: string;
    value: string;
}

interface RegionSelectProps {
    value: RegionSelectValue | null;
    onChange: (value: RegionSelectValue | null) => void;
}

const RegionSelect: React.FC<RegionSelectProps> = ({
    value,
    onChange
}) => {
    const { regions } = useCountryData();

    const options = regions.map(region => ({
        value: region.code,
        label: region.name
    }));

    return (
        <div>
            <Select
                placeholder="Sélectionnez une région"
                isClearable
                options={options}
                value={value}
                onChange={(newValue) => onChange(newValue)}
                formatOptionLabel={(option: RegionSelectValue) => (
                    <div className="flex flex-row items-center gap-3">
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

export default RegionSelect;