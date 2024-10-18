'use client'

import { FcGoogle } from 'react-icons/fc'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterFormValues } from '../../schemas'
import { register } from '../../actions/register'
import Image from 'next/image'

import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import Button from '../navbar/Button'
import useRegisterModal from '../../hooks/useRegisterModal'
import useLoginModal from '../../hooks/useLoginModal'

const RegisterModal = () => {
    const router = useRouter()
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)
    const [profileImage, setProfileImage] = useState<string | null>(null)

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            profileImage: null,
        },
    })

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append('file', file)

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    const data = await response.json()
                    setProfileImage(data.fileUrl)
                    setValue('profileImage', data.fileUrl)
                    toast.success('Image uploaded successfully')
                } else {
                    toast.error('Failed to upload image')
                }
            } catch (error) {
                console.error('Upload error:', error)
                toast.error('An error occurred during upload')
            }
        }
    }

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        setIsLoading(true)

        try {
            const result = await register(data)

            if (result.success) {
                toast.success('Registered successfully')
                registerModal.onClose()
                loginModal.onOpen()
                router.refresh()
            } else {
                toast.error(result.error || 'Something went wrong')
                if (result.issues) {
                    console.error('Validation issues:', result.issues)
                }
            }
        } catch (error) {
            toast.error('An error occurred during registration')
            console.error('Registration error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggle = useCallback(() => {
        registerModal.onClose()
        loginModal.onOpen()
    }, [registerModal, loginModal])

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Welcome to FunInRwanda"
                subtitle="Create an account!"
            />
            <Input
                id="email"
                label="Email"
                type="email"
                disabled={isLoading}
                register={registerField}
                errors={errors}
                required
            />
            <Input
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={registerField}
                errors={errors}
                required
            />
            <div>
                <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-700"
                >
                    Profile Picture
                </label>
                <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-violet-700
                        hover:file:bg-violet-100"
                />
                {profileImage && (
                    <div className="mt-2">
                        <Image
                            src={profileImage}
                            alt="Profile preview"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                    </div>
                )}
            </div>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button
                outline
                label="Continue with Google"
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>Already have an account?</div>
                    <div
                        onClick={toggle}
                        className="text-neutral-800 cursor-pointer hover:underline"
                    >
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal;