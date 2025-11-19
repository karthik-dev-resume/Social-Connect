"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { useFeed } from "./hooks/use-feed";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus, UserStar } from "lucide-react";

export function FeedTemplate() {
  const { user, loading: authLoading } = useAuth();
  const { posts, loading, loadingMore, hasMore, observerTarget, fetchPosts } =
    useFeed();

  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts(true);
    }
  }, [authLoading, user, fetchPosts]);

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Create Post Button */}
        <CreatePost
          onPostCreated={() => {
            fetchPosts(true);
          }}
        />

        {/* Posts Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <UserStar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                No posts yet
              </h3>
              <p className="text-muted-foreground">
                Be the first to share something with the community!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-8">
                {loadingMore && <Spinner size="lg" />}
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No more posts to load</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
