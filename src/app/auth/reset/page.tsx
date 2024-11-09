"use client";

import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from '@auth0/nextjs-auth0/client'; 
import Button from "../../../components/navbar/Button";
import Input from "../../../components/inputs/Input";
import Heading from "../../../components/Heading";

const ResetSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
});

const ResetPage = () => {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) router.push('/profile');
  }, [user, router]);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" }
  });

  const onSubmit: SubmitHandler<z.infer<typeof ResetSchema>> = async (data) => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      if (response.ok) {
        toast.success("Email de réinitialisation envoyé. Vérifiez votre boîte de réception.");
        router.push('/login');
      } else {
        throw new Error('Échec de l\'envoi de l\'e-mail de réinitialisation');
      }
    } catch (error) {
      toast.error("Échec de l'envoi de l'e-mail. Réessayez.");
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <Heading 
          title="Réinitialisez votre mot de passe"
          subtitle="Entrez votre e-mail pour recevoir un lien de réinitialisation"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            id="email"
            label="E-mail"
            type="email"
            disabled={isResetting}
            register={register}
            errors={errors}
            required
          />
          <Button
            type="submit"
            disabled={isResetting}
            label={isResetting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          />
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPage;


