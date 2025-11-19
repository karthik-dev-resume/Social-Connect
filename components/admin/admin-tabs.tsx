"use client";

import { Button } from "@/components/ui/button";
import { Users, FileText, Activity } from "lucide-react";
import type { ActiveTab } from "./hooks/use-admin-dashboard";

interface AdminTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex space-x-2 mb-6">
      <Button
        variant={activeTab === "stats" ? "default" : "outline"}
        onClick={() => onTabChange("stats")}
      >
        <Activity className="mr-2 h-4 w-4" />
        Statistics
      </Button>
      <Button
        variant={activeTab === "users" ? "default" : "outline"}
        onClick={() => onTabChange("users")}
      >
        <Users className="mr-2 h-4 w-4" />
        Users
      </Button>
      <Button
        variant={activeTab === "posts" ? "default" : "outline"}
        onClick={() => onTabChange("posts")}
      >
        <FileText className="mr-2 h-4 w-4" />
        Posts
      </Button>
    </div>
  );
}

