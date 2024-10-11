import { SafeListing } from '@/src/types';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';


interface SearchResultsProps {
  results: SafeListing[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-600">Aucun résultat trouvé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {results.map((listing) => (
        <Link href={`/listings/${listing.id}`} key={listing.id} className="group">
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="relative h-64 w-full">
              <Image
                src={listing.imageSrc[0] || '/placeholder.jpg'}
                alt={listing.title}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{listing.title}</h2>

              <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
              <p className="text-lg font-bold text-blue-600 mb-2">{listing.price} {listing.currency}</p>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{listing.reviewAverage.toFixed(1)}</span>
                <span className="text-sm text-gray-500 ml-1">({listing.reviewCount} avis)</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}