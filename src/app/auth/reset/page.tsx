"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../components/navbar/Button";
import Input from "../../components/inputs/Input";
import Heading from "../../components/Heading";


// Define a schema for password reset
const ResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ResetPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
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
    setIsLoading(true);
    
    try {
       await resetPassword(data.email);
      
      toast.success("Password reset email sent. Please check your inbox.");
      router.push('/login'); 
    } catch (error) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Button
            disabled={isLoading}
            label={isLoading ? "Sending..." : "Send Reset Link"}
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
