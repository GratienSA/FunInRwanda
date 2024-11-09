import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return undefined;

  console.log("Session:", session); // Log pour vérifier la session

  return session?.user?.role || null; // Retourner le rôle
};
