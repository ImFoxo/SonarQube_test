import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Habit } from "@shared/schema";
import { CheckCircle2, Circle } from "lucide-react";

interface CollaboratorStatus {
  memberId: string;
  memberName: string;
  memberAvatar: string | null;
  completed: boolean;
}

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: (habitId: string) => void;
  selectedDate?: string;
}

export function HabitCard({ habit, isCompleted, onToggle, selectedDate }: HabitCardProps) {
  const { data: collaborators = [] } = useQuery<CollaboratorStatus[]>({
    queryKey: [`/api/habits/${habit.id}/collaborations`, selectedDate],
    enabled: habit.isCollaborative && !!selectedDate,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="p-4 hover-elevate transition-all duration-150"
      data-testid={`card-habit-${habit.id}`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggle(habit.id)}
            data-testid={`checkbox-habit-${habit.id}`}
            className="h-5 w-5"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <h3
                className={`font-medium text-sm ${
                  isCompleted ? "line-through text-muted-foreground" : ""
                }`}
              >
                {habit.name}
              </h3>
              {habit.isCollaborative && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                  Collaborative
                </span>
              )}
            </div>
            {habit.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {habit.description}
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {habit.frequency}
          </div>
        </div>

        {habit.isCollaborative && collaborators.length > 0 && (
          <div className="pl-9 border-t pt-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Friends Progress
            </p>
            <div className="space-y-2">
              {collaborators.map((collaborator) => (
                <div key={collaborator.memberId} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={collaborator.memberAvatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(collaborator.memberName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs flex-1">{collaborator.memberName}</span>
                  {collaborator.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" data-testid={`collaborator-completed-${collaborator.memberId}`} />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" data-testid={`collaborator-pending-${collaborator.memberId}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
