"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../components/navbar/Button";
import Input from "../../components/inputs/Input";
import Heading from "../../components/Heading";
import { NewPasswordSchema } from "../../schemas";

import { NewPassword } from "../../actions/new-password";

const NewPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const token = searchParams.get('token');

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
   
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof NewPasswordSchema>> = async (data) => {
    setIsLoading(true);
    
    try {
      if (!token) {
        throw new Error("Missing reset token");
      }
      
      // Utilisez la fonction NewPassword importée
      const result = await NewPassword(data, token);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.push('/login');
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <Heading 
          title="Set New Password"
          subtitle="Enter your new password"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            id="password"
            label="New Password"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Button
            disabled={isLoading}
            label={isLoading ? "Resetting..." : "Reset Password"}
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

export default NewPasswordPage;