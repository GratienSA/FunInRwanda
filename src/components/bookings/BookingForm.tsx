'use client'

import { CalendarIcon, UserCircleIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { SafeListing, SafeUser } from '@/types';
import { createBooking, State } from '@/actions/getBookings';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ users, listings }: { users: SafeUser[], listings: SafeListing[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'Booking created successfully') {
      const timer = setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 2000);
      return () => clearTimeout(timer); 
    }
  }, [state.message, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Create a new FormData object from the form
    const formData = new FormData(e.currentTarget);

    try {
        // Pass both prevState and formData to createBooking
        const response = await createBooking(state, formData); // Pass current state as prevState
        setState({ message: response.message, errors: response.errors || {} });
    } catch (error) {
        console.error("Error creating booking:", error);
        setState({ message: "An error occurred while creating the booking.", errors: {} });
    } finally {
        setIsLoading(false);
    }
};
  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md p-4 md:p-6">
        {/* User Selection */}
        <div className="mb-4">
          <label htmlFor="user" className="mb-2 block text-sm font-medium">
            Choose user
          </label>
          <div className="relative">
            <select
              id="user"
              name="userId"
              className="peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2"
              defaultValue=""
              aria-describedby="user-error"
              required
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          {state.errors?.userId && (
            <div id="user-error" aria-live="polite" aria-atomic="true">
              {state.errors.userId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Listing Selection */}
        <div className="mb-4">
          <label htmlFor="listing" className="mb-2 block text-sm font-medium">
            Choose listing
          </label>
          <div className="relative">
            <select
              id="listing"
              name="listingId"
              className="peer block w-full cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2"
              defaultValue=""
              aria-describedby="listing-error"
              required
            >
              <option value="" disabled>
                Select a listing
              </option>
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title}
                </option>
              ))}
            </select>
            <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          {state.errors?.listingId && (
            <div id="listing-error" aria-live="polite" aria-atomic="true">
              {state.errors.listingId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
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
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
            aria-describedby="startDate-error"
            required
          />
          {state.errors?.startDate && (
            <div id="startDate-error" aria-live="polite" aria-atomic="true">
              {state.errors.startDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
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
            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
            aria-describedby="endDate-error"
            required
          />
          {state.errors?.endDate && (
            <div id="endDate-error" aria-live="polite" aria-atomic="true">
              {state.errors.endDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          )}
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
            min={0}
            className={`peer block w-full rounded-md border py-2 pl-10 text-sm outline`}
            aria-describedby={state.errors?.totalPrice ? "totalPrice-error" : undefined}
            required
          />
          <span className={`pointer-events-none absolute left-[0.75rem] top-[50%] -translate-y-[50%]`}>$</span>

          {state.errors?.totalPrice && (
            <div id="totalPrice-error" aria-live='polite' aria-atomic='true'>
              {state.errors.totalPrice.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Message Display */}
        {state.message && (
          <div aria-live='polite' aria-atomic='true'>
            <p className={`mt-2 ${state.message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {state.message}
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className='mt-6 flex justify-end gap-x-[16px]'>
        <Button variant='outline' asChild>
          <Link href='/dashboard/bookings'>Cancel</Link>
        </Button>

        {/* Submit Button with Loading State */}
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Booking'}
        </Button>
      </div>
    </form>
  );
}