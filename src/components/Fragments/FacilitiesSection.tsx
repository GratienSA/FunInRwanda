'use client';

import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/app/redux/store';

const FacilitiesSection: React.FC = () => {
    // Sélection du thème depuis le store Redux
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    // Définition des clés pour les icônes
    type IconKeys = 'icon1' | 'icon2' | 'icon3' | 'icon4';

    // Liste des icônes pour le thème clair
    const iconList: Record<IconKeys, string> = {
        icon1: "/images/icon-facility-1.png",
        icon2: "/images/icon-facility-2.png",
        icon3: "/images/icon-facility-3.png",
        icon4: "/images/icon-facility-4.png"
    };

    // Liste des icônes pour le thème sombre
    const iconListDark: Record<IconKeys, string> = {
        icon1: "/images/icon-facility-1-dark.png",
        icon2: "/images/icon-facility-2-dark.png",
        icon3: "/images/icon-facility-3-dark.png",
        icon4: "/images/icon-facility-4-dark.png"
    };

    // Données des installations
    const facilities = [
        {
            title: "Calculated Weather",
            description: "Precision weather forecasting for seamless adventures",
        },
        {
            title: "Fast & Easy",
            description: "Discover best activities for your perfect day",
        },
        {
            title: "Local Events",
            description: "Explore local events for unforgettable experiences",
        },
        {
            title: "Good Testimonials",
            description: "Trusted by many with excellent customer testimonials",
        },
    ];

    const keys = Object.keys(iconList) as IconKeys[]; 

    return (
        <section className='relative z-30 flex flex-col w-full gap-8 -mt-16 h-fit px-4 sm:px-6 lg:px-8' aria-labelledby="facilities-title">
            {/* Éléments décoratifs */}
            <div className='absolute z-0 bg-primaryyellow dark:bg-primaryblue bg-opacity-10 dark:bg-opacity-20 rounded-full w-[300px] h-[300px] blur-md -top-24 -right-20' aria-hidden="true"></div>
            <Image src="/images/aksen.png" className='absolute w-auto -top-10 -left-[20%]' width={500} height={500} alt='Decorative line' aria-hidden="true" />
            
            {/* Titre de la section */}
            <h1 id="facilities-title" className='flex items-center justify-center w-full text-xl font-bold tracking-tight mb-4 sm:mb-6 py-10'>Why IKAZE ?</h1>
            
            {/* Grille des installations */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {facilities.map((facility, index) => (
                    <div key={index} className='relative flex flex-col items-center p-6 bg-white dark:bg-primaryblack shadow-lg rounded-xl transition-transform duration-300 hover:scale-[1.02]'>
                        <Image 
                            src={isDark ? iconListDark[keys[index]] : iconList[keys[index]]} 
                            className='w-16 h-16 mb-4' 
                            width={64} 
                            height={64} 
                            alt={`${facility.title} icon`}
                            aria-hidden="true"
                        />
                        <h2 className='mb-2 text-lg font-semibold'>{facility.title}</h2>
                        <p className='text-sm text-center text-gray-600 dark:text-slate-400'>{facility.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FacilitiesSection;