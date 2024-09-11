import { z } from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string())
});


export const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .optional(),
  email: z
    .string()
    .email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"),
  image: z
    .string()
    .url("URL d'image invalide")
    .optional(),
});


export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
 
}


export const NewPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
});


export const ResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type NewPasswordSchema = z.infer<typeof NewPasswordSchema>;
export type ResetSchema = z.infer<typeof ResetSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;