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
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={activeTab === "stats" ? "default" : "outline"}
        onClick={() => onTabChange("stats")}
        className="flex-1 sm:flex-initial justify-center sm:justify-start min-w-[120px]"
      >
        <Activity className="mr-2 h-4 w-4 shrink-0" />
        <span>Statistics</span>
      </Button>
      <Button
        variant={activeTab === "users" ? "default" : "outline"}
        onClick={() => onTabChange("users")}
        className="flex-1 sm:flex-initial justify-center sm:justify-start min-w-[120px]"
      >
        <Users className="mr-2 h-4 w-4 shrink-0" />
        <span>Users</span>
      </Button>
      <Button
        variant={activeTab === "posts" ? "default" : "outline"}
        onClick={() => onTabChange("posts")}
        className="flex-1 sm:flex-initial justify-center sm:justify-start min-w-[120px]"
      >
        <FileText className="mr-2 h-4 w-4 shrink-0" />
        <span>Posts</span>
      </Button>
    </div>
  );
}
