"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { useAdminDashboard } from "./hooks/use-admin-dashboard";
import { AdminTabs } from "./admin-tabs";
import { AdminStatsSection } from "./admin-stats-section";
import { AdminUsersSection } from "./admin-users-section";
import { AdminPostsSection } from "./admin-posts-section";
import { AdminConfirmationModal } from "./admin-confirmation-modal";
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
    handleReactivateUser,
    handlePromoteToAdmin,
    handleDeletePost,
    confirmationAction,
    actionLoading,
    executeAction,
    cancelAction,
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

        {activeTab === "stats" && stats && <AdminStatsSection stats={stats} />}

        {activeTab === "users" && (
          <AdminUsersSection
            users={users}
            currentUserId={currentUser?.id}
            onDeactivateUser={handleDeactivateUser}
            onReactivateUser={handleReactivateUser}
            onPromoteToAdmin={handlePromoteToAdmin}
          />
        )}

        {activeTab === "posts" && (
          <AdminPostsSection posts={posts} onDeletePost={handleDeletePost} />
        )}
      </div>

      <AdminConfirmationModal
        open={confirmationAction !== null}
        onOpenChange={(open) => !open && cancelAction()}
        title={
          confirmationAction?.type === "deactivate"
            ? "Deactivate User"
            : confirmationAction?.type === "reactivate"
            ? "Reactivate User"
            : confirmationAction?.type === "promote"
            ? "Promote to Admin"
            : "Delete Post"
        }
        description={
          confirmationAction?.type === "deactivate"
            ? `Are you sure you want to deactivate ${
                confirmationAction.userName || "this user"
              }? They will not be able to access their account.`
            : confirmationAction?.type === "reactivate"
            ? `Are you sure you want to reactivate ${
                confirmationAction.userName || "this user"
              }? They will be able to access their account again.`
            : confirmationAction?.type === "promote"
            ? `Are you sure you want to promote ${
                confirmationAction.userName || "this user"
              } to admin? They will have full administrative privileges.`
            : "Are you sure you want to delete this post? This action cannot be undone."
        }
        confirmText={
          confirmationAction?.type === "deactivate"
            ? "Deactivate"
            : confirmationAction?.type === "reactivate"
            ? "Reactivate"
            : confirmationAction?.type === "promote"
            ? "Promote"
            : "Delete"
        }
        variant={
          confirmationAction?.type === "deletePost" ||
          confirmationAction?.type === "deactivate"
            ? "destructive"
            : "default"
        }
        onConfirm={executeAction}
        loading={actionLoading}
      />
    </div>
  );
}
