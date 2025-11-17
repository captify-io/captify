"use client";

import React, { useMemo } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import {
  CaptifyProvider,
  CaptifyLayout,
} from "@captify-io/base";
import { WorkspaceSwitcher } from "@captify-io/workspace/client";
import { config } from "../config";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Memoize config to prevent re-creating on every render
  const memoizedConfig = useMemo(() => config, []);

  // Check if we're on an auth page (signin, signout, error, callback)
  const isAuthPage = typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/auth/") ||
     window.location.pathname.startsWith("/api/auth/"));

  // Skip auth check for auth pages to prevent infinite loop
  if (isAuthPage) {
    return <>{children}</>;
  }

  // If no session or token refresh error, redirect to sign-in
  if (
    status === "unauthenticated" ||
    (!session?.user && status !== "loading") ||
    (session as any)?.error === "RefreshAccessTokenError"
  ) {
    if (typeof window !== "undefined") {
      // Clear storage and redirect to sign-in
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.href = "/auth/signin";
    }
    return null;
  }

  // If loading, show nothing (brief flash only)
  if (status === "loading") {
    return null;
  }

  // Render with CaptifyLayout
  return (
    <CaptifyProvider session={session}>
      <CaptifyLayout
        config={memoizedConfig}
        session={session}
        workspaceSwitcher={<WorkspaceSwitcher />}
      >
        {children}
      </CaptifyLayout>
    </CaptifyProvider>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}
