import { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "createdAt" | "upadatedAt" | "emailVerified"
> & {
  createdAt: string;
  upadatedAt: string;
  emailVerified: string | null;
};