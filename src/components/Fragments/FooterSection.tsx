"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/app/redux/store';

const FooterSection = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const isDark = useSelector((state: RootState) => state.theme.isDark);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const socialLinks = [
        { icon: "fa-instagram", url: "https://www.instagram.com/votreprofil" },
        { icon: "fa-facebook-f", url: "https://www.facebook.com/votreprofil" },
        { icon: "fa-x-twitter", url: "https://twitter.com/votreprofil" },
        { icon: "fa-tiktok", url: "https://www.tiktok.com/@votreprofil" }
    ];

    return (
        <footer className='bg-gray-100 dark:bg-gray-900 py-12 text-sm'>
            <div className='container mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    <div className='flex flex-col items-center md:items-start gap-4'>
                        <Image 
                            className='h-10 w-auto' 
                            src={isDark ? "/images/Logo-dark.png" : "/images/Logo.png"} 
                            width={150} 
                            height={40} 
                            alt="Logo de FunInRwanda" 
                        />
                        <p className='text-gray-600 dark:text-gray-400 text-center md:text-left'>
                            Des aventures vous attendent!<br/>
                            Faites une pause avec FunInRwanda
                        </p>
                    </div>

                    <div>
                        <h2 className='font-semibold text-lg mb-4 text-center md:text-left'>Entreprise</h2>
                        <ul className='flex flex-col items-center md:items-start gap-2'>
                            <li><a href="#" className='text-gray-600 dark:text-gray-400 hover:text-primaryred dark:hover:text-primaryyellow transition-colors'>À Propos</a></li>
                            <li className='flex gap-4 text-xl mt-2'>
                                {socialLinks.map((link, index) => (
                                    <a key={index} href={link.url} target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-400 hover:text-primaryred dark:hover:text-primaryyellow transition-colors'>
                                        <i className={`fa-brands ${link.icon}`}></i>
                                    </a>
                                ))}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='font-semibold text-lg mb-4 text-center md:text-left'>Contact</h2>
                        <ul className='text-gray-600 dark:text-gray-400 text-center md:text-left'>
                            <li>Rwanda, Kigali</li>
                            <li>contact@funinrwanda.com</li>
                            <li>+250 788 000 000</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='font-semibold text-lg mb-4 text-center md:text-left'>Liens rapides</h2>
                        <ul className='flex flex-col items-center md:items-start gap-2'>
                            <li><button onClick={() => router.push("/destinations")} className='text-gray-600 dark:text-gray-400 hover:text-primaryred dark:hover:text-primaryyellow transition-colors'>Destinations</button></li>
                            <li><button onClick={() => router.push("/promos")} className='text-gray-600 dark:text-gray-400 hover:text-primaryred dark:hover:text-primaryyellow transition-colors'>Promos</button></li>
                        </ul>
                    </div>
                </div>

                <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center'>
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>
                        <i className="fa-regular fa-copyright mr-1"></i>2024 FunInRwanda. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;