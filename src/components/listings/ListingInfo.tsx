import React from 'react';
import { IconType } from 'react-icons';

import Avatar from '../navbar/Avatar';
import ListingCategory from './ListingCategory';
import dynamic from 'next/dynamic';
import { SafeUser } from '@/src/types';
import useCountryData from '@/src/hooks/useCountryData';

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
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex flex-row items-center gap-2">
                    <div>Proposed by {user?.name}</div>
                    <Avatar src={user?.image} />
                </div>
                
                <div className="flex flex-col gap-2 font-light text-neutral-500">
                    <div><strong>Activity Type:</strong> {activityType}</div>
                    <div><strong>Duration:</strong> {duration} hours</div>
                    <div><strong>Difficulty:</strong> {difficulty}</div>
                    <div><strong>Participants:</strong> {minParticipants} - {maxParticipants}</div>
                    <div><strong>Age Restriction:</strong> {ageRestriction || 'None'}</div>
                    <div><strong>Equipment:</strong> {equipment.join(', ')}</div>
                    <div><strong>Location:</strong> {locationName}, {locationAddress}</div>
                    <div><strong>Instant Book:</strong> {isInstantBook ? 'Yes' : 'No'}</div>
                    <div><strong>Cancellation Policy:</strong> {cancellationPolicy}</div>
                </div>

                <hr />

                {category && (
                    <ListingCategory
                        icon={category.icon}
                        label={category.label}
                        description={category.description}
                    />
                )}

                <hr />

                <div className="text-lg font-light text-neutral-500">
                    {description}
                </div>

                <hr />

                <Map center={coordinates} />
            </div>
        </div>
    );
};

export default ListingInfo;