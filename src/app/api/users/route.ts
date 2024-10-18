import { NextResponse } from 'next/server';

interface User {
  id: number;
  name: string;
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère la liste des utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
export async function GET() {
  const users: User[] = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
  return NextResponse.json(users);
}