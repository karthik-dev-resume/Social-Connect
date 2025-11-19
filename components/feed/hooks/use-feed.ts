"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { apiRequest } from "@/lib/api/client";
import { toast } from "sonner";
import type { Post } from "@/lib/db/types";

const POSTS_PER_PAGE = 20;

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        offsetRef.current = 0;
      } else {
        setLoadingMore(true);
      }

      const offsetToUse = reset ? 0 : offsetRef.current;
      const data = await apiRequest<{ results: Post[]; has_more?: boolean }>(
        `/api/posts?limit=${POSTS_PER_PAGE}&offset=${offsetToUse}`
      );

      if (reset) {
        setPosts(data.results);
      } else {
        setPosts((prev) => [...prev, ...data.results]);
      }

      setHasMore(data.has_more ?? data.results.length === POSTS_PER_PAGE);
      offsetRef.current = offsetToUse + data.results.length;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load posts";
      toast.error(message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, hasMore, loadingMore, fetchPosts]);

  return {
    posts,
    loading,
    loadingMore,
    hasMore,
    observerTarget,
    fetchPosts,
  };
}

