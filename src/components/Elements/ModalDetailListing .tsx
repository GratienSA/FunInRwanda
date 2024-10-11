"use client"

import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setShowModal } from '@/src/app/redux/slice/showModalSlice';
import { SafeListing } from '@/src/types';

interface ModalDetailListingProps {
    showDetailListing: boolean;
    setShowDetailListing: Dispatch<SetStateAction<boolean>>;
    selectedListing: SafeListing | null; 
    setSelectedListing: Dispatch<SetStateAction<SafeListing | null>>; 
}

const ModalDetailListing: React.FC<ModalDetailListingProps> = ({
    showDetailListing,
    setShowDetailListing,
    selectedListing,
    setSelectedListing
}) => {
    const dispatch = useDispatch();
    const [viewMap, setViewMap] = useState(false);

    const handleCloseDetailListing = () => {
        if (viewMap) {
            setViewMap(false);
        } else {
            setShowDetailListing(false);
            dispatch(setShowModal(false));
            setSelectedListing(null);
        }
    };

    const handleViewMap = () => {
        setViewMap(true);
    };

    const formatNumber = (number: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(number);
    };

    if (!selectedListing) {
        return null; 
    }

    return (
        <>
            <div className={`absolute z-30 w-full h-full opacity-40 bg-primaryblack dark:bg-primarygray dark:opacity-60 ${showDetailListing ? '' : 'hidden'}`}></div>
            <div className={`${showDetailListing ? '' : 'hidden'} absolute z-30 flex items-center justify-center w-full h-full`}>
                <div className="bg-white dark:bg-primaryblack shadow-lg rounded-lg text-[10px] lg:text-[11px] xl:text-[13px] flex justify-center relative text-primaryblack dark:text-slate-200 h-fit w-fit">
                    <div className='absolute flex items-center justify-end w-full p-2'>
                        <button onClick={handleCloseDetailListing} className='w-8 h-8 text-xl rounded-lg cursor-default cursor-scale lg:cursor-none hover:text-primaryred dark:hover:text-primaryred'>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center w-fit h-fit p-5">
                        <div className='flex flex-col items-start justify-center gap-4 w-fit h-fit'>
                            <div className={`flex flex-col sm:flex-row w-full gap-4 ${viewMap ? 'hidden' : ''}`}>
                                <div className='flex items-center gap-2 -mb-2 sm:hidden'>
                                    <h1 className='text-lg font-semibold capitalize lg:text-xl xl:text-2xl'>{selectedListing.title}</h1>
                                    <h1 className='px-1 capitalize rounded-sm bg-slate-100 dark:bg-slate-700'>{selectedListing.category}</h1>
                                </div>

                                <div className='flex flex-col -mb-2 sm:mb-0 w-[280px] xs:w-[290px] sm:w-[260px] md:w-[300px] lg:w-[340px] xl:w-[380px] overflow-scroll no-scrollbar gap-3 rounded-lg h-[194px] md:h-[240px] lg:h-[260px] xl:h-[280px]'>
                                    {selectedListing.imageSrc && selectedListing.imageSrc.length > 0 ? (
                                        selectedListing.imageSrc.map((imageUrl, index) => (
                                            <div key={index} className={`flex relative w-full ${selectedListing.imageSrc.length === 1 ? 'h-full' : 'h-[75%]'}`}>
                                                <Image src={imageUrl || '/images/no-image.png'} alt="Listing Image" className='object-cover w-full h-full rounded-lg' width={500} height={500} />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No images available</p>
                                    )}
                                </div>

                                <div className='flex flex-col gap-1 w-fit text-primaryblack dark:text-slate-200'>
                                    <div className='hidden sm:flex items-center gap-2 md:gap-[10px] xl:gap-3'>
                                        <h1 className='text-lg font-semibold capitalize lg:text-xl xl:text-2xl'>{selectedListing.title}</h1>
                                        <h1 className='px-1 capitalize rounded-sm bg-slate-100 dark:bg-slate-700'>{selectedListing.category}</h1>
                                    </div>
                                    <div className='flex w-[280px] xs:w-full items-center gap-2'>
                                        {selectedListing.reviewCount && selectedListing.reviewAverage ? (
                                            <>
                                                <div className='flex items-center'>
                                                    <i className="mr-1 fa-solid fa-star text-primaryyellow"></i>
                                                    <h1 className='pt-[1px]'>{selectedListing.reviewAverage}</h1>
                                                </div>
                                                <h1 className='text-slate-300 dark:text-slate-500'>|</h1>
                                                <h1>{selectedListing.reviewCount} reviews</h1>
                                            </>
                                        ) : (
                                            <p>No reviews available</p>
                                        )}
                                    </div>

                                    <div className='flex items-center gap-2 md:gap-[10px] xl:gap-3 px-3 py-1 lg:py-[6px] xl:py-2 mb-1 lg:mb-[6px] xl:mb-2 rounded-lg bg-slate-100 dark:bg-slate-700'>
                                        <div className='relative flex w-fit'>
                                            <h1 className='relative text-primarygray dark:text-slate-400'>{formatNumber(selectedListing.price, selectedListing.currency)}</h1>
                                        </div>
                                        <h1 className='text-lg font-semibold lg:text-xl xl:text-2xl text-primaryblue'>{formatNumber(selectedListing.price, selectedListing.currency)}</h1>
                                    </div>

                                    <div className='flex flex-col gap-2 overflow-y-scroll no-scrollbar'>
                                        <div className='flex gap-8 ml-3'>
                                            <h1 className='w-[30%] text-primarygray dark:text-slate-400'>Description</h1>
                                            <h1 className='w-[70%]'>{selectedListing.description}</h1>
                                        </div>
                                        <div className='flex gap-8 ml-3'>
                                            <h1 className='w-[30%] text-primarygray dark:text-slate-400'>Équipements</h1>
                                            <h1 className='w-[70%]'>{selectedListing.equipment.join(', ')}</h1>
                                        </div>
                                    </div>

                                    <div className='flex gap-8 ml-3'>
                                        <h1 className='w-[30%] text-primarygray dark:text-slate-400'>Adresse</h1>
                                        <div className='w-[70%] flex flex-col gap-1 items-start'>
                                            <h1>{selectedListing.locationAddress}</h1>
                                            <button onClick={handleViewMap} className='font-medium text-primaryred hover:text-redhover dark:text-primaryyellow dark:hover:text-yellowhover'>
                                                Voir la carte <i className="fa-solid fa-chevron-right mx-2 text-[11px]"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex flex-col w-full h-[280px] ${viewMap ? '' : 'hidden'}`}>
                                <h1 className='pb-2 font-medium text-center capitalize'>{selectedListing.title}</h1>
                                {viewMap && (
                                    <iframe
                                        className='rounded-lg hide-custom-cursor'
                                        src={`https://www.google.com/maps?q=${selectedListing.latitude},${selectedListing.longitude}&output=embed`}
                                        width="100%" height="100%" allowFullScreen>
                                    </iframe>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalDetailListing;
