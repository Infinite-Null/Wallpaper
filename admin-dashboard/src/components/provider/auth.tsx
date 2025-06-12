"use client";
import { verifyUser } from "@/api/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifyUser();
        setAuthenticated(true);
        if (pathname === "/login" || pathname === "/") {
          router.replace("/home");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setAuthenticated(false);
        if (pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-24">
        <h1 className="text-4xl font-bold">Please wait...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </main>
    );
  }

  if (authenticated && pathname === "/login") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-24">
        <h1 className="text-4xl font-bold">Redirecting you...</h1>
      </main>
    );
  }

  if (!authenticated && pathname !== "/login") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-24">
        <h1 className="text-4xl font-bold">Redirecting you...</h1>
      </main>
    );
  }

  return <>{children}</>;
}
