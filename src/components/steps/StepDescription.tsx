import React from 'react';
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import Input from "../inputs/Input";
import Heading from "../Heading";
import { BookingFormData } from '@/types'; 

interface StepDescriptionProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  isLoading: boolean;
  watch: UseFormWatch<BookingFormData>;
  setCustomValue: (id: keyof BookingFormData, value: any) => void;
}

const StepDescription: React.FC<StepDescriptionProps> = ({ 
  register, 
  errors, 
  isLoading,
  watch,
  setCustomValue
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-8">
      <Heading
        title="Describe your activity"
        subtitle="Provide a clear and detailed description"
        className="text-center"
      />
      <div className="space-y-6">
        <Input<BookingFormData>
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          placeholder="Enter a catchy title for your activity"
          className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
        />
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description', { required: true })}
            disabled={isLoading}
            placeholder="Describe your activity in detail"
            rows={6}
            className={`
              w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-300
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">Description is required</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(StepDescription);