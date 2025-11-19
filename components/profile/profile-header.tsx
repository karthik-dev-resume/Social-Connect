"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, UserMinus } from "lucide-react";
import type { User, UserStats } from "@/lib/db/types";

type UserWithStats = User & UserStats;

interface ProfileHeaderProps {
  user: UserWithStats;
  isOwnProfile: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onFollow: () => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing,
  followLoading,
  onFollow,
}: ProfileHeaderProps) {
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <Card className="mb-6">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="text-xl sm:text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-3 sm:mb-4 space-y-3 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                  @{user.username}
                </p>
              </div>
              {!isOwnProfile && (
                <Button
                  onClick={onFollow}
                  variant={isFollowing ? "outline" : "default"}
                  disabled={followLoading}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  {followLoading ? (
                    "Loading..."
                  ) : isFollowing ? (
                    <>
                      <UserMinus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Follow
                    </>
                  )}
                </Button>
              )}
              {isOwnProfile && (
                <Button
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  <a href="/settings">Edit Profile</a>
                </Button>
              )}
            </div>
            {user.bio && (
              <p className="mb-3 sm:mb-4 text-sm sm:text-base text-center sm:text-left">
                {user.bio}
              </p>
            )}
            <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <div>
                <span className="font-semibold">{user.posts_count || 0}</span>
                <span className="text-gray-500 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold">
                  {user.followers_count || 0}
                </span>
                <span className="text-gray-500 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">
                  {user.following_count || 0}
                </span>
                <span className="text-gray-500 ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

