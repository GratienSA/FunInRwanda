import FooterSection from '@/src/components/Fragments/FooterSection';
import React from 'react';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
     
      <main className="flex-grow flex items-center justify-center p-8 bg-gradient-to-br from-sky-400 to-blue-800">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full transform transition-all duration-300 hover:scale-105">
          {children}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

export default ProtectedLayout;