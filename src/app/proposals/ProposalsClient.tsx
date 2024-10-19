'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { SafeListing, SafeUser } from '../../types';
import Container from '../../components/Container';
import Heading from '../../components/Heading';
import { FiEdit2, FiTrash2, FiUser } from 'react-icons/fi'; 
import Image from 'next/image';

// Définition des props du composant
interface ProposalsClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const ProposalsClient: React.FC<ProposalsClientProps> = ({
  listings,
}) => {
  const router = useRouter();

  // Fonction pour supprimer une annonce
  const onDelete = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/listings/${id}`);
      toast.success('Annonce supprimée');
      router.refresh();
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression');
    }
  }, [router]);

  // Fonction pour éditer une annonce
  const onEdit = useCallback((id: string) => {
    router.push(`/proposals/${id}/edit`);
  }, [router]);

  // Fonction pour naviguer vers la page de profil
  const onProfileClick = useCallback(() => {
    router.push('/profile');
  }, [router]);

  return (
    <Container>
      {/* En-tête avec titre et bouton de profil */}
      <div className="flex justify-between items-center mb-8">
        <Heading
          title="Mes Annonces"
          subtitle="Gérez vos propositions d'activités"
        />
        <button 
          onClick={onProfileClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
        >
          <FiUser className="mr-2" />
          Mon Profil
        </button>
      </div>

      {/* Grille des annonces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.length === 0 ? (
          // Message si aucune annonce n'est trouvée
          <div className="col-span-full text-center text-gray-500 py-10">
            Aucune annonce trouvée. Commencez par en créer une !
          </div>
        ) : (
          // Affichage des annonces
          listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              {/* Image de l'annonce */}
              <div className="relative h-48">
                <Image
                  src={listing.imageSrc[0] || '/placeholder.jpg'}
                  alt={listing.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              {/* Contenu de l'annonce */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-4 truncate">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-bold">{listing.price}€</span>
                  {/* Boutons d'édition et de suppression */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(listing.id)}
                      className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(listing.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
}

export default ProposalsClient;