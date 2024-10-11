"use client";

import { useState, useEffect } from 'react';
import RevenueChart from './RevenueChart';
import { Card, CardContent, CardHeader } from '../ui/card';
import { fetchCardData } from '@/src/actions/getBookings';

type RevenueData = {
  month: string;
  revenue: number;
}[];

export default function RevenueChartWrapper() {
  const [revenueData, setRevenueData] = useState<RevenueData>([]);

  useEffect(() => {
    async function getData() {
      const cardData = await fetchCardData();
      setRevenueData([
        { month: 'Current Month', revenue: cardData.totalPaidBookings },
      ]);
    }
    getData();
  }, []);

  return (
    <Card className="w-full md:col-span-4">
      <CardHeader>
        <h2 className="mb-4 text-xl md:text-2xl">
          Recent Revenue
        </h2>
      </CardHeader>
      <CardContent className="p-0">
        <RevenueChart revenue={revenueData} />
      </CardContent>
    </Card>
  );
}
