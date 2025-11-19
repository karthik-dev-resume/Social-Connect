"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import { toast } from "sonner";
import type { Post, Comment } from "@/lib/db/types";

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        apiRequest<Post>(`/api/posts/${postId}`),
        apiRequest<{ results: Comment[] }>(`/api/posts/${postId}/comments`),
      ]);

      setPost(postData);
      setComments(commentsData.results);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load post";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: commentContent }),
      });

      setCommentContent("");
      toast.success("Comment added!");
      fetchPost();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return {
    post,
    comments,
    commentContent,
    loading,
    submitting,
    setCommentContent,
    handleSubmitComment,
    fetchPost,
  };
}

