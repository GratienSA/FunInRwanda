import { BanknoteIcon, ClockIcon, CalendarIcon, UsersIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { fetchCardData } from '@/src/actions/getBookings'
import { formatCurrency } from '@/src/types'

const iconMap = {
  collected: BanknoteIcon,
  customers: UsersIcon,
  pending: ClockIcon,
  bookings: CalendarIcon,
}


export default async function StatCardsWrapper() {
  try {
    const data = await fetchCardData();

    return (
      <>
        <StatCard
          title="Collected"
          value={formatCurrency(data.totalPaidBookings)}
          type="collected"
        />
        <StatCard
          title="Pending"
          value={formatCurrency(data.totalPendingBookings)}
          type="pending"
        />
        <StatCard
          title="Total Bookings"
          value={data.numberOfBookings}
          type="bookings"
        />
        <StatCard
          title="Total Customers"
          value={data.numberOfCustomers}
          type="customers"
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return <div>Error loading booking statistics</div>;
  }
}


export function StatCard({
  title,
  value,
  type,
}: {
  title: string
  value: number | string
  type: 'bookings' | 'customers' | 'pending' | 'collected'
}) {
  const Icon = iconMap[type]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 space-x-3">
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        <h3 className="text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="truncate rounded-xl p-4 text-2xl font-semibold">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
