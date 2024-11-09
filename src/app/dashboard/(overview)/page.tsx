"use client"
import LatestBookings from '@/components/dashboard/LatestBookings'
import RevenueChartWrapper from '@/components/dashboard/RevenueChartWrapper'
import StatCardsWrapper from '@/components/dashboard/StatCardsWrapper'
import { CardsSkeleton, LatestBookingsSkeleton, RevenueChartSkeleton } from '@/components/Elements/skeletons'
import { Suspense } from 'react'

export default function Page() {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <StatCardsWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChartWrapper />
        </Suspense>
        <Suspense fallback={<LatestBookingsSkeleton />}>
          <LatestBookings />
        </Suspense>
      </div>
    </main>
  )
}