// import { getServerSession } from 'next-auth/next';
// import prisma from '../libs/prismadb';
// import { authOptions } from '@/auth';


// export async function getSession() {
//   return await getServerSession(authOptions);
// }

// export default async function getCurrentUser() {
//   try {
//     const session = await getSession();
//     console.log("Session:", session); 

//     if (!session?.user?.email) {
//       console.log("No user email in session");
//       return null;
//     }

//     const currentUser = await prisma.user.findUnique({
//       where: {
//         email: session.user.email,
//       },
//     });

//     console.log("Current user from database:", currentUser); 

//     if (!currentUser) {
//       console.log("No user found in database");
//       return null;
//     }

//     return {
//       ...currentUser,
//       createdAt: currentUser.createdAt.toISOString(),
//       updatedAt: currentUser.updatedAt.toISOString(),
//       emailVerified: currentUser.emailVerified?.toISOString() || null,
//     };

//   } catch (error) {
//     console.error("Error in getCurrentUser:", error);
//     return null;
//   }
// }