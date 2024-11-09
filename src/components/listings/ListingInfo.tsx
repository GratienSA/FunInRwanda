"use client"

import React from 'react';
import { IconType } from 'react-icons';
import Avatar from '../navbar/Avatar';
import ListingCategory from './ListingCategory';
import dynamic from 'next/dynamic';
import { SafeUser } from '@/types';
import useCountryData from '@/hooks/useCountryData';

// Chargement dynamique du composant Map
const Map = dynamic(() => import('../Map'), {
    ssr: false
});

interface ListingInfoProps {
    user: SafeUser;
    category?: { 
        label: string; 
        icon: IconType;
        description: string;
    };
    description: string;
    activityType: string;
    duration: number;
    difficulty: string;
    minParticipants: number;
    maxParticipants: number;
    ageRestriction: number;
    equipment: string[];
    locationName: string;
    locationAddress: string;
    latitude: number;
    longitude: number;
    isInstantBook: boolean;
    cancellationPolicy: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    category,
    description,
    activityType,
    duration,
    difficulty,
    minParticipants,
    maxParticipants,
    ageRestriction,
    equipment,
    locationName,
    locationAddress,
    latitude,
    longitude,
    isInstantBook,
    cancellationPolicy,
}) => {
    const { getByValue } = useCountryData();
    const coordinates = getByValue(locationName)?.latlng || [latitude, longitude];

    return (
        <section className="col-span-4 flex flex-col gap-8" aria-label="Informations sur l'annonce">
            <div className="flex flex-col gap-2">
                {/* Informations sur l'hôte */}
                <h2 className="text-xl font-semibold flex flex-row items-center gap-2">
                    Proposé par {user?.name}
                    <Avatar src={user?.profileImage} />
                </h2>
                
                {/* Détails de l'activité */}
                <dl className="flex flex-col gap-2 font-light text-neutral-500">
                    <div><dt className="inline font-semibold">Type d'activité :</dt> <dd className="inline">{activityType}</dd></div>
                    <div><dt className="inline font-semibold">Durée :</dt> <dd className="inline">{duration} heures</dd></div>
                    <div><dt className="inline font-semibold">Difficulté :</dt> <dd className="inline">{difficulty}</dd></div>
                    <div><dt className="inline font-semibold">Participants :</dt> <dd className="inline">{minParticipants} - {maxParticipants}</dd></div>
                    <div><dt className="inline font-semibold">Restriction d'âge :</dt> <dd className="inline">{ageRestriction || 'Aucune'}</dd></div>
                    <div><dt className="inline font-semibold">Équipement :</dt> <dd className="inline">{equipment.join(', ')}</dd></div>
                    <div><dt className="inline font-semibold">Lieu :</dt> <dd className="inline">{locationName}, {locationAddress}</dd></div>
                    <div><dt className="inline font-semibold">Réservation instantanée :</dt> <dd className="inline">{isInstantBook ? 'Oui' : 'Non'}</dd></div>
                    <div><dt className="inline font-semibold">Politique d'annulation :</dt> <dd className="inline">{cancellationPolicy}</dd></div>
                </dl>

                <hr />

                {/* Catégorie de l'annonce */}
                {category && category.icon && (
                    <ListingCategory
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                    />
                )}

                <hr />

                {/* Description de l'annonce */}
                <h3 className="sr-only">Description</h3>
                <p className="text-lg font-light text-neutral-500">
                    {description}
                </p>

                <hr />

                {/* Carte de localisation */}
                <h3 className="sr-only">Localisation</h3>
                <Map center={coordinates} />
            </div>
        </section>
    );
};

export default ListingInfo;