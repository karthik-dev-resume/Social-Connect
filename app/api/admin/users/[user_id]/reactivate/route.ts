import {
  requireAdmin,
  type AuthenticatedRequest,
  type RouteContext,
} from "@/lib/middleware/auth";
import { getUserById, updateUser } from "@/lib/db/queries";
import type { User } from "@/lib/db/types";

async function handler(req: AuthenticatedRequest, context: RouteContext) {
  try {
    if (!context.params) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const resolvedParams =
      context.params instanceof Promise ? await context.params : context.params;
    const userId = resolvedParams.user_id;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already active
    if (user.is_active) {
      return Response.json(
        { error: "User is already active" },
        { status: 400 }
      );
    }

    const updatedUser = await updateUser(userId, { is_active: true });
    if (!updatedUser) {
      return Response.json(
        { error: "Failed to reactivate user" },
        { status: 500 }
      );
    }

    const { password_hash: _, ...userResponse } = updatedUser as User & {
      password_hash?: string;
    };

    return Response.json({
      message: "User reactivated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Admin reactivate user error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const POST = requireAdmin(handler);

