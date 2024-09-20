"use server";

import { Resend } from "resend";
import { RESEND_API_KEY, APP_URL } from '../../config';
// Vérification de la présence de la clé API
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in the environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Vérification de la présence de l'URL de l'application
if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("NEXT_PUBLIC_APP_URL is not defined in the environment variables");
}

const domain = process.env.NEXT_PUBLIC_APP_URL;
const fromEmail = "onboarding@resend.dev"; // Assurez-vous d'utiliser une adresse email vérifiée par Resend

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "2FA Code",
      html: `<p>Your 2FA code: ${token}</p>`,
    });

    if (error) {
      console.error("Error sending 2FA email:", error);
      throw new Error("Failed to send 2FA email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendTwoFactorTokenEmail:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });

    if (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
};