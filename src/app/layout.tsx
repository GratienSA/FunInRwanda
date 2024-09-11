import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/navbar/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import ToasterProvider from "./providers/ToasterProvider";
// import getCurrentUser from "./actions/getCurrentUser";
import BookingModal from "./components/modals/BookingModal";
import SearchModal from "./components/modals/SearchModal";
import { SessionProvider } from "next-auth/react";
import {auth} from "@/src/auth"

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FunInRwanda",
  description: "Discover thrilling activities and unforgettable experiences across Rwanda, tailored just for you!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const currentUser = await getCurrentUser();
  const session = await auth();

  return (
    <SessionProvider>
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <LoginModal />
          <BookingModal />
          <SearchModal />
          <Navbar />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}

        </div>
        
      </body>
    </html>
    </SessionProvider>
  );
}
