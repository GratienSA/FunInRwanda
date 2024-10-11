import React from 'react';
import Image from 'next/image';

interface Illustration3DProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export const Illustration3D: React.FC<Illustration3DProps> = ({ src, alt, priority = false }) => {
  return (
    <div className="w-full h-64 lg:h-auto lg:w-96 relative" aria-label={alt}>
      <Image 
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className="rounded-lg object-cover"
      />
    </div>
  );
}