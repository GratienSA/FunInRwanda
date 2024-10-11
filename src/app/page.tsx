import HomeContent from "./HomeContent";
import getListings, { IListingsParams } from "../actions/getListings";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const response = await getListings(searchParams);
  
  console.log('Response from getListings:', response);
  
  const listings = response.listings;
  const totalListings = response.totalCount;

  if (!Array.isArray(listings)) {
    console.error('getListings did not return an array:', listings);
    return <HomeContent listings={[]} totalListings={0} />;
  }

  return <HomeContent listings={listings} totalListings={totalListings} />;
}