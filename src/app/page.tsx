import HomeContent from "./HomeContent";
import getListings, { IListingsParams } from "../actions/getListings";

// Définition de l'interface pour les props du composant Home
interface HomeProps {
  searchParams: IListingsParams;
}

// Composant Home principal (fonction asynchrone)
export default async function Home({ searchParams }: HomeProps) {
  // Appel à la fonction getListings pour récupérer les données
  const response = await getListings(searchParams);
  
  // Log de la réponse pour le débogage
  console.log('Response from getListings:', response);
  
  // Extraction des listings et du nombre total de la réponse
  const listings = response.listings;
  const totalListings = response.totalCount;

  // Vérification que listings est bien un tableau
  if (!Array.isArray(listings)) {
    // Log d'erreur si listings n'est pas un tableau
    console.error('getListings did not return an array:', listings);
    // Rendu du composant HomeContent avec des valeurs par défaut
    return <HomeContent listings={[]} totalListings={0} />;
  }

  // Rendu du composant HomeContent avec les données récupérées
  return <HomeContent listings={listings} totalListings={totalListings} />;
}