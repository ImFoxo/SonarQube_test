import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/features/stats/MetricCard";
import { AchievementBadge } from "@/features/achievements/AchievementBadge";
import { FriendUpdateItem } from "@/features/friends/FriendUpdateItem";
import { FriendsManager } from "@/features/friends/FriendsManager";
import { EditProfileModal } from "@/features/profile/EditProfileModal";
import { Target, Flame, Trophy, Edit2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import type { Achievement, FriendUpdate, Habit, User } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: habits = [] } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const { data: friendUpdates = [] } = useQuery<FriendUpdate[]>({
    queryKey: ["/api/friend-updates"],
  });

  const { data: currentUser = user } = useQuery<User | null>({
    queryKey: ["/api/user"],
    initialData: user,
  });

  const initials = currentUser?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentUser?.avatar || undefined} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{currentUser?.name}</h1>
                <p className="text-muted-foreground mt-1">@{currentUser?.username}</p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <div>
                    <div className="text-2xl font-bold">{currentUser?.currentStreak || 0}</div>
                    <div className="text-xs text-muted-foreground">Current Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{habits.length}</div>
                    <div className="text-xs text-muted-foreground">Total Habits</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{currentUser?.longestStreak || 0}</div>
                    <div className="text-xs text-muted-foreground">Longest Streak</div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                data-testid="button-edit-profile"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Current Streak"
            value={currentUser?.currentStreak || 0}
            icon={Flame}
            subtitle="consecutive days"
          />
          <MetricCard
            title="Total Habits"
            value={habits.length}
            icon={Target}
            subtitle="active habits"
          />
          <MetricCard
            title="Achievements"
            value={achievements.filter((a) => a.isUnlocked).length}
            icon={Trophy}
            subtitle={`of ${achievements.length} unlocked`}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.length === 0 ? (
            <Card className="col-span-full p-8 text-center">
              <p className="text-muted-foreground">
                No achievements yet. Keep building habits to unlock achievements!
              </p>
            </Card>
          ) : (
            achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Friends</h2>
          <FriendsManager currentUserId={currentUser?.id || ""} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Friend Activity</h2>
          <div className="space-y-3">
            {friendUpdates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No friend updates yet. Connect with friends to see their progress!
                </p>
              </Card>
            ) : (
              friendUpdates.map((update) => (
                <FriendUpdateItem key={update.id} update={update} />
              ))
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={currentUser}
      />
    </div>
  );
}
