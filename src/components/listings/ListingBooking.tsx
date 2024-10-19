"use client"

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../navbar/Button';

interface ListingBookingProps {
    price: number;
    dateRange: Range;
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    onSubmit: () => void;
    disabled?: boolean;
    disabledDates: Date[]
}

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
   <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
    <div className="flex flex-row items-center gap-1 p-4">
      <div className="text-2xl font-semibold">
      FRW {price}
      </div>
      <div className="font-light text-neutral-600">
        Day
      </div>
    </div>
    <hr />
    <Calendar
      value={dateRange}
      disabledDates={disabledDates}
      onChange={onChangeDate}
    />
    <hr />
    <div className="p-4">
      <Button 
        disabled={disabled} 
        label="Reserve" 
        onClick={onSubmit}
      />
    </div>
    <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
      <div>Total</div>
      <div> FRW {totalPrice}</div>
    </div>
   </div>
  )
}

export default ListingBooking