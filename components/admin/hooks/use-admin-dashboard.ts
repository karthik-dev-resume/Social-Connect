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

export type ConfirmationAction = 
  | { type: "deactivate"; userId: string; userName?: string }
  | { type: "reactivate"; userId: string; userName?: string }
  | { type: "promote"; userId: string; userName?: string }
  | { type: "deletePost"; postId: string };

export function useAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("stats");
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleDeactivateUser = (userId: string, userName?: string) => {
    setConfirmationAction({ type: "deactivate", userId, userName });
  };

  const handleReactivateUser = (userId: string, userName?: string) => {
    setConfirmationAction({ type: "reactivate", userId, userName });
  };

  const handlePromoteToAdmin = (userId: string, userName?: string) => {
    setConfirmationAction({ type: "promote", userId, userName });
  };

  const handleDeletePost = (postId: string) => {
    setConfirmationAction({ type: "deletePost", postId });
  };

  const executeAction = async () => {
    if (!confirmationAction) return;

    setActionLoading(true);
    try {
      if (confirmationAction.type === "deactivate") {
        await apiRequest(`/api/admin/users/${confirmationAction.userId}/deactivate`, {
          method: "POST",
        });
        toast.success("User deactivated successfully");
        fetchUsers();
        fetchStats();
      } else if (confirmationAction.type === "reactivate") {
        await apiRequest(`/api/admin/users/${confirmationAction.userId}/reactivate`, {
          method: "POST",
        });
        toast.success("User reactivated successfully");
        fetchUsers();
        fetchStats();
      } else if (confirmationAction.type === "promote") {
        await apiRequest(`/api/admin/users/${confirmationAction.userId}/promote`, {
          method: "POST",
        });
        toast.success("User promoted to admin successfully");
        fetchUsers();
      } else if (confirmationAction.type === "deletePost") {
        await apiRequest(`/api/admin/posts/${confirmationAction.postId}`, {
          method: "DELETE",
        });
        toast.success("Post deleted successfully");
        fetchPosts();
        fetchStats();
      }
      setConfirmationAction(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to perform action";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAction = () => {
    setConfirmationAction(null);
  };

  return {
    stats,
    users,
    posts,
    loading,
    activeTab,
    setActiveTab,
    handleDeactivateUser,
    handleReactivateUser,
    handlePromoteToAdmin,
    handleDeletePost,
    confirmationAction,
    actionLoading,
    executeAction,
    cancelAction,
  };
}

