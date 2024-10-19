"use client"

import React from 'react';

// Définition de l'interface pour les props du composant
interface ContainerProps {
    children: React.ReactNode; // Prop pour le contenu enfant du container
    className?: string; // Prop optionnelle pour ajouter des classes personnalisées
}

// Définition du composant Container en utilisant React.FC (Functional Component)
const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        max-w-[1440px] mx-auto  // Largeur maximale et centrage horizontal
        // Padding responsive :
        px-2       // Padding horizontal de base (sur tous les écrans)
        sm:px-4    // Padding horizontal pour les écrans small et au-dessus
        md:px-8    // Padding horizontal pour les écrans medium et au-dessus
        lg:px-12   // Padding horizontal pour les écrans large et au-dessus
        xl:px-16   // Padding horizontal pour les écrans extra-large et au-dessus
        ${className}  // Ajout des classes personnalisées passées en prop
      `}
    >
      {children}
    </div>
  )
}

export default Container;
