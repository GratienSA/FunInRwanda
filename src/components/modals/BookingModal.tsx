'use client'

import Modal from './Modal'
import { useState, useCallback, useMemo } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import StepCategory from '../steps/StepCategory'
import StepLocation from '../steps/StepLocation'
import StepInfo from '../steps/StepInfo'
import StepImages from '../steps/StepImages'
import StepDescription from '../steps/StepDescription'
import StepPrice from '../steps/StepPrice'
import useBookingModal from '@/src/hooks/useBookingModal'
import { BookingFormData } from '@/src/types'

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const BookingModal = () => {
    const bookingModal = useBookingModal()
    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<BookingFormData>({
        defaultValues: {
            category: '',
            activityType: '',
            duration: 1,
            difficulty: '',
            minParticipants: 1,
            maxParticipants: 1,
            ageRestriction: null,
            equipment: [],
            locationName: '',
            locationAddress: '',
            latitude: 0,
            longitude: 0,
            imageSrc: [],
            title: '',
            description: '',
            price: 1,
            currency: 'EUR',
            isInstantBook: false,
            cancellationPolicy: '',
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
    const onNext = useCallback(() => {
        // Add validation logic here before moving to the next step
        setStep((prevStep) => prevStep + 1)
    }, [])

    const onSubmit: SubmitHandler<BookingFormData> = useCallback(
        async (data) => {
            if (step !== STEPS.PRICE) {
                return onNext()
            }

            setIsLoading(true)

            if (!data.imageSrc || data.imageSrc.length === 0) {
                toast.error('Please upload at least one image.')
                setIsLoading(false)
                return
            }

            try {
                await axios.post('/api/listings', data)
                toast.success('Activity created successfully!')
                reset()
                bookingModal.onClose()
                setStep(STEPS.CATEGORY)
            } catch (error) {
                console.error('An error occurred during submission:', error)
                toast.error(
                    `Failed to create activity: ${
                        error instanceof Error ? error.message : 'Unknown error'
                    }`
                )
            } finally {
                setIsLoading(false)
            }
        },
        [step, onNext, bookingModal, reset]
    )

    const actionLabel = useMemo(
        () => (step === STEPS.PRICE ? 'Create' : 'Next'),
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
                        setCustomValue={setCustomValue}
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

    return (
        <Modal
            isOpen={bookingModal.isOpen}
            onClose={bookingModal.onClose}
            title="Create Activity"
            actionLabel={actionLabel}
            onSubmit={handleSubmit(onSubmit)}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            body={bodyContent || null}
            isLoading={isLoading}
        />
    )
}

export default BookingModal