"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import type { User } from "@/lib/db/types";

interface AdminUsersSectionProps {
  users: User[];
  currentUserId?: string;
  onDeactivateUser: (userId: string, userName?: string) => void;
  onReactivateUser: (userId: string, userName?: string) => void;
  onPromoteToAdmin: (userId: string, userName?: string) => void;
}

export function AdminUsersSection({
  users,
  currentUserId,
  onDeactivateUser,
  onReactivateUser,
  onPromoteToAdmin,
}: AdminUsersSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Manage users and their accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base break-words">
                  {user.first_name} {user.last_name}
                  {user.role === "admin" && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 break-words mt-1">
                  <span className="block sm:inline">@{user.username}</span>
                  <span className="hidden sm:inline"> • </span>
                  <span className="block sm:inline break-all">
                    {user.email}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Role: {user.role} • Status:{" "}
                  {user.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                {user.is_active &&
                  user.id !== currentUserId &&
                  user.email !== "karthik.admin@vega.com" && (
                    <>
                      {user.role !== "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onPromoteToAdmin(
                              user.id,
                              `${user.first_name} ${user.last_name}`
                            )
                          }
                          className="w-full sm:w-auto"
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Promote</span>
                          <span className="sm:hidden">Promote to Admin</span>
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          onDeactivateUser(
                            user.id,
                            `${user.first_name} ${user.last_name}`
                          )
                        }
                        className="w-full sm:w-auto"
                      >
                        Deactivate
                      </Button>
                    </>
                  )}
                {!user.is_active && user.id !== currentUserId && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      onReactivateUser(
                        user.id,
                        `${user.first_name} ${user.last_name}`
                      )
                    }
                    className="w-full sm:w-auto"
                  >
                    Reactivate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
