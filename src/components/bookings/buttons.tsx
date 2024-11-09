import { PencilIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { deleteBooking } from '@/actions/getBookings'

export function UpdateBooking({ id }: { id: string }) {
  return (
    <Button variant="outline" asChild>
      <Link href={`/dashboard/bookings/${id}/edit`}>
        <PencilIcon className="w-5" />
      </Link>
    </Button>
  )
}

export function DeleteBooking({ id }: { id: string }) {
  const deleteBookingWithId = deleteBooking.bind(null, id)

  return (
    <form action={deleteBookingWithId}>
      <Button variant="outline" type="submit">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </form>
  )
}