
import HomeContent from "./HomeContent";
import getListings, { IListingsParams } from "../actions/getListings";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const listings = await getListings(searchParams);
  return <HomeContent listings={listings} />;
}