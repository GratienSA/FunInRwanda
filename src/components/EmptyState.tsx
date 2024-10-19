"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Heading from './Heading';
import Button from './navbar/Button';

// Définition de l'interface pour les props du composant
interface EmptyStateProps {
    title?: string;        // Titre optionnel pour l'état vide
    subtitle?: string;     // Sous-titre optionnel pour l'état vide
    showReset?: boolean;   // Option pour afficher ou non le bouton de réinitialisation
}

// Définition du composant EmptyState
const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No exact matches",                                      // Titre par défaut
    subtitle = "Try changing or removing some of your filters",      // Sous-titre par défaut
    showReset                                                        // Pas de valeur par défaut, sera `undefined` si non fourni
}) => {
    const router = useRouter();  // Hook pour la navigation
    
    // État pour gérer le montage du composant
    const [isMounted, setIsMounted] = useState(false);

    // Effet pour marquer le composant comme monté après le rendu initial
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Rendu conditionnel pour éviter les problèmes d'hydratation
    if (!isMounted) {
        return null;
    }

    return (
        <div 
            className="
                h-[60vh]           /* Hauteur de 60% de la hauteur de la vue */
                flex               /* Utilisation de flexbox */
                flex-col           /* Disposition en colonne */
                gap-2              /* Espacement entre les éléments */
                justify-center     /* Centrage vertical */
                items-center       /* Centrage horizontal */
            "
        >
            <Heading
                center              /* Centrage du texte */
                title={title}       /* Utilisation du titre fourni ou par défaut */
                subtitle={subtitle} /* Utilisation du sous-titre fourni ou par défaut */
            />
            <div className="w-48 mt-4">  {/* Conteneur pour le bouton */}
                {showReset && (          /* Affichage conditionnel du bouton */
                    <Button
                        outline           /* Style outline pour le bouton */
                        label="Remove all filters"  /* Texte du bouton */
                        onClick={() => router.push('/')}  /* Navigation vers la page d'accueil au clic */
                    />
                )}
            </div>
        </div>
    );
};

export default EmptyState;

