import getCurrentUser from "../actions/getCurrentUser"
import getFavoriteListings from "../actions/getFavoriteListings"
import EmptyState from "../components/EmptyState"
import ClientOnly from "../components/navbar/ClientOnly"
import FavoritesClient from "./FavoritesClient"
import { SafeListing, SafeUser } from "../types" 


const convertToSafeListing = (listing: any): SafeListing => ({
  ...listing,
  createdAt: listing.createdAt.toISOString(),
  updatedAt: listing.updatedAt.toISOString(),
  user: {
    
    ...listing.user,
    createdAt: listing.user.createdAt.toISOString(),
    updatedAt: listing.user.updatedAt.toISOString(),
    emailVerified: listing.user.emailVerified?.toISOString() || null,
  },
  bookings: [], 
  reviews: [], 
})

const convertToSafeUser = (user: any): SafeUser | null => {
  if (!user) return null;
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified?.toISOString() || null,
  }
}

const ListingPage = async () => {
    const rawListings = await getFavoriteListings()
    const currentUserRaw = await getCurrentUser()

    const listings: SafeListing[] = rawListings.map(convertToSafeListing)
    const currentUser = convertToSafeUser(currentUserRaw)

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listings."
                />
            </ClientOnly>
        )
    } 
    
    return (
        <ClientOnly>
            <FavoritesClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ListingPage