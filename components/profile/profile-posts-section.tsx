"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/post-card";
import type { Post, User } from "@/lib/db/types";

interface ProfilePostsSectionProps {
  posts: Post[];
  user: User | null;
  isOwnProfile: boolean;
  isFollowing: boolean;
}

export function ProfilePostsSection({
  posts,
  user,
  isOwnProfile,
  isFollowing,
}: ProfilePostsSectionProps) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          {user?.profile_visibility === "private" &&
          !isOwnProfile &&
          !isFollowing ? (
            <div className="space-y-2">
              <p className="font-semibold">This account is private</p>
              <p className="text-sm">Follow this account to see their posts</p>
            </div>
          ) : user?.profile_visibility === "followers_only" &&
            !isOwnProfile &&
            !isFollowing ? (
            <div className="space-y-2">
              <p className="font-semibold">
                This account&apos;s posts are only visible to followers
              </p>
              <p className="text-sm">Follow this account to see their posts</p>
            </div>
          ) : (
            "No posts yet"
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

