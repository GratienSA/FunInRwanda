"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/src/schemas";
import { register } from "@/src/actions/register";
import { CardWrapper } from "./card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";

interface RegisterFormProps {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onClose }) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  useEffect(() => {
    if (form.formState.isDirty) {
      setError("");
      setSuccess("");
    }
  }, [form.formState.isDirty]);

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.success) {
            setSuccess(data.message);
            if (data.userId) {
              onSuccess?.(data.userId);
            }
            router.push("/");
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto"
        >
          <div className="space-y-4">
            {["name", "email", "password"].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as "name" | "email" | "password"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder={fieldName === "name" ? "John Doe" : fieldName === "email" ? "john.doe@example.com" : "******"}
                        type={fieldName === "password" ? "password" : "text"}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition duration-200"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            {isPending ? "Creating..." : "Create an account"}
          </Button>
        </form>
      </Form>
      {onClose && (
        <Button onClick={onClose} className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200">
          Close
        </Button>
      )}
    </CardWrapper>
  );
}