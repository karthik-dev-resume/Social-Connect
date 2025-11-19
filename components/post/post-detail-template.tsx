"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { PostCard } from "@/components/post-card";
import { usePostDetail } from "./hooks/use-post-detail";
import { CommentSection } from "./comment-section";
import { Spinner } from "@/components/ui/spinner";

export function PostDetailTemplate() {
  const params = useParams();
  const postId = params.post_id as string;
  const { user } = useAuth();
  const {
    post,
    comments,
    commentContent,
    loading,
    submitting,
    setCommentContent,
    handleSubmitComment,
    fetchPost,
  } = usePostDetail(postId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-gray-500">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PostCard post={post} onUpdate={fetchPost} />

        <CommentSection
          comments={comments}
          commentContent={commentContent}
          submitting={submitting}
          user={user}
          onCommentChange={setCommentContent}
          onSubmit={handleSubmitComment}
        />
      </div>
    </div>
  );
}

