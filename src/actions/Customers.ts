
import prismadb from '../lib/prismadb'
import { formatCurrency } from '../types'

export async function fetchCustomers() {
  try {
    const data = await prismadb.user.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    return data
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch all customers.')
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await prismadb.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        bookings: {
          select: {
            totalPrice: true,
            status: true,
          },
        },
      },
    })

    return data.map((user) => {
      const totalBookings = user.bookings.length
      const totalPending = user.bookings
        .filter((booking) => booking.status === 'pending')
        .reduce((sum, booking) => sum + booking.totalPrice, 0)
      const totalPaid = user.bookings
        .filter((booking) => booking.status === 'paid')
        .reduce((sum, booking) => sum + booking.totalPrice, 0)

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image_url: user.profileImage,
        total_bookings: totalBookings,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      }
    })
  } catch (err) {
    console.error('Database Error:', err)
    throw new Error('Failed to fetch filtered customers.')
  }
}