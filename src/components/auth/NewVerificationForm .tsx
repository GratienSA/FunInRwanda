"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newVerification } from "@/src/actions/new-verification";


export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(true);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      setIsPending(false);
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
        } else if (data.error) {
          setError(data.error);
        } else if (data.info) {
          setSuccess(data.info); 
        }
      })
      .catch((error) => {
        setError("An unexpected error occurred");
      })
      .finally(() => {
        setIsPending(false);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {isPending && (
          <BeatLoader />
        )}
        {!isPending && success && (
          <FormSuccess message={success} />
        )}
        {!isPending && error && (
          <FormError message={error} />
        )}
      </div>
    </CardWrapper>
  );
};