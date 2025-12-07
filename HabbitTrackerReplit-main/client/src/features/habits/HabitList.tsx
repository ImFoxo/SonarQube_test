import { HabitCard } from "./HabitCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Habit } from "@shared/schema";

interface HabitListProps {
  habits: Habit[];
  completedHabits: Set<string>;
  onToggle: (habitId: string) => void;
  isLoading?: boolean;
  selectedDate?: string;
}

export function HabitList({
  habits,
  completedHabits,
  onToggle,
  isLoading = false,
  selectedDate,
}: HabitListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No habits yet. Create your first habit to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isCompleted={completedHabits.has(habit.id)}
          onToggle={onToggle}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  );
}
