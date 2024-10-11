'use client'

import {
  CalendarIcon,
  UserCircleIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { Button } from '../ui/button'
import { State, updateBooking } from '@/src/actions/getBookings'
import { ReceivedBooking, SafeListing, SafeUser } from '@/src/types'

interface EditBookingFormProps {
  booking: ReceivedBooking;
  users: SafeUser[];
  listings: SafeListing[];
}

export default function EditBookingForm({ booking, users, listings }: EditBookingFormProps) {
  const initialState: State = { message: null, errors: {} }
  const updateBookingWithId = updateBooking.bind(null, booking.id)
  const [state, formAction] = useFormState(updateBookingWithId, initialState)

  return (
    <form action={formAction}>
      <div className="rounded-md p-4 md:p-6">
        {/* User Selection */}
        <div className="mb-4">
          <label htmlFor="userId" className="mb-2 block text-sm font-medium">
            Choose user
          </label>
          <div className="relative">
            <select
              id="userId"
              name="userId"
              className="peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2"
              defaultValue={booking.userId}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || ''}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
        </div>

        {/* Listing Selection */}
        <div className="mb-4">
          <label htmlFor="listingId" className="mb-2 block text-sm font-medium">
            Choose listing
          </label>
          <div className="relative">
            <select
              id="listingId"
              name="listingId"
              className="peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2"
              defaultValue={booking.listingId}
            >
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title}
                </option>
              ))}
            </select>
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={
              booking.startDate instanceof Date 
                ? booking.startDate.toISOString().split('T')[0] 
                : booking.startDate || ''
            }
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={
              booking.endDate instanceof Date 
                ? booking.endDate.toISOString().split('T')[0] 
                : booking.endDate || ''
            }
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
          />
        </div>

        {/* Total Price */}
        <div className="mb-4">
          <label htmlFor="totalPrice" className="mb-2 block text-sm font-medium">
            Total Price
          </label>
          <input
            id="totalPrice"
            name="totalPrice"
            type="number"
            step="0.01"
            defaultValue={booking.totalPrice}
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
          />
        </div>

        {state.message && <p className="text-red-500 text-sm mt-2">{state.message}</p>}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="ghost">
          <Link href="/dashboard/bookings">Cancel</Link>
        </Button>

        <Button type="submit">Update Booking</Button>
      </div>
    </form>
  )
}