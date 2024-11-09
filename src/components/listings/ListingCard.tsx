"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FaStar } from "react-icons/fa";

import HeartButton from "../HeartButton";
import Button from "../navbar/Button";
import { SafeBooking, SafeListing, SafeUser } from "../../types";

// Définition de l'interface pour les props du composant
interface ListingCardProps {
  data: SafeListing;                           // Données de l'annonce
  booking?: SafeBooking;                       // Réservation optionnelle
  onAction?: (id: string) => void;             // Action principale optionnelle
  disabled?: boolean;                          // État désactivé optionnel
  actionLabel?: string;                        // Libellé de l'action principale
  actionId?: string;                           // ID de l'action
  currentUser?: SafeUser | null;               // Utilisateur actuel
  secondaryAction?: (id: string) => void;      // Action secondaire optionnelle
  secondaryActionLabel?: string;               // Libellé de l'action secondaire
  onClick?: () => Promise<void>;               // Fonction de clic optionnelle
}

// Définition du composant ListingCard
const ListingCard: React.FC<ListingCardProps> = ({
  data,
  booking,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const router = useRouter();

  // Gestion de l'action d'annulation
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  // Gestion de l'action secondaire
  const handleSecondaryAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      secondaryAction?.(actionId);
    },
    [disabled, secondaryAction, actionId]
  );

  // Calcul du prix (réservation ou prix de base)
  const price = useMemo(() => booking ? booking.totalPrice : data.price, [booking, data.price]);
  
  // Formatage du prix selon la locale française
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: data.currency,
    }).format(price);
  }, [price, data.currency]);

  // Limiter la longueur du titre
  const truncatedTitle = useMemo(() => {
    const maxLength = 40; // Limite de caractères pour le titre
    return data.title.length > maxLength ? `${data.title.substring(0, maxLength)}...` : data.title;
  }, [data.title]);
  return (
    <div 
      onClick={() => router.push(`/listings/${data.id}`)} 
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        {/* Section de l'image */}
        <div className="relative h-64 w-full">
          <Image
            src={data.imageSrc[0] || '/placeholder.jpg'}
            alt={data.title}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {/* Bouton de favori */}
          <div className="absolute top-3 right-3 z-10">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
          {/* Badge de réservation instantanée */}
          {data.isInstantBook && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              Réservation instantanée
            </span>
          )}
        </div>
        {/* Contenu de la carte */}
        <div className="p-4  flex flex-col flex-grow">
          <div className="flex-shrink-0 h-14"> {/* Hauteur fixe pour le titre */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{truncatedTitle}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{data.description}</p>
          {/* Section prix et évaluation */}
          <div className="flex justify-between items-end mt-4">
            <div className="text-lg font-bold text-blue-600">
              {formattedPrice}
              
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{data.reviewAverage.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({data.reviewCount})</span>
            </div>
          </div>
          {/* Boutons d'action */}
          <div className="flex gap-2 mt-4">
            {onAction && actionLabel && (
              <Button
                disabled={disabled}
                small
                label={actionLabel}
                onClick={handleCancel}
                className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              />
            )}
            {secondaryAction && secondaryActionLabel && (
              <Button
                disabled={disabled}
                small
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
                className="flex-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-300"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;