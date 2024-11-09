"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter();
  const role = useCurrentRole();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Rôle actuel:", role); // Log du rôle
  
    if (role !== undefined) {
      setIsLoading(false);
      if (role !== "ADMIN") {
        console.log("Redirection vers /403"); // Log avant redirection
        router.push("/403");
      }
    }
  }, [role, router]);
  

  if (isLoading) return <p>Loading...</p>; 

  // Afficher le contenu seulement si le rôle est administrateur
  return role === "ADMIN" ? <>{children}</> : null;
}
