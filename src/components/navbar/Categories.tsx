"use client"

import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { FaGift, FaBirthdayCake, FaGlassCheers, FaBuilding } from 'react-icons/fa'
import { GiPartyPopper } from 'react-icons/gi'
import CategoryBox from "../CategoryBox"
import Container from "../Container"

// Définition de l'interface Filtres
interface Filtres {
  categorie: string;
  // Ajoutez d'autres propriétés si nécessaire
}

// Définition des catégories avec leurs icônes et descriptions
export const categories = [
    {
        label: 'Loisirs',
        icon: GiPartyPopper,
        description: "Activités amusantes pour tous"
    },
    {
        label: 'Cadeaux',
        icon: FaGift,
        description: "Idées de cadeaux parfaits"
    },
    {
        label: 'Anniversaire enfant',
        icon: FaBirthdayCake,
        description: "Célébrations et activités pour enfants"
    },
    {
        label: 'Enterrement de vie',
        icon: FaGlassCheers,
        description: "Célébrez des aventures et des activités amusantes entre amis"
    },
    {
        label: 'Entreprise',
        icon: FaBuilding,
        description: "Événements d'entreprise et team building"
    }
]

const Categories = () => {
    const router = useRouter();
    const params = useSearchParams();
    const categorie = params?.get('categorie');
    const pathname = usePathname();
    const estPagePrincipale = pathname === '/';

    const [filtres, setFiltres] = useState<Filtres>({
        categorie: categorie || ''
    });

    const gererChangementFiltre = (cle: keyof Filtres, valeur: string) => {
        setFiltres(prev => ({ ...prev, [cle]: valeur }));
        // Mise à jour de l'URL
        const paramsRecherche = new URLSearchParams(params);
        paramsRecherche.set(cle, valeur);
        router.push(`${pathname}?${paramsRecherche.toString()}`);
    };

    // Ne rendre les catégories que sur la page principale
    if (!estPagePrincipale) {
        return null;
    }

    return (
        <Container>
            {/* Conteneur principal avec gestion du défilement horizontal sur petits écrans */}
            <nav className="py-4 md:py-8" aria-label="Navigation par catégorie">
                <ul className="flex flex-row items-center justify-start md:justify-between overflow-x-auto space-x-4 md:space-x-8">
                    {categories.map((item) => (
                        <li key={item.label}>
                            <CategoryBox
                                label={item.label}
                                selected={filtres.categorie === item.label}
                                icon={item.icon}
                                description={item.description}
                                onClick={() => gererChangementFiltre('categorie', item.label)}
                            />
                        </li>
                    ))}
                </ul>
            </nav>
        </Container>
    )
}

export default Categories