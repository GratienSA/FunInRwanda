"use client";

import React, { useId } from 'react';
import { FieldErrors, FieldValues, UseFormRegister, Path } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps<T extends FieldValues> {
    id: Path<T>;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    step?: string;
    min?: string | number;
    max?: string | number;
    className?: string;
}

function Input<T extends FieldValues>({
    id,
    label,
    type = 'text',
    disabled,
    formatPrice,
    required,
    register,
    errors,
    placeholder,
    value,
    onChange,
    step,
    min,
    max,
    className = '',
}: InputProps<T>) {
    const inputId = useId();
    const actualId = id || inputId;

    if (formatPrice && type !== 'number') {
        console.warn('formatPrice should be used with type="number"');
    }

    return (
        <div className={`w-full relative ${className}`}>
            {formatPrice && (
                <BiDollar
                    size={24}
                    className="text-neutral-700 absolute top-5 left-2"
                />
            )}
            <input
                id={actualId}
                disabled={disabled}
                {...register(id, { required })}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={onChange}
                step={step}
                min={min}
                max={max}
                className={`
                    peer
                    w-full
                    p-4
                    pt-6
                    font-light
                    bg-white
                    border-2
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    ${formatPrice ? 'pl-9' : 'pl-4'}
                    ${errors[actualId as Path<T>] ? 'border-rose-500' : 'border-neutral-300'}
                    ${errors[actualId as Path<T>] ? 'focus:border-rose-500' : 'focus:border-black'}
                `}
                aria-invalid={errors[actualId as Path<T>] ? 'true' : 'false'}
                aria-describedby={`${actualId}-error`}
                onFocus={(e) => e.target.select()}
            />
            <label
                htmlFor={actualId}
                className={`
                    absolute
                    text-md
                    duration-150
                    transform
                    -translate-y-3
                    top-5
                    z-10
                    origin-[0]
                    ${formatPrice ? 'left-9' : 'left-4'}
                    peer-placeholder-shown:scale-100
                    peer-placeholder-shown:translate-y-0
                    peer-focus:scale-75
                    peer-focus:-translate-y-4
                    ${errors[actualId as Path<T>] ? 'text-rose-500' : 'text-zinc-400'}
                `}
            >
                {label}
            </label>
            {errors[actualId as Path<T>] && (
                <span className="text-rose-500 text-sm mt-1" id={`${actualId}-error`}>
                    {errors[actualId as Path<T>]?.message as string}
                </span>
            )}
        </div>
    );
}

export default React.memo(Input) as typeof Input;