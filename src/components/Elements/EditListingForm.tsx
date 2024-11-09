'use client'

import { useState, useCallback, useMemo } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { SafeListing, BookingFormData } from '@/types'
import StepCategory from '../steps/StepCategory'
import StepLocation from '../steps/StepLocation'
import StepInfo from '../steps/StepInfo'
import StepImages from '../steps/StepImages'
import StepDescription from '../steps/StepDescription'
import StepPrice from '../steps/StepPrice'
import { useRouter } from 'next/navigation'

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

interface EditListingFormProps {
    listing: SafeListing;
    onSubmit: (data: BookingFormData) => Promise<void>;
}

const EditListingForm: React.FC<EditListingFormProps> = ({ listing, onSubmit }) => {
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        control,
    } = useForm<BookingFormData>({
        defaultValues: {
            category: listing.category,
            activityType: listing.activityType,
            duration: listing.duration,
            difficulty: listing.difficulty,
            minParticipants: listing.minParticipants,
            maxParticipants: listing.maxParticipants,
            ageRestriction: listing.ageRestriction,
            equipment: listing.equipment,
            locationName: listing.locationName,
            locationAddress: listing.locationAddress,
            latitude: listing.latitude,
            longitude: listing.longitude,
            imageSrc: Array.isArray(listing.imageSrc) ? listing.imageSrc : [listing.imageSrc],
            title: listing.title,
            description: listing.description,
            price: listing.price,
            currency: listing.currency,
            isInstantBook: listing.isInstantBook,
            cancellationPolicy: listing.cancellationPolicy,
        },
    })

    const setCustomValue = useCallback(
        (id: keyof BookingFormData, value: any) => {
            setValue(id, value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            })
        },
        [setValue]
    )

    const onBack = useCallback(() => setStep((prevStep) => prevStep - 1), [])
    const onNext = useCallback(() => setStep((prevStep) => prevStep + 1), [])
    const router = useRouter()

    const handleFormSubmit: SubmitHandler<BookingFormData> = useCallback(
        async (data) => {
            if (step !== STEPS.PRICE) {
                return onNext()
            }
    
            setIsLoading(true)
    
            try {
                await onSubmit(data)
                toast.success('Listing updated successfully!')
                router.push('/proposals')
            } catch (error) {
                console.error('An error occurred during submission:', error)
                toast.error('Failed to update listing')
            } finally {
                setIsLoading(false)
            }
        },
        [step, onNext, onSubmit]
    )
    const actionLabel = useMemo(
        () => (step === STEPS.PRICE ? 'Update' : 'Next'),
        [step]
    )
    const secondaryActionLabel = useMemo(
        () => (step === STEPS.CATEGORY ? undefined : 'Back'),
        [step]
    )

    const bodyContent = useMemo(() => {
        switch (step) {
            case STEPS.CATEGORY:
                return (
                    <StepCategory
                        category={watch('category')}
                        setCustomValue={setCustomValue}
                    />
                )
            case STEPS.LOCATION:
                return (
                    <StepLocation
                        register={register}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        isLoading={isLoading}
                    />
                )
            case STEPS.INFO:
                return (
                    <StepInfo
                        register={register}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        isLoading={isLoading}
                    />
                )
                case STEPS.IMAGES:
                    return (
                        <StepImages
                            imageSrc={watch('imageSrc')}
                            setCustomValue={(value) => setCustomValue('imageSrc', value)}
                        />
                    )
            case STEPS.DESCRIPTION:
                return (
                    <StepDescription
                        register={register}
                        watch={watch}
                        errors={errors}
                        isLoading={isLoading}
                        setCustomValue={setCustomValue}
                    />
                )
            case STEPS.PRICE:
                return (
                    <StepPrice
                        register={register}
                        watch={watch}
                        errors={errors}
                        isLoading={isLoading}
                        setCustomValue={setCustomValue}
                    />
                )
            default:
                return null
        }
    }, [step, watch, setCustomValue, errors, register, isLoading, setValue])

    const progressPercentage = useMemo(() => {
        return ((step + 1) / Object.keys(STEPS).length) * 100
    }, [step])

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
                <div className="mb-6">
                    <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 text-center">
                        Step {step + 1} of {Object.keys(STEPS).length}
                    </div>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="mb-8">
                        {bodyContent}
                    </div>

                    <div className="flex justify-between items-center">
                        {step !== STEPS.CATEGORY && (
                            <button
                                type="button"
                                onClick={onBack}
                                disabled={isLoading}
                                className="px-6 py-2 rounded-full text-blue-500 border border-blue-500 hover:bg-blue-50 transition duration-300 disabled:opacity-50"
                            >
                                {secondaryActionLabel || "Back"}
                            </button>
                        )}
                        <div className={step === STEPS.CATEGORY ? 'w-full' : 'w-1/2 ml-4'}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                            >
                                {actionLabel}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditListingForm