import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { FriendUpdate } from "@shared/schema";

interface FriendUpdateItemProps {
  update: FriendUpdate;
}

export function FriendUpdateItem({ update }: FriendUpdateItemProps) {
  const initials = update.friendName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-4 hover-elevate transition-all" data-testid={`friend-update-${update.id}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={update.friendAvatar || undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold">{update.friendName}</span>{" "}
            <span className="text-muted-foreground">{update.activity}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
}
