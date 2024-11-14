"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { UrlObject } from 'url';

interface Breadcrumb {
  label: string;
  href: string; // Assurez-vous que ce soit une chaîne valide
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={cn("flex text-xl md:text-2xl")}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} aria-current={breadcrumb.active ? 'page' : undefined}>
            <Link href={breadcrumb.href as unknown as UrlObject}> {/* Utilisez un cast ici */}
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-3 inline-block">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}