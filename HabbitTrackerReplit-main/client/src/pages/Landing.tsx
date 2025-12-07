import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, setUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const handleStartNow = () => {
    const mockUser = {
      id: "demo-user-1",
      username: "demo",
      name: "Demo User",
      avatar: null,
      totalHabits: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
    setUser(mockUser);
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-3xl mx-auto px-6 py-12 text-center space-y-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-6">
            <Target className="h-16 w-16 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Habit Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build better habits, track your progress, and achieve your goals with a clean, 
            modern habit tracking experience.
          </p>
        </div>

        <div className="pt-6">
          <Button
            size="lg"
            onClick={handleStartNow}
            className="px-8 py-6 text-lg"
            data-testid="button-start-now"
          >
            Start Now
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <h3 className="font-semibold">Track Daily</h3>
            <p className="text-sm text-muted-foreground">
              Check off your habits every day and build consistent routines.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Build Streaks</h3>
            <p className="text-sm text-muted-foreground">
              Maintain streaks and watch your progress compound over time.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Visualize Progress</h3>
            <p className="text-sm text-muted-foreground">
              See your achievements and statistics in beautiful charts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
