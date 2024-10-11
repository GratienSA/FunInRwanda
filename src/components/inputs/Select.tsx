"use client";

import React from 'react';
import { FieldErrors, UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  options: SelectOption[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
}

function Select<T extends FieldValues>({
  id,
  label,
  options,
  register,
  errors,
  required = false,
  disabled = false,
  onChange,
}: SelectProps<T>) {
  return (
    <div className="w-full relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        {...register(id, { required })}
        disabled={disabled}
        onChange={onChange} 
        className={`w-full p-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[id] ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="" disabled>
          Sélectionnez une option...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[id]?.message as string || 'This field is required'}
        </p>
      )}
    </div>
  );
}

export default React.memo(Select) as typeof Select;
