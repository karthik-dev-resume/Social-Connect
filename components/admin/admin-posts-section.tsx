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
            <div key={post.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold mb-2">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Author ID: {post.author_id} • Created:{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Likes: {post.like_count} • Comments: {post.comment_count}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeletePost(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

