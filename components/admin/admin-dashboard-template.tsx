"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { useAdminDashboard } from "./hooks/use-admin-dashboard";
import { AdminTabs } from "./admin-tabs";
import { AdminStatsSection } from "./admin-stats-section";
import { AdminUsersSection } from "./admin-users-section";
import { AdminPostsSection } from "./admin-posts-section";
import { Spinner } from "@/components/ui/spinner";

export function AdminDashboardTemplate() {
  const { user: currentUser } = useAuth();
  const {
    stats,
    users,
    posts,
    loading,
    activeTab,
    setActiveTab,
    handleDeactivateUser,
    handlePromoteToAdmin,
    handleDeletePost,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "stats" && stats && (
          <AdminStatsSection stats={stats} />
        )}

        {activeTab === "users" && (
          <AdminUsersSection
            users={users}
            currentUserId={currentUser?.id}
            onDeactivateUser={handleDeactivateUser}
            onPromoteToAdmin={handlePromoteToAdmin}
          />
        )}

        {activeTab === "posts" && (
          <AdminPostsSection posts={posts} onDeletePost={handleDeletePost} />
        )}
      </div>
    </div>
  );
}

