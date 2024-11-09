'use client';

import React from 'react';
import Image from 'next/image';

const SectionAvantages: React.FC = () => {


    // Définition des clés pour les icônes
    type ClesIcones = 'icone1' | 'icone2' | 'icone3';

    // Liste des icônes pour le thème clair
    const listeIcones: Record<ClesIcones, string> = {
        icone1: "/images/icon-facility-1.png",
        icone2: "/images/icon-facility-2.png",
        icone3: "/images/icon-facility-3.png",
    };



    // Données des avantages
    const avantages = [
        {
            titre: "Rapide & Facile",
            description: "Découvrez les meilleures activités pour votre journée parfaite",
        },
        {
            titre: "Événements Locaux",
            description: "Explorez les événements locaux pour des expériences inoubliables",
        },
        {
            titre: "Bons Témoignages",
            description: "Approuvé par de nombreux clients avec d'excellents témoignages",
        },
    ];

    const cles = Object.keys(listeIcones) as ClesIcones[]; 

    return (
        <section className='relative z-30 flex flex-col w-full gap-8 -mt-16 h-fit px-4 sm:px-6 lg:px-8' aria-labelledby="titre-avantages">
            
            {/* Titre de la section */}
            <h1 id="titre-avantages" className='flex items-center justify-center w-full text-xl font-bold tracking-tight mb-4 sm:mb-6 py-10'>Pourquoi choisir IKAZE ?</h1>
            
            {/* Grille des avantages */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {avantages.map((avantage, index) => (
                    <div key={index} className='relative flex flex-col items-center p-6 bg-white dark:bg-primaryblack shadow-lg rounded-xl transition-transform duration-300 hover:scale-[1.02]'>
                        <Image 
                            src={listeIcones[cles[index]]} 
                            className='w-16 h-16 mb-4' 
                            width={64} 
                            height={64} 
                            alt={`Icône ${avantage.titre}`}
                            aria-hidden="true"
                        />
                        <h2 className='mb-2 text-lg font-semibold'>{avantage.titre}</h2>
                        <p className='text-sm text-center text-gray-600 dark:text-slate-400'>{avantage.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SectionAvantages;