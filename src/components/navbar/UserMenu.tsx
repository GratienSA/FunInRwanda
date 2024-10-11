"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import { signOut, useSession } from 'next-auth/react';
import Avatar from "./Avatar";
import MenuItem from './MenuItem';
import { useRouter } from 'next/navigation';
import { SafeUser } from '../../types';
import useBookingModal from '../../hooks/useBookingModal';
import { LoginForm } from '../auth/login-form';
import { RegisterForm } from '../auth/register-form';

interface UserMenuProps {
    currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const BookingModal = useBookingModal();
    const [isOpen, setIsOpen] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const user = status === 'authenticated' ? (session.user as SafeUser) : null;

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const onRent = useCallback(() => {
        if (!user) {
            setShowLoginForm(true);
            return;
        }
        BookingModal.onOpen();
    }, [user, BookingModal]);

    const handleLogout = useCallback(async () => {
        try {
            await signOut({ redirect: false });
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    }, [router]);

    useEffect(() => {
        const closeMenu = (e: MouseEvent) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [isOpen]);

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex flex-row items-center gap-3">
                <div 
                    onClick={onRent}  
                    className=" bg-blue-500 hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                    role="button"
                    tabIndex={0}
                >
                    Click to create Good Memories For People!
                </div>
                <div 
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                    role="button"
                    tabIndex={0}
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={user?.image} />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div 
                    className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm"
                    role="menu"
                >
                    <div className="flex flex-col cursor-pointer">
                        {status === 'authenticated' ? (
                            <>
                                <MenuItem onClick={() => router.push('/favorites')} label="My favorites" />
                                <MenuItem onClick={() => router.push('/reservations')} label="My bookings" />
                                <MenuItem onClick={() => router.push('/proposals')} label="My proposals" />
                                <MenuItem onClick={() => router.push('/messages')} label="My messages" />
                                <MenuItem onClick={BookingModal.onOpen} label="Unforgettable Moments!" />
                                <hr />
                                <MenuItem onClick={handleLogout} label="Logout" />
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={() => setShowLoginForm(true)} label="Login" />
                                <MenuItem onClick={() => setShowRegisterForm(true)} label="Sign up" />
                            </>
                        )}
                    </div>
                </div>
            )}
            {showLoginForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <LoginForm 
                            onSuccess={() => router.refresh()}
                            onClose={() => setShowLoginForm(false)}
                        />
                    </div>
                </div>
            )}
            {showRegisterForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <RegisterForm 
                            onSuccess={() => alert("Please check your email to verify your account.")}
                            onClose={() => setShowRegisterForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
