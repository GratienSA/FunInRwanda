'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    UseFormRegister,
    FieldErrors,
    UseFormWatch,
    UseFormSetValue,
} from 'react-hook-form';
import Input from '../inputs/Input';
import Counter from '../inputs/Counter';
import Heading from '../Heading';
import Select from '../inputs/Select';
import { BookingFormData } from '@/types';

interface StepInfoProps {
    register: UseFormRegister<BookingFormData>;
    errors: FieldErrors<BookingFormData>;
    watch: UseFormWatch<BookingFormData>;
    setValue: UseFormSetValue<BookingFormData>;
    isLoading: boolean;
}

const StepInfo: React.FC<StepInfoProps> = ({
    register,
    errors,
    watch,
    setValue,
    isLoading,
}) => {
    // États locaux pour les valeurs
    const [duration, setDuration] = useState<number>(watch('duration') || 1); // Durée initiale de 1 heure
    const [minParticipants, setMinParticipants] = useState<number>(1); // Nombre de participants minimum
    const [maxParticipants, setMaxParticipants] = useState<number>(watch('maxParticipants') || 10); // Nombre de participants maximum

    // Mettre à jour le formulaire (react-hook-form) lorsque l'état change
    useEffect(() => {
        setValue('duration', duration); // Met à jour la valeur de la durée dans le formulaire
    }, [duration, setValue]);

    useEffect(() => {
        setValue('minParticipants', minParticipants); // Met à jour le nombre minimum de participants dans le formulaire
    }, [minParticipants, setValue]);

    useEffect(() => {
        setValue('maxParticipants', maxParticipants); // Met à jour le nombre maximum de participants dans le formulaire
    }, [maxParticipants, setValue]);

    // Fonction pour gérer le changement de la durée
    const handleDurationChange = useCallback((value: number) => {
        console.log("Duration Updated:", value);
        setDuration(value); // Met à jour l'état local
    }, []);

    // Gérer le changement du nombre de participants minimum
    const handleMinParticipantsChange = useCallback((value: number) => {
        console.log("Min Participants Updated:", value);
        setMinParticipants(value); // Met à jour l'état local
    }, []);

    // Gérer le changement du nombre de participants maximum
    const handleMaxParticipantsChange = useCallback((value: number) => {
        console.log("Max Participants Updated:", value);
        setMaxParticipants(value); // Met à jour l'état local
    }, []);

    const difficultyOptions = [
        { value: '', label: 'Select difficulty' },
        { value: 'easy', label: 'Easy' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'challenging', label: 'Challenging' },
        { value: 'expert', label: 'Expert' },
    ];

    const activityTypeOptions = [
        { value: '', label: 'Select activity type' },
        { value: 'escape_game', label: 'Escape Game' },
        { value: 'team_building', label: 'Team Building' },
        { value: 'unusual_activities', label: 'Unusual Activities' },
        { value: 'outdoor_activities', label: 'Outdoor Activities' },
        { value: 'water_activities', label: 'Water Activities' },
        { value: 'culinary_workshops', label: 'Culinary Workshops' },
        { value: 'creative_workshops', label: 'Creative Workshops' },
        { value: 'well_being', label: 'Well-being' },
        { value: 'sports', label: 'Sports' },
        { value: 'virtual_activities', label: 'Virtual Activities' },
        { value: 'shows_events', label: 'Shows & Events' },
        { value: 'bachelor_party', label: 'Bachelor Party' },
        { value: 'birthday', label: 'Birthday' },
    ];

    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Share some basics about your activity"
                subtitle="What amenities do you offer?"
            />

            <Counter
                title="Minimum number of participants"
                subtitle="What's the minimum number of people for this activity?"
                value={minParticipants}
                onChange={handleMinParticipantsChange} // Met à jour l'état local pour minParticipants
            />

            <Counter
                title="Maximum number of participants"
                subtitle="What's the maximum number of people for this activity?"
                value={maxParticipants}
                onChange={handleMaxParticipantsChange} // Met à jour l'état local pour maxParticipants
            />

            <Counter
                title="Duration (in hours)"
                subtitle="How long does your activity last?"
                value={duration}
                onChange={handleDurationChange}
            />

            <Input<BookingFormData>
                id="ageRestriction"
                label="Recommended minimum age"
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                onChange={(e) => {
                    const value = e.target.value
                        ? Number(e.target.value)
                        : undefined;
                    setValue('ageRestriction', value);
                }}
            />

            

            <Select<BookingFormData>
                id="difficulty"
                label="Difficulty level"
                options={difficultyOptions}
                register={register}
                errors={errors}
                required
            />

            <Select<BookingFormData>
                id="activityType"
                label="Activity Type"
                options={activityTypeOptions}
                register={register}
                errors={errors}
                required
            />

            <Input<BookingFormData>
                id="equipment"
                label="Required Equipment"
                type="text"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );
};

export default React.memo(StepInfo);
