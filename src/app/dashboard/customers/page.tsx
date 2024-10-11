import Search from "@/src/components/navbar/Search";
import { Button } from "@/src/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ServerBooking from '@/src/components/bookings/ServerBooking';


export const metadata: Metadata = {
  title: 'Bookings',
};

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Customers with booking</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search />
        <Button asChild>
          <Link href="/dashboard/bookings/create">
            <span className="hidden md:block">Create Booking</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </Button>
      </div>
      <ServerBooking query={query} currentPage={currentPage} />
    </div>
  );
}