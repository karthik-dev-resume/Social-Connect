"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Comment } from "@/lib/db/types";

interface CommentSectionProps {
  comments: Comment[];
  commentContent: string;
  submitting: boolean;
  user: { id: string } | null;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CommentSection({
  comments,
  commentContent,
  submitting,
  user,
  onCommentChange,
  onSubmit,
}: CommentSectionProps) {
  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>

        {user && (
          <form onSubmit={onSubmit} className="mb-6">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentContent}
                onChange={(e) => onCommentChange(e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={submitting || !commentContent.trim()}
              >
                {submitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            comments.map((comment) => {
              const commentUser = comment.user || {
                id: comment.user_id,
                first_name: "Unknown",
                last_name: "User",
                username: "unknown",
                email: "",
                role: "user" as const,
                profile_visibility: "public" as const,
                is_active: true,
                is_verified: false,
                created_at: "",
                updated_at: "",
              };
              const initials = commentUser.first_name
                ? `${commentUser.first_name[0]}${commentUser.last_name[0]}`.toUpperCase()
                : "U";

              return (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={commentUser.avatar_url} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">
                          {commentUser.first_name} {commentUser.last_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

