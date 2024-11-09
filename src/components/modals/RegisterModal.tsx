'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaCamera } from 'react-icons/fa'
import Image from 'next/image'

import Modal from './Modal'
import Heading from '../Heading'
import Input from '../inputs/Input'
import Button from '../navbar/Button'
import useRegisterModal from '../../hooks/useRegisterModal'
import useLoginModal from '../../hooks/useLoginModal'
import toast from 'react-hot-toast'

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'UTILISATEUR',
}

const RegisterSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  profileImage: z.string().nullable(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  isTwoFactorEnabled: z.boolean().default(false),
})

type RegisterFormValues = z.infer<typeof RegisterSchema>

const RegisterModal = () => {
  const router = useRouter()
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      profileImage: null,
      role: UserRole.USER,
      isTwoFactorEnabled: false,
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          toast.success('Image téléchargée avec succès')
        } else {
          toast.error('Échec du téléchargement de l\'image')
        }
      } catch (error) {
        console.error('Erreur de téléchargement:', error)
        toast.error('Une erreur est survenue lors du téléchargement')
      }
    }
  }

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Inscription réussie')
        registerModal.onClose()
        loginModal.onOpen()
        router.refresh()
      } else {
        toast.error(result.error || 'Une erreur est survenue')
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'inscription')
      console.error('Erreur d\'inscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const bodyContent = (
    <div className="space-y-8">
      <Heading
        title="Bienvenue sur FunInRwanda"
        subtitle="Créez votre compte et commencez votre aventure !"
        center
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input<RegisterFormValues>
            id="name"
            label="Nom complet"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input<RegisterFormValues>
            id="email"
            label="Adresse e-mail"
            type="email"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input<RegisterFormValues>
            id="password"
            label="Mot de passe"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Aperçu du profil"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                  <FaCamera size={32} className="text-gray-400" />
                </div>
              )}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer"
              >
                <FaCamera size={16} className="text-gray-600" />
              </label>
            </div>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="twoFactor"
              {...register('isTwoFactorEnabled')}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="twoFactor" className="text-sm text-gray-700">
              Activer l'authentification à deux facteurs
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-6">
      <hr />
      <Button
        outline
        label="Continuer avec Google"
        icon={FcGoogle}
        onClick={() => signIn('google')}
      />
      <div className="text-neutral-500 text-center text-sm">
        Vous avez déjà un compte ?{' '}
        <span
          onClick={() => {
            registerModal.onClose()
            loginModal.onOpen()
          }}
          className="text-neutral-800 cursor-pointer hover:underline font-semibold"
        >
          Connectez-vous
        </span>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Créer un compte"
      actionLabel="S'inscrire"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal