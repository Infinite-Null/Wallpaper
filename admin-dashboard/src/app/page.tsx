"use client";
import { verifyUser } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await verifyUser();
        router.replace("/home");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_e) {
        router.replace("/login");
      } finally {
        setIsVerifying(false);
      }
    };

    checkUser();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-24">
      <h1 className="text-4xl font-bold">
        {isVerifying ? "Please wait..." : "Redirecting..."}
      </h1>
      {isVerifying && (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      )}
    </main>
  );
}
