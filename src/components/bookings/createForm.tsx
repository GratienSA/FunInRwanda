'use client'
import { CalendarIcon,  UserCircleIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { Button } from '../ui/button'
import { SafeListing, SafeUser } from '@/src/types'
import { createBooking, State } from '@/src/actions/getBookings'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BookingForm({ users, listings }: { users: SafeUser[], listings: SafeListing[] }) {
  const initialState: State = { message: null, errors: {} }
  const [state, formAction] = useFormState(createBooking, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'Booking created successfully') {
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 2000); 
    }
  }, [state.message, router])



  return (
    <form action={formAction}>
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

          <div id="user-error" aria-live="polite" aria-atomic="true">
            {state.errors?.userId &&
              state.errors.userId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
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

          <div id="listing-error" aria-live="polite" aria-atomic="true">
            {state.errors?.listingId &&
              state.errors.listingId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
            Start Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
                aria-describedby="startDate-error"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
            </div>
          </div>

          <div id="startDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.startDate &&
              state.errors.startDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
                aria-describedby="endDate-error"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
            </div>
          </div>

          <div id="endDate-error" aria-live="polite" aria-atomic="true">
            {state.errors?.endDate &&
              state.errors.endDate.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="mb-4">
          <label htmlFor="totalPrice" className="mb-2 block text-sm font-medium">
            Total Price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="totalPrice"
                name="totalPrice"
                type="number"
                step="0.01"
                className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
                aria-describedby="totalPrice-error"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">$</span>
            </div>
          </div>

          <div id="totalPrice-error" aria-live="polite" aria-atomic="true">
            {state.errors?.totalPrice &&
              state.errors.totalPrice.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/bookings">Cancel</Link>
        </Button>

        <Button type="submit">Create Booking</Button>
      </div>
    </form>
  )
}