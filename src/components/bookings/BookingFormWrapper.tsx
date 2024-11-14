'use client'

import dynamic from 'next/dynamic'
import { SafeListing, SafeUser } from '@/types'

const DynamicBookingForm = dynamic(() => import('./BookingForm'), {
  ssr: false,
  loading: () => <p>Loading form...</p>
})

export default function BookingFormWrapper({ users, listings }: { users: SafeUser[], listings: SafeListing[] }) {
  return <DynamicBookingForm users={users} listings={listings} />
}