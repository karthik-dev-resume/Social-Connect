"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import { toast } from "sonner";
import type { User, Post, UserStats } from "@/lib/db/types";

type UserWithStats = User & UserStats;

export function useProfile(userId: string, currentUserId?: string) {
  const [user, setUser] = useState<UserWithStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [userData, postsData] = await Promise.all([
        apiRequest<UserWithStats>(`/api/users/${userId}`),
        apiRequest<{ results: Post[] }>(`/api/posts?author_id=${userId}`),
      ]);

      setUser(userData);
      setPosts(postsData.results);

      // Check if current user follows this user
      if (currentUserId && currentUserId !== userId) {
        try {
          const followStatus = await apiRequest<{ isFollowing: boolean }>(
            `/api/users/${userId}/follow`
          );
          setIsFollowing(followStatus.isFollowing);
        } catch (error) {
          setIsFollowing(false);
        }
      } else {
        setIsFollowing(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await apiRequest(`/api/users/${userId}/follow`, { method: "DELETE" });
        setIsFollowing(false);
        setUser((prev) =>
          prev
            ? {
                ...prev,
                followers_count: Math.max(0, (prev.followers_count || 0) - 1),
              }
            : null
        );
        toast.success("Unfollowed user");
        try {
          const postsData = await apiRequest<{ results: Post[] }>(
            `/api/posts?author_id=${userId}`
          );
          setPosts(postsData.results);
        } catch {
          setPosts([]);
        }
      } else {
        await apiRequest(`/api/users/${userId}/follow`, { method: "POST" });
        setIsFollowing(true);
        setUser((prev) =>
          prev ? { ...prev, followers_count: (prev.followers_count || 0) + 1 } : null
        );
        toast.success("Following user");
        try {
          const postsData = await apiRequest<{ results: Post[] }>(
            `/api/posts?author_id=${userId}`
          );
          setPosts(postsData.results);
        } catch {
          // Silently fail
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to follow/unfollow user";
      toast.error(errorMessage);
      // Revert optimistic update on error
      if (isFollowing) {
        setUser((prev) =>
          prev ? { ...prev, followers_count: (prev.followers_count || 0) + 1 } : null
        );
      } else {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                followers_count: Math.max(0, (prev.followers_count || 0) - 1),
              }
            : null
        );
      }
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, currentUserId]);

  return {
    user,
    posts,
    isFollowing,
    loading,
    followLoading,
    handleFollow,
  };
}

