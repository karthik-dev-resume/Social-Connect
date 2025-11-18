"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.role === "admin") {
      // Prevent admins from accessing user routes - redirect to admin
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If admin tries to access user routes, show nothing (will redirect)
  if (user.role === "admin") {
    return null;
  }

  return <>{children}</>;
}
