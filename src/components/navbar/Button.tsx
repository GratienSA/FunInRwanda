"use client"

import { IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon,
    fullWidth = false,
    className,
    type = "button",
    ...props
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`
                relative
                disabled:opacity-70
                disabled:cursor-not-allowed
                rounded-full
                hover:opacity-80
                transition
                ${fullWidth ? 'w-full' : 'w-auto'}
                ${outline ? 'bg-white' : 'bg-green-500'}
                ${outline ? 'border-black' : 'border-green-500'}
                ${outline ? 'text-black' : 'text-white'}
                ${small ? 'py-2 px-4' : 'py-3 px-6'}
                ${small ? 'text-sm' : 'text-md'}
                ${small ? 'font-light' : 'font-semibold'}
                ${small ? 'border-[1px]' : 'border-2'}
                ${className || ''}
            `}
            {...props}
        >
            {Icon && (
                <Icon
                    size={24}
                    className={`
                        absolute
                        left-4
                        ${small ? 'top-2' : 'top-3'}
                    `}
                />
            )}
            {label}
        </button>
    );
}

export default Button;