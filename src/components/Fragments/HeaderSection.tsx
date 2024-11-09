'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SafeListing } from '@/src/types'

interface HeaderSectionProps {
    totalListings?: number
    listings: SafeListing[];
}

interface TopActivity {
    id: string
    title: string
    imageSrc: string
    bookingCount: number
   
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ totalListings = 0 }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    const [topActivities, setTopActivities] = useState<TopActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTopActivities = async () => {
            try {
                const response = await fetch('/api/reservations')
                if (!response.ok) {
                    throw new Error(
                        'Erreur lors de la récupération des activités les plus réservées'
                    )
                }
                const data = await response.json()
                setTopActivities(data)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Une erreur est survenue'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchTopActivities()
    }, [])

    useEffect(() => {
        if (topActivities.length === 0) return
        const interval = setInterval(() => {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % topActivities.length
            )
        }, 5000)
        return () => clearInterval(interval)
    }, [topActivities])

    return (
        <div className="relative z-30 flex flex-col md:flex-row items-center justify-between w-full pt-20 sm:pt-14 md:pt-16 xl:pt-20 gap-12">
           

           <div className="flex flex-col items-center md:items-start justify-center w-full md:w-[45%] space-y-8">
    <div className="overflow-hidden">
        <h1 className="text-2xl font-bold tracking-tight font-volkhov text-[#E76F51] dark:text-[#F4A261] transform transition-transform duration-500 hover:scale-105">
            Découvrez l'aventure avec IKAZE !
        </h1>
    </div>

    <div className="relative">
        <h1 className="text-center md:text-left text-4xl lg:text-5xl font-bold font-volkhov leading-tight tracking-tight">
            <span className="block mb-2 animate-fade-in-up text-black">
                Explorez,
            </span>
            <span className="block mb-2 animate-fade-in-up animation-delay-300 text-black">
                Vivez,
            </span>
            <span className="block animate-fade-in-up animation-delay-600 text-[#E76F51]">
            IKAZE Créateur des souvenirs
            </span>
        </h1>
        <div className="absolute -bottom-4 left-0 w-24 h-2 bg-[#F4A261] rounded-full transform transition-all duration-300 ease-in-out hover:w-32"></div>
    </div>

    <p className="font-medium w-full md:w-5/6 text-[#5C6B73] text-center md:text-left dark:text-slate-400 text-sm md:text-base leading-relaxed animate-fade-in">
        Plongez dans des expériences uniques au cœur de paysages époustouflants. 
        Que vous soyez passionné d'aventure, amoureux de la nature ou adepte de sports, 
        IKAZE vous propose des activités sur mesure pour des moments inoubliables.
    </p>

    <div className="flex flex-wrap justify-center md:justify-start gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#2D6A4F] rounded-full text-white transition-all duration-300 hover:shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Activités éco-responsables</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A5F7A] rounded-full text-white transition-all duration-300 hover:shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <span>Aventures guidées</span>
        </div>
    </div>

    <div className="mt-8 flex items-center gap-4 px-6 py-3 bg-[#5C6B73] rounded-full backdrop-filter backdrop-blur-sm bg-opacity-20 transition-all duration-300 hover:bg-opacity-30 hover:shadow-lg">
        <h1 className="text-4xl font-bold text-black">
            {totalListings}
        </h1>
        <p className="leading-tight text-[#1A5F7A]  text-sm">
            Expériences<br />
            uniques à vivre
        </p>
    </div>
</div>
            {/* Carrousel des 5 activités les plus réservées */}
            <div className="relative w-full md:w-[50%] rounded-2xl shadow-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <p>Chargement des activités...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[300px]">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                        {topActivities.length > 0 && (
                            <Link
                                href={`/listings/${topActivities[currentImageIndex].id}`}
                                passHref
                            >
                                <div className="cursor-pointer">
                                    <Image
                                        src={
                                            topActivities[currentImageIndex]
                                                .imageSrc
                                        }
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-opacity duration-500"
                                        alt={
                                            topActivities[currentImageIndex]
                                                .title
                                        }
                                        priority
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                                        <h3 className="text-lg font-semibold">
                                            {
                                                topActivities[currentImageIndex]
                                                    .title
                                            }
                                        </h3>
                                        <p className="text-sm">
                                            Réservé{' '}
                                            {
                                                topActivities[currentImageIndex]
                                                    .bookingCount
                                            }{' '}
                                            fois
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                    {topActivities.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full mx-1 ${
                                index === currentImageIndex
                                    ? 'bg-white'
                                    : 'bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HeaderSection
