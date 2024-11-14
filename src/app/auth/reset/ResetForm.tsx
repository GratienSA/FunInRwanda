"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from '@auth0/nextjs-auth0/client'; 
import Input from "@/components/inputs/Input";
import Button from "@/components/navbar/Button";
import { Route } from "next";

const ResetSchema = z.object({
  email: z.string().email({ message: "Adresse e-mail invalide" }),
});

const ResetForm = () => {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const { user, error, isLoading } = useUser();

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
        router.push('/login' as unknown as Route); 
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
  
  if (user) {
    router.push('/profile' as unknown as Route); 
    return null;
  }

  return (
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
  );
};

export default ResetForm;