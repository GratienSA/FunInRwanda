'use client'
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Logo = () => {
    const router = useRouter()
    
    return (
        <Link href="/" className="flex-start">
        <Image
            alt="Logo"
            src="/images/logo.png"
            className="hidden md:block cursor-pointer"
            width={30}
            height={30}
            onClick={() => router.push('/')}
        />
        </Link>
    )
}

export default Logo