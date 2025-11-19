"use client";

import { useEffect, useState, useRef } from "react";
import { apiRequest, apiRequestFormData } from "@/lib/api/client";
import { toast } from "sonner";
import type { User } from "@/lib/db/types";

export function useSettings(user: User | null, refreshUser: () => Promise<void>) {
  const [formData, setFormData] = useState({
    bio: "",
    website: "",
    location: "",
    profile_visibility: "public" as "public" | "private" | "followers_only",
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        website: user.website || "",
        location: user.location || "",
        profile_visibility: user.profile_visibility || "public",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      toast.success("Profile updated successfully!");
      refreshUser();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiRequestFormData("/api/users/upload-avatar", formData);
      toast.success("Avatar updated successfully!");
      refreshUser();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload avatar";

      if (errorMessage.toLowerCase().includes("bucket not found")) {
        toast.error(
          "Storage bucket 'avatars' not found. Please create it in your Supabase dashboard under Storage.",
          { duration: 5000 }
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setAvatarLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    avatarLoading,
    fileInputRef,
    handleSubmit,
    handleAvatarUpload,
  };
}

