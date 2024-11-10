import { NextResponse } from 'next/server';
import { ManagementClient } from 'auth0';

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await auth0.tickets.changePassword({
      connection_id: process.env.AUTH0_DB_CONNECTION_ID!,
      email: email,
      result_url: `${process.env.AUTH0_BASE_URL}/login`,
    });

    return NextResponse.json({ message: 'Password reset email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json({ error: 'Failed to send password reset email' }, { status: 500 });
  }
}