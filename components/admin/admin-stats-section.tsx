import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Stats } from "./hooks/use-admin-dashboard";

interface AdminStatsSectionProps {
  stats: Stats;
}

export function AdminStatsSection({ stats }: AdminStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.total_users}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.total_posts}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.active_today}</p>
        </CardContent>
      </Card>
    </div>
  );
}

