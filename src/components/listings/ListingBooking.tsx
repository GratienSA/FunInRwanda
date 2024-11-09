"use client"

// Importations nécessaires
import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../navbar/Button';

// Définition de l'interface pour les props du composant
interface ListingBookingProps {
    price: number;           // Prix par jour
    dateRange: Range;        // Plage de dates sélectionnée
    totalPrice: number;      // Prix total de la réservation
    onChangeDate: (value: Range) => void;  // Fonction appelée lors du changement de dates
    onSubmit: () => void;    // Fonction appelée lors de la soumission
    disabled?: boolean;      // État désactivé du bouton (optionnel)
    disabledDates: Date[]    // Dates non disponibles
}

// Définition du composant fonctionnel avec typage des props
const ListingBooking: React.FC<ListingBookingProps> = ({
    price,
    dateRange,
    totalPrice,
    onChangeDate,
    onSubmit,
    disabled,
    disabledDates
}) => {
  return (
   // Container principal
   <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
    {/* Affichage du prix par jour */}
    <div className="flex flex-row items-center gap-1 p-4">
      <div className="text-2xl font-semibold">
      {price} € 
      </div>
      <div className="font-light text-neutral-600">
         /Jour
      </div>
    </div>
    <hr />
    {/* Composant Calendrier pour la sélection des dates */}
    <Calendar
      value={dateRange}
      disabledDates={disabledDates}
      onChange={onChangeDate}
    />
    <hr />
    {/* Bouton de réservation */}
    <div className="p-4">
      <Button 
        disabled={disabled} 
        label="Reserver" 
        onClick={onSubmit}
      />
    </div>
    {/* Affichage du prix total */}
    <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
      <div>Total</div>
      <div> {totalPrice}€ </div>
    </div>
   </div>
  )
}

export default ListingBooking