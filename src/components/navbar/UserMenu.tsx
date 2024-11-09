'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { signOut, useSession } from 'next-auth/react'
import Avatar from './Avatar'
import MenuItem from './MenuItem'
import { useRouter } from 'next/navigation'
import { SafeUser } from '../../types'
import useBookingModal from '../../hooks/useBookingModal'
import useLoginModal from '../../hooks/useLoginModal'
import useRegisterModal from '../../hooks/useRegisterModal'
import { CurrentUserHookResult } from '../../hooks/useCurrentUser'

interface UserMenuProps {
    currentUser?: CurrentUserHookResult | null;
}

const UserMenu: React.FC<UserMenuProps> = () => {
    const router = useRouter()
    const { data: session, status, update } = useSession()
    const bookingModal = useBookingModal()
    const loginModal = useLoginModal()
    const registerModal = useRegisterModal()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const user = status === 'authenticated' ? (session?.user as SafeUser) : null

    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev)
    }, [])

    const onCreate = useCallback(() => {
        if (!user) {
            loginModal.onOpen()
            return
        }
        bookingModal.onOpen()
    }, [user, bookingModal, loginModal])

    const handleLogout = useCallback(async () => {
        try {
            await signOut({ redirect: false })
            router.push('/')
        } catch (error) {
            console.error('Logout failed', error)
        }
    }, [router])

    useEffect(() => {
        const closeMenu = (e: MouseEvent) => {
            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('click', closeMenu)
        return () => document.removeEventListener('click', closeMenu)
    }, [isOpen])

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onCreate}
                    className="bg-blue-500 hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                    role="button"
                    tabIndex={0}
                >
                   Proposer votre activité!
                </div>
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                    role="button"
                    tabIndex={0}
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        {user ? (
                            <Avatar
                                userId={user.id}
                                size={50}
                                className="border-2 border-blue-500"
                            />
                        ) : (
                            <Avatar
                                size={50}
                                className="border-2 border-gray-300"
                            />
                        )}
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
            <MenuItem
                onClick={() => router.push('/favorites')}
                label="Mes favoris"
            />
            <MenuItem
                onClick={() => router.push('/reservations')}
                label="Mes réservations"
            />
            <MenuItem
                onClick={() => router.push('/proposals')}
                label="Mes propositions"
            />
            <MenuItem
                onClick={() => router.push('/profile')}
                label="Mon profil"
            />
            <MenuItem
                onClick={bookingModal.onOpen}
                label="Proposer Votre activité Inoubliables !"
            />
            <hr />
            <MenuItem
                onClick={handleLogout}
                label="Déconnexion"
            />
        </>
                               
                        ) : (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        loginModal.onOpen()
                                        setIsOpen(false)
                                    }}
                                    label="Login"
                                />
                                <MenuItem
                                    onClick={() => {
                                        registerModal.onOpen()
                                        setIsOpen(false)
                                    }}
                                    label="Sign up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu