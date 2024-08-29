'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"

const Logo = () => {
    const router = useRouter()

    return (
        <Image
            alt="Logo"
            src="/images/logo.png"
            className="hidden md:block cursor-pointer"
            width={50}
            height={50}
            onClick={() => router.push('/')}
        />
    )
}

export default Logo