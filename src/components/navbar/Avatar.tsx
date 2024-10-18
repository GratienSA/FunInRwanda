'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { useSession } from 'next-auth/react'

interface AvatarProps {
    userId?: string;
    src?: string;
    size?: number;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    userId,
    src,
    size = 30,
    className = ""
}) => {
    const { data: session } = useSession()
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    useEffect(() => {
        const fetchUserImage = async () => {
            if (userId) {
                try {
                    const response = await fetch(`/api/user/${userId}/image`)
                    if (response.ok) {
                        const data = await response.json()
                        setImageSrc(data.profileImage)
                    }
                } catch (error) {
                    console.error('Error fetching user image:', error)
                }
            } else if (src) {
                setImageSrc(src)
            } else if (session?.user?.image) {
                setImageSrc(session.user.image)
            }
        }

        fetchUserImage()
    }, [userId, src, session])

    const cloudinaryLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
        if (!cloudName) {
            console.error('Cloudinary cloud name is not set')
            return src
        }
        if (src.startsWith('http')) {
            return src
        }
        const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
        return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(',')}/${src}`
    }

    return (
        <Image
            loader={cloudinaryLoader}
            src={imageSrc || "/images/placeholder.jpg"}
            alt="Avatar"
            width={size}
            height={size}
            className={`rounded-full ${className}`}
        />
    )
}

export default Avatar