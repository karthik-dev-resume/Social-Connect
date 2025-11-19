"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Post } from "@/lib/db/types";

interface AdminPostsSectionProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
}

export function AdminPostsSection({
  posts,
  onDeletePost,
}: AdminPostsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Posts</CardTitle>
        <CardDescription>Manage posts and content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-3 sm:p-4 border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base mb-2 break-words">
                    {post.content}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 break-words">
                    <span className="block sm:inline">
                      Author ID: {post.author_id}
                    </span>
                    <span className="hidden sm:inline"> • </span>
                    <span className="block sm:inline">
                      Created: {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Likes: {post.like_count} • Comments: {post.comment_count}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeletePost(post.id)}
                  className="w-full sm:w-auto sm:shrink-0"
                >
                  <Trash2 className="h-4 w-4 " />
                  <span className="sm:hidden">Delete Post</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
