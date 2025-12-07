import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Target, Trophy, Flame } from "lucide-react";
import { Calendar } from "@/features/tracking/Calendar";
import { HabitList } from "@/features/habits/HabitList";
import { HabitForm } from "@/features/habits/HabitForm";
import { MetricCard } from "@/features/stats/MetricCard";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Habit, Group, Completion, User } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data: habits = [], isLoading: habitsLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const { data: completions = [] } = useQuery<Completion[]>({
    queryKey: ["/api/completions"],
  });

  const { data: friends = [] } = useQuery<User[]>({
    queryKey: ["/api/friends"],
  });

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const selectedDateCompletions = completions.filter((c) => c.date === selectedDate);
  const completedHabitIds = new Set(selectedDateCompletions.map((c) => c.habitId));

  const completedDates = new Set(
    completions.map((c) => c.date)
  );

  const createHabitMutation = useMutation({
    mutationFn: async (data: any) => {
      const { collaborators, ...habitData } = data;
      const result = await apiRequest("POST", "/api/habits", habitData);
      
      // Add collaborators if this is a collaborative habit
      if (collaborators && collaborators.length > 0) {
        for (const collaboratorId of collaborators) {
          await apiRequest("POST", `/api/habits/${result.id}/members`, { userId: collaboratorId });
        }
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success",
        description: "Habit created successfully!",
      });
    },
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: async ({ habitId, isCompleted, date }: { habitId: string; isCompleted: boolean; date: string }) => {
      if (isCompleted) {
        const completion = completions.find((c) => c.habitId === habitId && c.date === date);
        if (completion) {
          return apiRequest("DELETE", `/api/completions/${completion.id}`, undefined);
        }
      } else {
        return apiRequest("POST", "/api/completions", {
          habitId,
          value: 1,
          date,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/completions"] });
    },
  });

  const handleToggleHabit = (habitId: string) => {
    const isCompleted = completedHabitIds.has(habitId);
    toggleCompletionMutation.mutate({ habitId, isCompleted, date: selectedDate });
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const completionRate = habits.length > 0
    ? Math.round((completedHabitIds.size / habits.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>
        <Button
          onClick={() => setIsHabitFormOpen(true)}
          data-testid="button-add-habit"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Current Streak"
          value={user?.currentStreak || 0}
          icon={Flame}
          subtitle="days in a row"
        />
        <MetricCard
          title="Total Habits"
          value={habits.length}
          icon={Target}
          subtitle="active habits"
        />
        <MetricCard
          title="Today's Progress"
          value={`${completionRate}%`}
          icon={Trophy}
          subtitle={`${completedHabitIds.size} of ${habits.length} completed`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Habits</h2>
            <p className="text-sm text-muted-foreground">
              {selectedDate === todayStr ? "Today" : format(new Date(selectedDate), "MMM d, yyyy")}
            </p>
          </div>
          <HabitList
            habits={habits}
            completedHabits={completedHabitIds}
            onToggle={handleToggleHabit}
            isLoading={habitsLoading}
            selectedDate={selectedDate}
          />
        </div>

        <div>
          <Calendar
            currentDate={currentDate}
            completedDates={completedDates}
            onDateChange={setCurrentDate}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      <HabitForm
        open={isHabitFormOpen}
        onOpenChange={setIsHabitFormOpen}
        onSubmit={(data) => createHabitMutation.mutate(data)}
        groups={groups}
        userId={user?.id || ""}
        friends={friends}
      />
    </div>
  );
}
