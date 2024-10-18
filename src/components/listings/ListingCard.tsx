"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FaStar } from "react-icons/fa";

import HeartButton from "../HeartButton";
import Button from "../navbar/Button";
import { SafeBooking, SafeListing, SafeUser } from "../../types";

interface ListingCardProps {
  data: SafeListing;
  booking?: SafeBooking;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  secondaryAction?: (id: string) => void;
  secondaryActionLabel?: string;
}

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

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const handleSecondaryAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      secondaryAction?.(actionId);
    },
    [disabled, secondaryAction, actionId]
  );

  const price = useMemo(() => booking ? booking.totalPrice : data.price, [booking, data.price]);
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: data.currency,
    }).format(price);
  }, [price, data.currency]);

  return (
    <div 
      onClick={() => router.push(`/listings/${data.id}`)} 
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="relative h-64 w-full">
          <Image
            src={data.imageSrc[0] || '/placeholder.jpg'}
            alt={data.title}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          <div className="absolute top-3 right-3 z-10">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
          {data.isInstantBook && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              Réservation instantanée
            </span>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{data.title}</h2>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{data.description}</p>
          <div className="flex justify-between items-end mt-4">
            <div className="text-lg font-bold text-blue-600">
              {formattedPrice}
              <span className="text-sm font-normal text-gray-600 ml-1">
                {!booking && "/par personne"}
              </span>
            </div>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{data.reviewAverage.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">({data.reviewCount})</span>
            </div>
          </div>
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