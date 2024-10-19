'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { SafeListing } from '@/src/types'

interface HeaderSectionProps {
    listings?: SafeListing[]
    totalListings?: number
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
    listings = [],
    totalListings = 0,
}) => {
    const router = useRouter()
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    const isDark = useSelector((state: { theme: { isDark: boolean } }) => state.theme.isDark)

    useEffect(() => {
        if (!listings || listings.length === 0) return
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % listings[0].imageSrc.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [listings])

    const handleExploreClick = useCallback(() => {
        router.push('/destinations')
    }, [router])

    const imageCarousel = useMemo(() => {
        if (!listings || listings.length === 0) return null
        return (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
                src={listings[0]?.imageSrc?.[currentImageIndex] || '/images/no-image.png'}
                layout="fill"
                objectFit="cover"
                className="transition-opacity duration-500"
                alt={`Listing ${currentImageIndex + 1}`}
                priority
            />
          </div>
        )
    }, [listings, currentImageIndex])

    return (
        <div className="relative z-30 flex flex-col md:flex-row items-center justify-between w-full pt-20 sm:pt-14 md:pt-16 xl:pt-20 gap-12">
            {/* Élément de fond décoratif */}
            <div className="absolute z-0 bg-primaryyellow dark:bg-primaryblue bg-opacity-10 dark:bg-opacity-20 rounded-full blur-3xl w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] -top-12 lg:-top-28 -left-28 lg:-left-56"></div>

            {/* Contenu textuel principal */}
            <div className="flex flex-col items-center md:items-start justify-center w-full md:w-[45%]">
                <h1 className="overflow-hidden text-2xl font-bold tracking-tight font-volkhov w-fit whitespace-nowrap text-primaryred dark:text-primaryyellow">
                    It's Time for IKAZE!
                </h1>
                <h1 className="relative overflow-hidden w-full text-center md:text-left text-4xl lg:text-5xl font-bold font-volkhov leading-tight tracking-tight mb-5">
                    Adventure Awaits!<br />Have fun with<br /> IKAZE
                    <Image
                        src={isDark ? '/images/line-decore-dark.png' : '/images/line-decore.png'}
                        className="absolute top-[50px] left-[10%] opacity-70 w-[450px]"
                        width={450}
                        height={10}
                        alt="Line Decore"
                    />
                </h1>
                <p className="font-medium w-full md:w-5/6 text-primarygray text-center md:text-left dark:text-slate-400 text-sm">
                    Explore breathtaking destinations, create unforgettable memories, and discover new horizons with our personalized experiences
                </p>
                <button
                    onClick={handleExploreClick}
                    className="text-sm px-6 py-3 mt-8 font-medium text-white rounded-full w-fit bg-primaryyellow hover:bg-yellowhover dark:bg-primaryred dark:hover:bg-redhover transition-colors duration-300"
                >
                    Explore Now
                </button>
            </div>

            {/* Conteneur du carrousel d'images */}
            <div className="relative w-full md:w-[50%] rounded-2xl shadow-lg">
                {imageCarousel}
                {/* Affichage du nombre total d'activités */}
                <div className="absolute z-10 flex items-center gap-2 px-4 py-2 bg-black dark:bg-white rounded-full backdrop-blur-sm bg-opacity-30 dark:bg-opacity-30 right-4 bottom-4">
                    <h1 className="text-3xl font-bold text-primaryyellow">{totalListings}</h1>
                    <p className="leading-tight text-white dark:text-black text-sm">
                        Activités<br />Await
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HeaderSection