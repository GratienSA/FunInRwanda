'use client';

import React from "react";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import { SafeUser } from "../../types";
import useCountryData from "@/src/hooks/useCountryData";

interface ListingHeadProps {
    title: string;
    locationValue: string;
    imageSrc: string;
    id: string;
    currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    locationValue,
    imageSrc,
    id,
    currentUser
}) => {
    const { getByValue } = useCountryData();
    const location = getByValue(locationValue);

    return (
        <section aria-labelledby="listing-title">
            {/* Titre principal et sous-titre */}
            <Heading
                title={title}
                subtitle={`${location?.region}, ${location?.name}`}
            />
            {/* Conteneur de l'image principale */}
            <div
                className="w-full h-[60vh] overflow-hidden rounded-xl relative"
                aria-label="Image principale de l'annonce"
            >
                <Image
                    alt={`Image principale de ${title}`}
                    src={imageSrc}
                    fill
                    className="object-cover w-full"
                />
                {/* Bouton pour ajouter aux favoris */}
                <div className="absolute top-5 right-5">
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </section>
    );
}

export default ListingHead;