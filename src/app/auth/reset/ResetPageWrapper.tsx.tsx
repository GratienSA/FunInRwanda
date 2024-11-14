"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Heading from "@/components/Heading";

const DynamicResetForm = dynamic(() => import('./ResetForm'), { 
  ssr: false,
  loading: () => <p>Chargement du formulaire...</p>
});

const ResetPageWrapper = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <Heading 
          title="Réinitialisez votre mot de passe"
          subtitle="Entrez votre e-mail pour recevoir un lien de réinitialisation"
        />
        {isClient && <DynamicResetForm />}
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPageWrapper;