"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { useProfile } from "./hooks/use-profile";
import { ProfileHeader } from "./profile-header";
import { ProfilePostsSection } from "./profile-posts-section";
import { Spinner } from "@/components/ui/spinner";

export function ProfileTemplate() {
  const params = useParams();
  const userId = params.user_id as string;
  const { user: currentUser } = useAuth();
  const { user, posts, isFollowing, loading, followLoading, handleFollow } =
    useProfile(userId, currentUser?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollow={handleFollow}
        />

        <ProfilePostsSection
          posts={posts}
          user={user}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
        />
      </div>
    </div>
  );
}

