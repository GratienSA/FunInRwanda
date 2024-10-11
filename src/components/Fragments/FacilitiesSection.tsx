'use client';

import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/app/redux/store';

const FacilitiesSection = () => {
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    type IconKeys = 'icon1' | 'icon2' | 'icon3' | 'icon4';

    const iconList: Record<IconKeys, string> = {
        icon1: "/images/icon-facility-1.png",
        icon2: "/images/icon-facility-2.png",
        icon3: "/images/icon-facility-3.png",
        icon4: "/images/icon-facility-4.png"
    };

    const iconListDark: Record<IconKeys, string> = {
        icon1: "/images/icon-facility-1-dark.png",
        icon2: "/images/icon-facility-2-dark.png",
        icon3: "/images/icon-facility-3-dark.png",
        icon4: "/images/icon-facility-4-dark.png"
    };

    const facilities = [
        {
            title: "Calculated Weather",
            description: "Precision weather forecasting for seamless adventures",
        },
        {
            title: "Fast & Easy",
            description: "Discover best activities for your perfect day",
        },
        {
            title: "Local Events",
            description: "Explore local events for unforgettable experiences",
        },
        {
            title: "Good Testimonials",
            description: "Trusted by many with excellent customer testimonials",
        },
    ];

    const keys = Object.keys(iconList) as IconKeys[]; 

    return (
        <div className='relative z-30 flex flex-col w-full gap-8 -mt-16 h-fit'>
            <div className='absolute z-0 bg-primaryyellow dark:bg-primaryblue bg-opacity-10 dark:bg-opacity-20 rounded-full w-[300px] h-[300px] blur-md -top-24 -right-20'></div>
            <Image src="/images/aksen.png" className='absolute w-auto -top-10 -left-[20%]' width={500} height={500} alt='Line Decore' />
            <h1 className='flex items-center justify-center w-full text-xl font-bold tracking-tight'>Why FunInRwanda?</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6'>
                {facilities.map((facility, index) => (
                    <div key={index} className='relative flex flex-col items-center p-6 bg-white dark:bg-primaryblack shadow-lg rounded-xl transition-transform duration-300 hover:scale-[1.02]'>
                        <Image 
                            src={isDark ? iconListDark[keys[index]] : iconList[keys[index]]} 
                            className='w-auto h-auto mb-4' 
                            width={64} 
                            height={64} 
                            alt="Icon" 
                        />
                        <h2 className='mb-2 text-lg font-semibold'>{facility.title}</h2>
                        <p className='text-sm text-center text-gray-600 dark:text-slate-400'>{facility.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacilitiesSection;