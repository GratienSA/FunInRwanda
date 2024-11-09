"use client"

import React, { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { SafeListing } from '@/types';
import { setShowModal } from '@/app/redux/slice/showModalSlice';

// Définition des props du composant
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

    // Fonction pour fermer le modal
    const handleCloseDetailListing = () => {
        if (viewMap) {
            setViewMap(false);
        } else {
            setShowDetailListing(false);
            dispatch(setShowModal(false));
            setSelectedListing(null);
        }
    };

    // Fonction pour afficher la carte
    const handleViewMap = () => {
        setViewMap(true);
    };

    // Fonction pour formater les nombres en devise
    const formatNumber = (number: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(number);
    };

    if (!selectedListing) {
        return null; 
    }

    return (
        <>
            {/* Fond semi-transparent du modal */}
            <div 
                className={`absolute z-30 w-full h-full opacity-40 bg-primaryblack dark:bg-primarygray dark:opacity-60 ${showDetailListing ? '' : 'hidden'}`}
                aria-hidden={!showDetailListing}
            ></div>
            
            {/* Contenu du modal */}
            <div 
                className={`${showDetailListing ? '' : 'hidden'} absolute z-30 flex items-center justify-center w-full h-full`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="bg-white dark:bg-primaryblack shadow-lg rounded-lg text-[10px] lg:text-[11px] xl:text-[13px] flex justify-center relative text-primaryblack dark:text-slate-200 h-fit w-fit">
                    {/* Bouton de fermeture */}
                    <button 
                        onClick={handleCloseDetailListing} 
                        className='absolute top-2 right-2 w-8 h-8 text-xl rounded-lg hover:text-primaryred dark:hover:text-primaryred'
                        aria-label="Fermer le modal"
                    >
                        <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>
                    
                    <div className="flex flex-col items-center justify-center w-fit h-fit p-5">
                        <div className='flex flex-col items-start justify-center gap-4 w-fit h-fit'>
                            {/* Contenu principal */}
                            <div className={`flex flex-col sm:flex-row w-full gap-4 ${viewMap ? 'hidden' : ''}`}>
                                {/* Titre et catégorie (mobile) */}
                                <div className='flex items-center gap-2 -mb-2 sm:hidden'>
                                    <h1 id="modal-title" className='text-lg font-semibold capitalize lg:text-xl xl:text-2xl'>{selectedListing.title}</h1>
                                    <span className='px-1 capitalize rounded-sm bg-slate-100 dark:bg-slate-700'>{selectedListing.category}</span>
                                </div>

                                {/* Carrousel d'images */}
                                <div className='flex flex-col -mb-2 sm:mb-0 w-[280px] xs:w-[290px] sm:w-[260px] md:w-[300px] lg:w-[340px] xl:w-[380px] overflow-scroll no-scrollbar gap-3 rounded-lg h-[194px] md:h-[240px] lg:h-[260px] xl:h-[280px]'>
                                    {selectedListing.imageSrc && selectedListing.imageSrc.length > 0 ? (
                                        selectedListing.imageSrc.map((imageUrl, index) => (
                                            <div key={index} className={`flex relative w-full ${selectedListing.imageSrc.length === 1 ? 'h-full' : 'h-[75%]'}`}>
                                                <Image src={imageUrl || '/images/no-image.png'} alt={`Image de ${selectedListing.title}`} className='object-cover w-full h-full rounded-lg' width={500} height={500} />
                                            </div>
                                        ))
                                    ) : (
                                        <p>Aucune image disponible</p>
                                    )}
                                </div>

                                {/* Détails de l'annonce */}
                                <div className='flex flex-col gap-1 w-fit text-primaryblack dark:text-slate-200'>
                                    {/* Titre et catégorie (desktop) */}
                                    <div className='hidden sm:flex items-center gap-2 md:gap-[10px] xl:gap-3'>
                                        <h1 className='text-lg font-semibold capitalize lg:text-xl xl:text-2xl'>{selectedListing.title}</h1>
                                        <span className='px-1 capitalize rounded-sm bg-slate-100 dark:bg-slate-700'>{selectedListing.category}</span>
                                    </div>
                                    
                                    {/* Avis */}
                                    <div className='flex w-[280px] xs:w-full items-center gap-2'>
                                        {selectedListing.reviewCount && selectedListing.reviewAverage ? (
                                            <>
                                                <div className='flex items-center'>
                                                    <i className="mr-1 fa-solid fa-star text-primaryyellow" aria-hidden="true"></i>
                                                    <span className='pt-[1px]'>{selectedListing.reviewAverage}</span>
                                                </div>
                                                <span className='text-slate-300 dark:text-slate-500'>|</span>
                                                <span>{selectedListing.reviewCount} avis</span>
                                            </>
                                        ) : (
                                            <p>Aucun avis disponible</p>
                                        )}
                                    </div>

                                    {/* Prix */}
                                    <div className='flex items-center gap-2 md:gap-[10px] xl:gap-3 px-3 py-1 lg:py-[6px] xl:py-2 mb-1 lg:mb-[6px] xl:mb-2 rounded-lg bg-slate-100 dark:bg-slate-700'>
                                        <div className='relative flex w-fit'>
                                            <span className='relative text-primarygray dark:text-slate-400'>{formatNumber(selectedListing.price, selectedListing.currency)}</span>
                                        </div>
                                        <span className='text-lg font-semibold lg:text-xl xl:text-2xl text-primaryblue'>{formatNumber(selectedListing.price, selectedListing.currency)}</span>
                                    </div>

                                    {/* Description et équipements */}
                                    <div className='flex flex-col gap-2 overflow-y-scroll no-scrollbar'>
                                        <div className='flex gap-8 ml-3'>
                                            <span className='w-[30%] text-primarygray dark:text-slate-400'>Description</span>
                                            <p className='w-[70%]'>{selectedListing.description}</p>
                                        </div>
                                        <div className='flex gap-8 ml-3'>
                                            <span className='w-[30%] text-primarygray dark:text-slate-400'>Équipements</span>
                                            <p className='w-[70%]'>{selectedListing.equipment.join(', ')}</p>
                                        </div>
                                    </div>

                                    {/* Adresse et lien vers la carte */}
                                    <div className='flex gap-8 ml-3'>
                                        <span className='w-[30%] text-primarygray dark:text-slate-400'>Adresse</span>
                                        <div className='w-[70%] flex flex-col gap-1 items-start'>
                                            <p>{selectedListing.locationAddress}</p>
                                            <button 
                                                onClick={handleViewMap} 
                                                className='font-medium text-primaryred hover:text-redhover dark:text-primaryyellow dark:hover:text-yellowhover'
                                                aria-label="Voir la carte"
                                            >
                                                Voir la carte <i className="fa-solid fa-chevron-right mx-2 text-[11px]" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Affichage de la carte */}
                            <div className={`flex flex-col w-full h-[280px] ${viewMap ? '' : 'hidden'}`}>
                                <h2 className='pb-2 font-medium text-center capitalize'>{selectedListing.title}</h2>
                                {viewMap && (
                                    <iframe
                                        className='rounded-lg hide-custom-cursor'
                                        src={`https://www.google.com/maps?q=${selectedListing.latitude},${selectedListing.longitude}&output=embed`}
                                        width="100%" height="100%" 
                                        allowFullScreen
                                        title={`Carte pour ${selectedListing.title}`}
                                    ></iframe>
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
