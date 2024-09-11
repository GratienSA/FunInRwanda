"use client"

import useCountryData from "@/app/hooks/useCountryData";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";

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
    currentUser,
}) => {
    const { getByValue } = useCountryData()
    const location = getByValue(locationValue)

    return (
        <>
            <Heading
                title={title}
                subtitle={`${location?.region},${location?.name}`}
            />
            <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                <Image
                    src={imageSrc}
                    fill
                    className="object-cover w-full"
                    alt="Image"
                />
            <HeartButton
            listingId={id}
            currentUser={currentUser}
            />
            </div>
        </>
    )
}

export default ListingHead