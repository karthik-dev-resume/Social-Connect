"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import { toast } from "sonner";
import type { User, Post } from "@/lib/db/types";

export interface Stats {
  total_users: number;
  total_posts: number;
  active_today: number;
}

export type ActiveTab = "stats" | "users" | "posts";

export function useAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("stats");

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiRequest<Stats>("/api/admin/stats");
      setStats(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load stats";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await apiRequest<{ results: User[] }>("/api/admin/users");
      setUsers(data.results);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load users";
      toast.error(errorMessage);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await apiRequest<{ results: Post[] }>("/api/admin/posts");
      setPosts(data.results);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load posts";
      toast.error(errorMessage);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      await apiRequest(`/api/admin/users/${userId}/deactivate`, {
        method: "POST",
      });
      toast.success("User deactivated successfully");
      fetchUsers();
      fetchStats();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to deactivate user";
      toast.error(errorMessage);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to admin?"))
      return;

    try {
      await apiRequest(`/api/admin/users/${userId}/promote`, {
        method: "POST",
      });
      toast.success("User promoted to admin successfully");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to promote user";
      toast.error(errorMessage);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await apiRequest(`/api/admin/posts/${postId}`, { method: "DELETE" });
      toast.success("Post deleted successfully");
      fetchPosts();
      fetchStats();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete post";
      toast.error(errorMessage);
    }
  };

  return {
    stats,
    users,
    posts,
    loading,
    activeTab,
    setActiveTab,
    handleDeactivateUser,
    handlePromoteToAdmin,
    handleDeletePost,
  };
}

