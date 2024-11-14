"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Route } from "next";


interface BackButtonProps {
  href: string;
  label: string;
};

export const BackButton = ({
  href,
  label,
}: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full"
      size="sm"
      asChild
    >
      <Link href={href as unknown as Route}>
  {label}
</Link>
    </Button>
  );
};