"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { FaGift, FaBirthdayCake, FaGlassCheers, FaBuilding } from 'react-icons/fa'
import { GiPartyPopper } from 'react-icons/gi'
import CategoryBox from "../CategoryBox"
import Container from "../Container"

// Définition des catégories avec leurs icônes et descriptions
export const categories = [
    {
        label: 'Leisure',
        icon: GiPartyPopper,
        description: "Fun activities for everyone"
    },
    {
        label: 'Gifts',
        icon: FaGift,
        description: "Perfect gift ideas"
    },
    {
        label: 'Child birthday',
        icon: FaBirthdayCake,
        description: "Celebrations and activities for kids"
    },
    {
        label: 'Bachelor/Bachelorette',
        icon: FaGlassCheers,
        description: "Celebrate adventures and fun activities with friends."
    },
    {
        label: 'Corporate',
        icon: FaBuilding,
        description: "Corporate events and team building"
    }
]

const Categories = () => {
    // Utilisation des hooks de Next.js pour la navigation et les paramètres d'URL
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    // Ne rendre les catégories que sur la page principale
    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            {/* Conteneur principal avec gestion du scroll horizontal sur petits écrans */}
            <nav className="py-4 md:py-8" aria-label="Category navigation">
                <ul className="flex flex-row items-center justify-start md:justify-between overflow-x-auto space-x-4 md:space-x-8">
                    {categories.map((item) => (
                        <li key={item.label}>
                            <CategoryBox
                                label={item.label}
                                selected={category === item.label}
                                icon={item.icon}
                                description={item.description}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </Container>
    )
}

export default Categories