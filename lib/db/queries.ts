import { createAdminClient } from "@/lib/supabase/admin";
import type {
  User,
  Admin,
  Post,
  Follow,
  Like,
  Comment,
  UserStats,
} from "./types";

function getSupabase() {
  return createAdminClient();
}

// User Queries
export async function getUserById(userId: string): Promise<User | null> {
  const supabase = getSupabase();
  
  // First try users table
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    // If not found in users, try admins table
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("id", userId)
      .single();

    if (adminError || !adminData) {
      return null;
    }

    // Convert admin to user format
    return {
      id: adminData.id,
      email: adminData.email,
      username: adminData.username,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      role: 'admin',
      profile_visibility: 'public',
      is_active: adminData.is_active,
      is_verified: true,
      last_login: adminData.last_login,
      created_at: adminData.created_at,
      updated_at: adminData.updated_at,
    } as User;
  }
  
  return data as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data as User;
}

// Admin Queries
export async function getAdminByUsername(
  username: string
): Promise<Admin | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data as Admin;
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return null;
  return data as Admin;
}

export async function updateAdmin(
  adminId: string,
  updates: Partial<Admin>
): Promise<Admin | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("admins")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", adminId)
    .select()
    .single();

  if (error || !data) return null;
  return data as Admin;
}

export async function createUser(userData: {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password_hash: string;
}): Promise<User | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .insert({
      ...userData,
      role: "user",
      profile_visibility: "public",
      is_active: true,
      is_verified: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", JSON.stringify(error, null, 2));
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    // Re-throw the error so we can see it in the API response
    throw new Error(
      `Database error: ${error.message}${error.hint ? ` - ${error.hint}` : ""}${
        error.code ? ` (Code: ${error.code})` : ""
      }`
    );
  }
  if (!data) {
    console.error("No data returned from createUser insert");
    throw new Error("No data returned from database insert");
  }
  return data as User;
}

export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = getSupabase();
  const [followers, following, posts] = await Promise.all([
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("follower_id", userId),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId)
      .eq("is_active", true),
  ]);

  return {
    followers_count: followers.count || 0,
    following_count: following.count || 0,
    posts_count: posts.count || 0,
  };
}

export async function listUsers(limit = 50, offset = 0): Promise<User[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data as User[];
}

// Post Queries
export async function createPost(postData: {
  content: string;
  author_id: string;
  image_url?: string;
  category?: "general" | "announcement" | "question";
}): Promise<Post | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...postData,
      category: postData.category || "general",
      is_active: true,
      like_count: 0,
      comment_count: 0,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as Post;
}

export async function getPostById(postId: string): Promise<Post | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(*)")
    .eq("id", postId)
    .single();

  if (error || !data) return null;
  return data as Post;
}

export async function updatePost(
  postId: string,
  updates: Partial<Post>
): Promise<Post | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .single();

  if (error || !data) return null;
  return data as Post;
}

export async function deletePost(postId: string): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  return !error;
}

export async function listPosts(
  limit = 20,
  offset = 0,
  authorId?: string
): Promise<Post[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("posts")
    .select("*, author:users(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  const { data, error } = await query;

  if (error || !data) return [];
  return data as Post[];
}

export async function getFeedPosts(
  userId: string,
  limit = 20,
  offset = 0
): Promise<Post[]> {
  // Get users that the current user follows
  const supabase = getSupabase();
  const { data: follows } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  const followingIds = follows?.map((f) => f.following_id) || [];

  // If user doesn't follow anyone, return empty feed
  if (followingIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*, author:users(*)")
    .in("author_id", followingIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data as Post[];
}

// Follow Queries
export async function createFollow(
  followerId: string,
  followingId: string
): Promise<Follow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("follows")
    .insert({
      follower_id: followerId,
      following_id: followingId,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as Follow;
}

export async function deleteFollow(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  return !error;
}

export async function checkFollow(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();

  return !error && !!data;
}

export async function getUserFollowers(
  userId: string,
  limit = 50,
  offset = 0
): Promise<User[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("follows")
    .select("follower:users!follows_follower_id_fkey(*)")
    .eq("following_id", userId)
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data.map((item: { follower: unknown }) => item.follower as User);
}

export async function getUserFollowing(
  userId: string,
  limit = 50,
  offset = 0
): Promise<User[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("follows")
    .select("following:users!follows_following_id_fkey(*)")
    .eq("follower_id", userId)
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data.map((item: { following: unknown }) => item.following as User);
}

// Like Queries
export async function createLike(
  postId: string,
  userId: string
): Promise<Like | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("likes")
    .insert({
      post_id: postId,
      user_id: userId,
    })
    .select()
    .single();

  if (error || !data) return null;

  // Update post like count
  await supabase.rpc("increment_like_count", { post_id: postId });

  return data as Like;
}

export async function deleteLike(
  postId: string,
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) return false;

  // Update post like count
  await supabase.rpc("decrement_like_count", { post_id: postId });

  return true;
}

export async function checkLike(
  postId: string,
  userId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  return !error && !!data;
}

// Comment Queries
export async function createComment(commentData: {
  post_id: string;
  user_id: string;
  content: string;
}): Promise<Comment | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .insert(commentData)
    .select()
    .single();

  if (error || !data) return null;

  // Update post comment count
  await supabase.rpc("increment_comment_count", {
    post_id: commentData.post_id,
  });

  return data as Comment;
}

export async function getPostComments(
  postId: string,
  limit = 50,
  offset = 0
): Promise<Comment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("*, user:users(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data as Comment[];
}

export async function updateComment(
  commentId: string,
  content: string
): Promise<Comment | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .select()
    .single();

  if (error || !data) return null;
  return data as Comment;
}

export async function deleteComment(
  commentId: string,
  postId: string
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) return false;

  // Update post comment count
  await supabase.rpc("decrement_comment_count", { post_id: postId });

  return true;
}
