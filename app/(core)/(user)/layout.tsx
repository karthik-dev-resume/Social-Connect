"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

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

  // Allow both regular users and admins to access user routes
  // Admins should be able to create/edit posts, comment, follow/unfollow, etc.
  return <>{children}</>;
}
