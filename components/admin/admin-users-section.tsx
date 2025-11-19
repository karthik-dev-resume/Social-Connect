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
  onDeactivateUser: (userId: string) => void;
  onPromoteToAdmin: (userId: string) => void;
}

export function AdminUsersSection({
  users,
  currentUserId,
  onDeactivateUser,
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
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-semibold">
                  {user.first_name} {user.last_name}
                  {user.role === "admin" && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  @{user.username} • {user.email}
                </p>
                <p className="text-xs text-gray-400">
                  Role: {user.role} • Status:{" "}
                  {user.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                {user.is_active && user.id !== currentUserId && (
                  <>
                    {user.role !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPromoteToAdmin(user.id)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Promote
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeactivateUser(user.id)}
                    >
                      Deactivate
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

