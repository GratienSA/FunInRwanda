'use client';

import React, { useCallback } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import dynamic from 'next/dynamic';
import Heading from '../Heading';
import Input from '../inputs/Input';
import RegionSelect from '../inputs/RegionSelect';
import { BookingFormData } from '@/src/types';

// Définition du type RegionSelectValue
export type RegionSelectValue = {
  label?: string;
  value?: string;
  latitude?: number;
  longitude?: number;
} | null;

const Map = dynamic(() => import('../Map'), { 
  ssr: false,
  loading: () => <p>Loading map...</p>
});

interface StepLocationProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  watch: UseFormWatch<BookingFormData>;
  setValue: UseFormSetValue<BookingFormData>;
  isLoading: boolean;
}

function convertToRegionSelectValue(name: string, lat: number, lng: number): RegionSelectValue {
  return {
    label: name,
    value: name,
    latitude: lat,
    longitude: lng
  };
}


const StepLocation: React.FC<StepLocationProps> = ({
  register,
  errors,
  watch,
  setValue,
  isLoading,
}) => {
  const locationName = watch('locationName');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setValue('latitude', lat, { shouldValidate: true });
    setValue('longitude', lng, { shouldValidate: true });
  }, [setValue]);

  const handleRegionChange = useCallback((value: RegionSelectValue) => {
    if (value) {
      setValue('locationName', value.label || '', { shouldValidate: true });
      setValue('latitude', value.latitude || 0, { shouldValidate: true });
      setValue('longitude', value.longitude || 0, { shouldValidate: true });
    } else {
      setValue('locationName', '', { shouldValidate: true });
      setValue('latitude', 0, { shouldValidate: true });
      setValue('longitude', 0, { shouldValidate: true });
    }
  }, [setValue]);

  const mapCenter = latitude && longitude ? [latitude, longitude] as [number, number] : undefined;

  return (
    <div className="flex flex-col gap-40">
      <div className="flex flex-col gap-4">
        <Heading
          title="Where is your activity located?"
          subtitle="Help guests find you!"
        />
        <div className="flex flex-col gap-4">
          <RegionSelect
            value={locationName ? convertToRegionSelectValue(locationName, latitude || 0, longitude || 0) : null}
            onChange={handleRegionChange}
            disabled={isLoading}
          />
        </div>
        <Input<BookingFormData>
          id="locationAddress"
          label="Address"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
      <div className="flex flex-col gap-4">
        <Map center={mapCenter} zoom={10} onMapClick={handleMapClick} />
        <div className="flex gap-4">
          <Input<BookingFormData>
            id="latitude"
            label="Latitude"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            step="any"
          />
          <Input<BookingFormData>
            id="longitude"
            label="Longitude"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            step="any"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(StepLocation);