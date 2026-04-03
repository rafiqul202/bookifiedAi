"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";

export function ClerkAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider ui={ui}>{children}</ClerkProvider>;
}
