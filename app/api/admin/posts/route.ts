import { requireAdmin, type AuthenticatedRequest } from "@/lib/middleware/auth";
import { listPosts } from "@/lib/db/queries";

async function handler(req: AuthenticatedRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await listPosts(limit, offset);

    return Response.json({
      results: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Admin list posts error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = requireAdmin(handler);
