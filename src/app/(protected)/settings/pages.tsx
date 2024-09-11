"use client"

import { z } from 'zod'; 
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SettingsSchema } from '../../schemas';
import { settings } from '../../actions/settings';
import { useSession } from 'next-auth/react';

const SettingsPage = () => {
    const {update} = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(SettingsSchema),
    });

    useEffect(() => {
        // Ici, vous pouvez charger les paramètres actuels de l'utilisateur
        // et les définir comme valeurs par défaut du formulaire
        const loadUserSettings = async () => {
            // Exemple : const userSettings = await getUserSettings();
            // setValue('name', userSettings.name);
            // setValue('email', userSettings.email);
            // etc.
        };

        loadUserSettings();
    }, [setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await settings(data);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess("Settings updated successfully");
            }
        } catch (error) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input
                        {...register('name')}
                        id="name"
                        type="text"
                        className="w-full p-2 border rounded"
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        {...register('email')}
                        id="email"
                        type="email"
                        className="w-full p-2 border rounded"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                {/* Ajoutez d'autres champs de formulaire selon vos besoins */}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? 'Updating...' : 'Update Settings'}
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
        </div>
    );
};

export default SettingsPage;