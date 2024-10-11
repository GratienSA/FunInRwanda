'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { SafeListing } from '@/src/types';

interface HeaderSectionProps {
  listings?: SafeListing[];
  totalListings?: number;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ listings = [], totalListings = 0 }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const isDark = useSelector((state: { theme: { isDark: boolean } }) => state.theme.isDark);

  useEffect(() => {
    if (!listings || listings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % listings[0].imageSrc.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [listings]);

  const handleExploreClick = useCallback(() => {
    router.push("/destinations");
  }, [router]);

  const imageCarousel = useMemo(() => {
    if (!listings || listings.length === 0) return null;
    return (
      <Image 
        src={listings[0]?.imageSrc?.[currentImageIndex] || "/images/no-image.png"} 
        className='object-cover w-full h-full transition-opacity duration-500'
        width={500} 
        height={500} 
        alt={`Listing ${currentImageIndex + 1}`} 
        priority
      />
    );
  }, [listings, currentImageIndex]);

  return (
    <div className='relative z-30 flex flex-wrap items-center w-full pt-20 sm:pt-14 md:pt-16 xl:pt-20'>
      <div className='absolute z-0 bg-primaryyellow dark:bg-primaryblue bg-opacity-10 dark:bg-opacity-20 rounded-full blur-3xl w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] -top-12 lg:-top-28 -left-28 lg:-left-56'></div>
      
      <div className='absolute right-0 xs:right-[15%] sm:right-0 xs:w-[70%] sm:w-1/2 h-[220px] overflow-hidden rounded-tl-[90px] rounded-br-[90px] rounded-3xl top-[430px] sm:top-32 md:top-40 xl:top-52 transition-transform duration-500 ease-in-out'>
        {imageCarousel}
        <div className='absolute z-10 flex items-center gap-1 px-4 py-1 bg-black dark:bg-white rounded-lg backdrop-blur-sm bg-opacity-[0.15] dark:bg-opacity-[0.15] right-2 bottom-4'>
          <h1 className='text-[35px] font-bold text-primaryyellow'>{totalListings}</h1>
          <h1 className='leading-tight text-white text-[13px]'>Activités<br />Await</h1>
        </div>
      </div>
      
      <div className='relative flex flex-col items-center justify-center w-full sm:items-start h-fit sm:w-1/2'>
        <h1 className='overflow-hidden text-2xl font-bold tracking-tight font-volkhov w-fit whitespace-nowrap text-primaryred dark:text-primaryyellow'>
          It's Time for FunInRwanda!
        </h1>
        <h1 className='relative overflow-hidden w-full text-center sm:text-left text-[50px] font-bold font-volkhov leading-tight tracking-tight mb-5'>
          Adventure Awaits!<br />Make Time with<br /> FunInRwanda
          <Image src={isDark ? "/images/line-decore-dark.png" : "/images/line-decore.png"} className='absolute top-[50px] left-[10%] opacity-70 w-[450px]' width={450} height={10} alt='Line Decore' />
        </h1>
        <h1 className='font-medium w-2/3 text-primarygray text-center sm:text-left dark:text-slate-400 text-[13px]'>
          Explore breathtaking destinations, create unforgettable memories, and discover new horizons with our personalized experiences
        </h1>
        <button 
          onClick={handleExploreClick} 
          className="text-[13px] px-5 py-3 mt-8 font-medium text-white rounded-lg w-fit bg-primaryyellow hover:bg-yellowhover dark:bg-primaryred dark:hover:bg-redhover transition-colors duration-300"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;