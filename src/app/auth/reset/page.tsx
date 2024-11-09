"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from '@auth0/nextjs-auth0/client';
import Button from "../../../components/navbar/Button";
import Input from "../../../components/inputs/Input";
import Heading from "../../../components/Heading";

// Define a schema for password reset
const ResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ResetPage = () => {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const { user, error, isLoading } = useUser();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof ResetSchema>> = async (data) => {
    setIsResetting(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      if (response.ok) {
        toast.success("Password reset email sent. Please check your inbox.");
        router.push('/login');
      } else {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) {
    router.push('/profile'); // Redirect to profile if user is already logged in
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <Heading 
          title="Reset Your Password"
          subtitle="Enter your email to receive a password reset link"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            id="email"
            label="Email"
            type="email"
            disabled={isResetting}
            register={register}
            errors={errors}
            required
          />
          <Button
            disabled={isResetting}
            label={isResetting ? "Sending..." : "Send Reset Link"}
            onClick={handleSubmit(onSubmit)}
          />
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResetPage;