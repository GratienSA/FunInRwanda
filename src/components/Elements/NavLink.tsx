'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Files, HomeIcon, UsersIcon } from 'lucide-react'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import { Route } from 'next'

// Définition des liens de navigation
const links = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Files },
    { name: 'Customers', href: '/dashboard/customers', icon: UsersIcon },
]

export default function NavLinks() {
    const pathname = usePathname() // Récupération du chemin actuel

    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon // Récupération de l'icône

                return (
                    <Link
                        key={link.name}
                        href={link.href as unknown as Route}
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            'justify-start',
                            pathname === link.href
                                ? 'text-primary'
                                : 'text-muted-foreground'
                        )}
                        aria-label={link.name}
                    >
                        <LinkIcon className="mr-2 h-6 w-6" aria-hidden="true" />{' '}
                        {/* Icône avec aria-hidden */}
                        <span className="hidden md:block">
                            {link.name}
                        </span>{' '}
                        {/* Affichage conditionnel du nom */}
                    </Link>
                )
            })}
        </>
    )
}
