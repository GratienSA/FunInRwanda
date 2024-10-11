"use client"

import Image from 'next/image'
import { DeleteBooking, UpdateBooking } from './buttons'
import BookingStatus from './status'
import { formatCurrency, formatDateToLocal, ReceivedBooking } from '@/src/types'

export default function BookingsTable({
  bookings,
  query,
  currentPage,
}: {
  bookings: ReceivedBooking[]
  query: string
  currentPage: number
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg p-2 md:pt-0">
          <div className="md:hidden">
            {bookings?.map((booking) => (
              <div key={booking.id} className="mb-2 w-full rounded-md p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={booking.user.image || '/default-avatar.png'}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${booking.user.name}'s profile picture`}
                      />
                      <p>{booking.user.name}</p>
                    </div>
                    <p className="text-sm text-muted">{booking.user.email}</p>
                  </div>
                  <BookingStatus status={booking.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <p>
                      {formatDateToLocal(booking.startDate?.toISOString())} - 
                      {formatDateToLocal(booking.endDate?.toISOString())}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateBooking id={booking.id} />
                    <DeleteBooking id={booking.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <table className="hidden min-w-full md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Listing
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Check-in
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Check-out
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking) => (
                <tr
                  key={booking.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={booking.user.image || '/default-avatar.png'}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${booking.user.name}'s profile picture`}
                      />
                      <p>{booking.user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.listing.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(booking.startDate?.toISOString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(booking.endDate?.toISOString())}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(booking.totalPrice)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <BookingStatus status={booking.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBooking id={booking.id} />
                      <DeleteBooking id={booking.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}