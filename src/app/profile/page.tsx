'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Avatar from '@/src/components/navbar/Avatar'

interface UserData {
    name: string
    email: string
    profileImage: string
    role: string
    emailVerified: Date | null
    createdAt: string
    isTwoFactorEnabled: boolean
    favoritesCount: number
    listingsCount: number
    reviewsCount: number
    bookingsCount: number
}

const ProfilePage = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        profileImage: '',
        role: '',
        emailVerified: null,
        createdAt: '',
        isTwoFactorEnabled: false,
        favoritesCount: 0,
        listingsCount: 0,
        reviewsCount: 0,
        bookingsCount: 0,
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user')
                if (response.ok) {
                    const data = await response.json()
                    setUserData(data)
                } else {
                    toast.error('Failed to fetch user data')
                }
            } catch (error) {
                console.error('Fetch user error:', error)
                toast.error('An error occurred while fetching user data')
            }
        }

        if (session?.user) {
            fetchUserData()
        }
    }, [session])

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', file)
            formData.append(
                'upload_preset',
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
            )

            try {
                const uploadResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                )

                if (!uploadResponse.ok) {
                    throw new Error(
                        `HTTP error! status: ${uploadResponse.status}`
                    )
                }

                const uploadedImageData = await uploadResponse.json()
                const imageUrl = uploadedImageData.secure_url

                setUserData({ ...userData, profileImage: imageUrl })
                toast.success('Profile image updated successfully')
            } catch (error) {
                console.error('Error uploading image:', error)
                toast.error('Failed to upload image')
            } finally {
                setIsUploading(false)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    profileImage: userData.profileImage,
                    isTwoFactorEnabled: userData.isTwoFactorEnabled,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                await update(data)
                setUserData(data)
                toast.success('Profile updated successfully')
                setIsEditing(false)
            } else {
                toast.error('Failed to update profile')
            }
        } catch (error) {
            console.error('Update error:', error)
            toast.error('An error occurred while updating profile')
        }
    }

    const handleDeleteAccount = async () => {
        if (
            window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            )
        ) {
            try {
                const response = await fetch('/api/user', {
                    method: 'DELETE',
                })

                if (response.ok) {
                    toast.success('Account deleted successfully')
                    router.push('/') // Redirect to home page
                } else {
                    toast.error('Failed to delete account')
                }
            } catch (error) {
                console.error('Delete error:', error)
                toast.error('An error occurred while deleting account')
            }
        }
    }

    if (!session) {
        return <div>Please sign in to view your profile.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar
                        src={userData.profileImage}
                        size={100}
                        className="border-4 border-blue-500"
                    />
                    {isEditing && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                            {isUploading && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Uploading...
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={userData.name}
                        onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={userData.email}
                        onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label htmlFor="twoFactor" className="flex items-center">
                        <input
                            type="checkbox"
                            id="twoFactor"
                            checked={userData.isTwoFactorEnabled}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    isTwoFactorEnabled: e.target.checked,
                                })
                            }
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            disabled={!isEditing}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Enable Two-Factor Authentication
                        </span>
                    </label>
                </div>
                {isEditing ? (
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 text-black px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Edit Profile
                    </button>
                )}
            </form>
            <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
            >
                Delete Account
            </button>
        </div>
    )
}

export default ProfilePage
