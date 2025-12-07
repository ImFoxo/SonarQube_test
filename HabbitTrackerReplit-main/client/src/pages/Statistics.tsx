import { useQuery } from "@tanstack/react-query";
import { StatsCharts } from "@/features/stats/StatsCharts";
import { StatsTable } from "@/features/stats/StatsTable";
import { MetricCard } from "@/features/stats/MetricCard";
import { TrendingUp, Calendar, Target } from "lucide-react";
import type { Habit, Completion } from "@shared/schema";
import { format, subDays } from "date-fns";

export default function Statistics() {
  const { data: habits = [] } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const { data: completions = [] } = useQuery<Completion[]>({
    queryKey: ["/api/completions"],
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, "yyyy-MM-dd");
  });

  const dailyCompletionData = last7Days.map((date) => {
    const dayCompletions = completions.filter((c) => c.date === date);
    return {
      name: format(new Date(date), "EEE"),
      value: dayCompletions.length,
    };
  });

  const habitCompletionData = habits.map((habit) => {
    const habitCompletions = completions.filter((c) => c.habitId === habit.id);
    return {
      name: habit.name,
      value: habitCompletions.length,
    };
  }).slice(0, 5);

  const recentCompletions = completions
    .slice(-10)
    .reverse()
    .map((completion) => {
      const habit = habits.find((h) => h.id === completion.habitId);
      return {
        id: completion.id,
        name: habit?.name || "Unknown Habit",
        value: completion.value,
        date: format(new Date(completion.date), "MMM dd, yyyy"),
      };
    });

  const totalCompletions = completions.length;
  const avgPerDay = completions.length > 0
    ? Math.round(completions.length / 7)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and analyze your habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Completions"
          value={totalCompletions}
          icon={Target}
          subtitle="all time"
        />
        <MetricCard
          title="Daily Average"
          value={avgPerDay}
          icon={TrendingUp}
          subtitle="last 7 days"
        />
        <MetricCard
          title="Active Habits"
          value={habits.length}
          icon={Calendar}
          subtitle="currently tracking"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsCharts
          data={dailyCompletionData}
          title="Daily Completions (Last 7 Days)"
        />
        <StatsCharts
          data={habitCompletionData}
          title="Top Habits by Completion"
        />
      </div>

      <StatsTable data={recentCompletions} title="Recent Activity" />
    </div>
  );
}
