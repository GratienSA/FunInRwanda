"use client";

import { IconType } from "react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";
import { Route } from "next";

// Définition des props du composant
interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
    description: string;
    onClick: () => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected,
    description,
    onClick
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        // Mise à jour de la requête
        const updatedQuery: Record<string, any> = {
            ...currentQuery,
            category: label
        };

        // Suppression de la catégorie si elle est déjà sélectionnée
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        // Construction de l'URL avec la nouvelle requête
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        // Utilisation de `router.push` seulement après un clic
        router.push(url as unknown as Route)
    }, [label, params, router]);

    return (
        <button
            onClick={handleClick}
            className={`
                flex 
                flex-col 
                items-center 
                justify-center 
                gap-2
                p-2 sm:p-3 md:p-4 
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                rounded-xl
                w-full sm:w-auto 
                ${selected ? 'border-b-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500'}
                ${selected ? 'bg-neutral-100' : 'hover:bg-neutral-100'}
            `}
            aria-label={`${label} category: ${description}`}
            title={description}
        >
            <Icon size={20} aria-hidden="true" className="text-2xl sm:text-3xl md:text-4xl" />
            <div className="font-medium text-xs sm:text-sm md:text-base text-center">
                {label}
            </div>
        </button>
    );
};

export default CategoryBox;
