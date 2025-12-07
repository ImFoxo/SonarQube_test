import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  currentDate: Date;
  completedDates: Set<string>;
  onDateChange?: (date: Date) => void;
  onDateClick?: (date: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({ currentDate, completedDates, onDateChange, onDateClick }: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => {
    onDateChange?.(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange?.(addMonths(currentDate, 1));
  };

  return (
    <Card className="p-6" data-testid="calendar">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              data-testid="button-next-month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isCompleted = completedDates.has(dateStr);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <button
                key={index}
                onClick={() => onDateClick?.(dateStr)}
                className={`
                  aspect-square flex items-center justify-center rounded-md text-sm
                  ${!isCurrentMonth ? "text-muted-foreground/40" : ""}
                  ${isTodayDate ? "bg-primary text-primary-foreground font-semibold" : ""}
                  ${isCompleted && !isTodayDate ? "bg-accent" : ""}
                  hover-elevate active-elevate-2 cursor-pointer transition-all
                `}
                data-testid={`calendar-day-${dateStr}`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
