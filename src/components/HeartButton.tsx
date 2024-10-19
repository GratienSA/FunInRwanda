"use client";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useFavorite from "../hooks/useFavarite";
import { SafeUser } from "../types";


interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({ 
  listingId,
  currentUser
}) => {
  const { toggleFavorite, hasFavorited } = useFavorite({
    listingId,
    currentUser
  });

  return (
    <div 
      onClick={toggleFavorite}
      className="
        relative
        hover:opacity-80
        transition
        cursor-pointer
      "
      aria-label={hasFavorited ? "Remove from favorites" : "Add to favorites"}
      role="button"
    >
      <AiOutlineHeart
        size={28}
        className="
          fill-white
          absolute
          -top-[2px]
          -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={
          hasFavorited ? 'fill-red-500' : 'fill-neutral-500/70'
        }
      />
    </div>
  );
};

export default HeartButton;