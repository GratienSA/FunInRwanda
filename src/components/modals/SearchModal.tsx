"use client"

import React, { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import qs from "query-string";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import dynamic from "next/dynamic";

import Modal from "./Modal";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import RegionSelect from "../inputs/RegionSelect";
import Input from "../inputs/Input";
import { RegionSelectValue } from "@/src/types";
import useSearchModal from "@/src/hooks/useSearchModal";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    FILTERS = 2,
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();
    
    const [step, setStep] = useState(STEPS.LOCATION);
    const [location, setLocation] = useState<RegionSelectValue | null>(null);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), []);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            location: null,
            dateRange: {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            },
            category: '',
            activityType: '',
            difficulty: '',
            minPrice: '',
            maxPrice: '',
            minDuration: '',
            maxDuration: '',
            participants: 1,
            ageRestriction: '',
            isInstantBook: false,
        }
    });

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []); 

    const onSubmit = handleSubmit((data) => {
        if (step !== STEPS.FILTERS) {
            return onNext();
        }
    
        let currentQuery = {};
        if (params) {
            currentQuery = qs.parse(params.toString());
        }
    
        // Filtrer uniquement les champs qui ne sont pas vides ou qui ont une valeur différente de la valeur par défaut
        const updatedQuery: any = {
            ...currentQuery,
            ...(location?.value && { locationValue: location.value }),
            ...(location?.latitude && { latitude: location.latitude }),
            ...(location?.longitude && { longitude: location.longitude }),
            ...(dateRange.startDate && { startDate: formatISO(dateRange.startDate) }),
            ...(dateRange.endDate && { endDate: formatISO(dateRange.endDate) }),
            ...(data.category && { category: data.category }),
            ...(data.activityType && { activityType: data.activityType }),
            ...(data.difficulty && { difficulty: data.difficulty }),
            ...(data.minPrice && { minPrice: data.minPrice }),
            ...(data.maxPrice && { maxPrice: data.maxPrice }),
            ...(data.minDuration && { minDuration: data.minDuration }),
            ...(data.maxDuration && { maxDuration: data.maxDuration }),
            ...(data.participants !== 1 && { participants: data.participants }),
            ...(data.ageRestriction && { ageRestriction: data.ageRestriction }),
            ...(data.isInstantBook && { isInstantBook: data.isInstantBook }),
        };
    
        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery,
        }, { skipNull: true, skipEmptyString: true }); 
    
        setStep(STEPS.LOCATION);
        searchModal.onClose();
        router.push(url);
    });
    


    const actionLabel = useMemo(() => {
        if (step === STEPS.FILTERS) {
            return 'Search'
        }
        return 'Next'
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }
        return 'Back'
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Where do you want to go?"
                subtitle="Search for a destination"
            />
            <RegionSelect
                value={location}
                onChange={(value) => {
                    setLocation(value);
                    setValue('location', value);
                }}
            />
            <hr />
            <Map />
        </div>
    );

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="When do you want to go?"
                    subtitle="Make sure everyone is free!"
                />
                <Calendar
                      value={dateRange}
                      onChange={(value) => {
                        setDateRange(value);
                        setValue('dateRange', value);
    }}
                    />
            </div>
        );
    }

    if (step === STEPS.FILTERS) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="More filters"
                    subtitle="Find your perfect activity"
                />
                <Input
                    id="category"
                    label="Category"
                    register={register}
                    errors={errors}
                />
                <Input
                    id="activityType"
                    label="Activity Type"
                    register={register}
                    errors={errors}
                />
                <Input
                    id="difficulty"
                    label="Difficulty"
                    register={register}
                    errors={errors}
                />
                <div className="flex gap-4">
                    <Input
                        id="minPrice"
                        label="Min Price"
                        type="number"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id="maxPrice"
                        label="Max Price"
                        type="number"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="flex gap-4">
                    <Input
                        id="minDuration"
                        label="Min Duration (minutes)"
                        type="number"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id="maxDuration"
                        label="Max Duration (minutes)"
                        type="number"
                        register={register}
                        errors={errors}
                    />
                </div>
                <Counter
                    title="Participants"
                    subtitle="How many people are coming?"
                    value={watch('participants')}
                    onChange={(value) => setValue('participants', value)}
                />
                <Input
                    id="ageRestriction"
                    label="Minimum Age"
                    type="number"
                    register={register}
                    errors={errors}
                />
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isInstantBook"
                        {...register('isInstantBook')}
                    />
                    <label htmlFor="isInstantBook">Instant Book Only</label>
                </div>
            </div>
        );
    }

    return (
        <Modal
        isOpen={searchModal.isOpen}
        onClose={searchModal.onClose}
        onSubmit={onSubmit}
        title="Filters"
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
        body={bodyContent}
    />
    
    );
};

export default SearchModal;