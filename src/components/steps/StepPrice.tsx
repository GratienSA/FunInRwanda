'use client';

import React, { useEffect } from 'react';
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import Input from "../inputs/Input";
import Heading from "../Heading";
import { BookingFormData } from '@/types';

interface StepPriceProps {
  register: UseFormRegister<BookingFormData>;
  watch: UseFormWatch<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  isLoading: boolean;
  setCustomValue: (id: keyof BookingFormData, value: any) => void;
}

const StepPrice: React.FC<StepPriceProps> = ({ 
  register, 
  watch, 
  errors, 
  isLoading,
  setCustomValue
}) => {
  const price = watch('price');

  useEffect(() => {
    if (price !== undefined) {
      setCustomValue('price', parseFloat(price.toString()));
    }
  }, [price, setCustomValue]);

  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Now, set your price"
        subtitle="How much do you charge per person?"
      />
      <Input<BookingFormData>
        id="price"
        label="Price"
        type="number"
        formatPrice
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      {errors.price && (
        <p className="text-red-500 text-sm mt-1">
          {errors.price.message as string}
        </p>
      )}
      {price && !errors.price && (
        <p className="text-green-500 text-sm mt-1">
          Your activity will be listed at {price} units per person.
        </p>
      )}
    </div>
  );
}

export default React.memo(StepPrice);