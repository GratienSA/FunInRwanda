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


const font = Nunito({ 
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <SessionProvider>
          <ClientProviders>
            <ClientOnly>
              <ToasterProvider/>
              <SearchModal/>
              <BookingModal/>
              <LoginModal />
              <RegisterModal />
              <Navbar />
            </ClientOnly>
            <div className="pb-20 pt-28">
              {children}
            </div>
          </ClientProviders>
        </SessionProvider>
      </body>
    </html>
  );
}