"use client";

import { BookingFormData } from "@/types";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import { categories } from "../navbar/Categories";

interface StepCategoryProps {
  category: string;
  setCustomValue: (id: keyof BookingFormData, value: any) => void;
}

const StepCategory: React.FC<StepCategoryProps> = ({ category, setCustomValue }) => {
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your activity?"
        subtitle="Pick a category"
      />
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto"
        role="radiogroup" 
        aria-labelledby="category-heading"
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={() => setCustomValue('category', item.label)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepCategory;