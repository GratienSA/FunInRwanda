"use client";

import { SessionProvider } from "next-auth/react";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar/Navbar";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import SearchModal from "../components/modals/SearchModal";
import ClientOnly from "../components/navbar/ClientOnly";
import BookingModal from "../components/modals/BookingModal";
import { ClientProviders } from "./ClientProviders";
import { Provider } from 'react-redux';
import store from "./redux/store"; 
import { useEffect, useState } from "react";

const font = Nunito({ 
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body className={font.className}>
        <SessionProvider>
          <Provider store={store}> 
            <ClientProviders>
              <ClientOnly>
                <ToasterProvider />
                {isClient && ( // Rendre uniquement si le composant est monté sur le client
                  <>
                    <SearchModal />
                    <BookingModal />
                    <LoginModal />
                    <RegisterModal />
                    <Navbar />
                  </>
                )}
              </ClientOnly>
              <div className="pb-20 pt-28 suppressHydrationWarning"> {/* Ajout d'un fallback */}
                {children}
              </div>
            </ClientProviders>
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}