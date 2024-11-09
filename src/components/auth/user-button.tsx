"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "./logout-button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { SafeUser } from "@/types"; // Assurez-vous que ce chemin d'importation est correct

export const UserButton = () => {
  const { user, isLoading } = useCurrentUser();

  const getUserImage = (user: SafeUser | null): string => {
    if (user && typeof user === 'object') {
      return user.profileImage || ""; 
    }
    return "";
  };

  const userImage = getUserImage(user);

  if (isLoading) {
    return <div>Loading...</div>; // Ou un composant de chargement
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={userImage} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}