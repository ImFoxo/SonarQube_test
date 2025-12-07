import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Flame, Target, Plus } from "lucide-react";
import { AddFriendModal } from "@/features/friends/AddFriendModal";
import type { User } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface FriendsManagerProps {
  currentUserId: string;
}

export function FriendsManager({ currentUserId }: FriendsManagerProps) {
  const { toast } = useToast();
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  const { data: friends = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/friends"],
  });

  const removeFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      return apiRequest("DELETE", `/api/friends/${friendId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      toast({
        title: "Success",
        description: "Friend removed",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={() => setIsAddFriendOpen(true)}
        className="w-full gap-2"
        data-testid="button-add-friend"
      >
        <Plus className="h-4 w-4" />
        Add Friend
      </Button>

      {friends.length === 0 ? (
        <p className="text-sm text-muted-foreground">No friends yet</p>
      ) : (
        friends.map((friend) => (
          <Card key={friend.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={friend.avatar || undefined} />
                  <AvatarFallback>
                    {friend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{friend.name}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {friend.currentStreak}-day streak
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {friend.totalHabits} habits
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFriendMutation.mutate(friend.id)}
                disabled={removeFriendMutation.isPending}
                data-testid={`button-remove-friend-${friend.id}`}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))
      )}

      <AddFriendModal
        open={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        currentFriendIds={friends.map((f) => f.id)}
        currentUserId={currentUserId}
      />
    </div>
  );
}
