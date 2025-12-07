import { Card } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "@shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <Card
      className={`p-4 text-center transition-all ${
        achievement.isUnlocked ? "hover-elevate" : "opacity-50"
      }`}
      data-testid={`achievement-${achievement.id}`}
    >
      <div className="space-y-3">
        <div
          className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
            achievement.isUnlocked ? "bg-primary" : "bg-muted"
          }`}
        >
          {achievement.isUnlocked ? (
            <Trophy className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-sm">{achievement.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">
            {achievement.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
