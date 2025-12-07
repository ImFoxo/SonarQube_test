import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@shared/schema";

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFriendIds: string[];
  currentUserId: string;
}

export function AddFriendModal({
  open,
  onOpenChange,
  currentFriendIds,
  currentUserId,
}: AddFriendModalProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allUsers = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/all-users"],
    enabled: open,
  });

  const addFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      return apiRequest("POST", "/api/friends", { friendId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      toast({
        title: "Success",
        description: "Friend added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add friend",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = allUsers.filter(
    (user) =>
      user.id !== currentUserId &&
      !currentFriendIds.includes(user.id) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Search and add friends to see their habit progress
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-friends"
        />

        <div className="max-h-96 overflow-y-auto space-y-2">
          {usersLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {allUsers.length === 0
                ? "No users available"
                : "No matching users found"}
            </p>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addFriendMutation.mutate(user.id)}
                  disabled={addFriendMutation.isPending}
                  data-testid={`button-add-friend-${user.id}`}
                >
                  Add
                </Button>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
