'use client'

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi"
import useSearchModal from "../../hooks/useLoginModal";
import useCountryData from "../../hooks/useCountryData";

const Search = () => {
    const searchModal = useSearchModal();
    const params = useSearchParams();
    const { getByValue } = useCountryData();

    const locationValue = params?.get('locationValue')
    const startDate = params?.get('startDate')
    const endDate = params?.get('endDate')
    const peopleCount = params?.get('peopleCount')
    
    const locationLabel = useMemo(() => {
        if (locationValue) {
            return getByValue(locationValue as string)?.name;
        }
        return 'Anywhere'
    }, [locationValue, getByValue]);

    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            return `${startDate} - ${endDate}`;
        }
        return 'Any Week'
    }, [startDate, endDate]);

    const peopleLabel = useMemo(() => {
        if (peopleCount) {
            return `${peopleCount} Guests`;
        }
        return 'Add Friends'
    }, [peopleCount]);

    return (
        <div 
            onClick={searchModal.onOpen}
            className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-semibold px-6">
                    {locationLabel}
                </div>
                <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
                    {durationLabel}
                </div>
                <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                    <div className="hidden sm:block">{peopleLabel}</div>
                    <div className="p-2 bg-blue-500 rounded-full text-white">
                        <BiSearch size={18}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;