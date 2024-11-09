import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'bson';

// Étendre PrismaClient pour inclure la méthode toObjectId
interface CustomPrismaClient extends PrismaClient {
  toObjectId: (id: string) => ObjectId;
}

// Créer une instance de PrismaClient avec la méthode toObjectId
const createPrismaClient = (): CustomPrismaClient => {
  const prisma = new PrismaClient() as CustomPrismaClient;
  prisma.toObjectId = (id: string) => new ObjectId(id);
  return prisma;
};

// Déclaration globale pour TypeScript
declare global {
  var prisma: CustomPrismaClient | undefined;
}

// Création ou réutilisation du client Prisma
const client = globalThis.prisma || createPrismaClient();

// En développement, on attache le client à l'objet global pour le hot-reloading
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;