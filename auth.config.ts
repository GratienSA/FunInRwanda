import bcrypt from 'bcrypt';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { LoginSchema } from './src/schemas';
import { getUserByEmail } from './src/data/user';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Vérifiez si l'utilisateur existe et récupérez ses informations
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; 
        token.isOAuth = false;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajoutez les informations du token à la session
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string; 
        session.user.isOAuth = token.isOAuth as boolean;
        
        console.log("Session user:", session.user);
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Vérifiez les informations d'identification de l'utilisateur
        if (!credentials?.email || !credentials?.password) return null;

        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.hashedPassword || !user.role) return null;

          const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

          if (passwordsMatch) {
            // Retournez l'utilisateur, y compris le rôle
            return {
              ...user,
              isOAuth: false,
            };
          }
        }

        return null;
      },
    }),
  ],
};

export default authConfig;
