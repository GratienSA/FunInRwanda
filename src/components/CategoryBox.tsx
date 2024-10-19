import { IconType } from "react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";

// Définition des props du composant
interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
    description: string; // Ajout de la description pour l'accessibilité
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected,
    description
}) => {
    const router = useRouter();
    const params = useSearchParams();

    // Gestion du clic sur la catégorie
    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        // Mise à jour de la requête
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        // Suppression de la catégorie si elle est déjà sélectionnée
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        // Construction de l'URL avec la nouvelle requête
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, { skipNull: true });

        // Navigation vers la nouvelle URL
        router.push(url);
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
                p-2 sm:p-3 md:p-4 // Padding responsive
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                rounded-xl
                w-full sm:w-auto // Largeur responsive
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
}

export default CategoryBox;