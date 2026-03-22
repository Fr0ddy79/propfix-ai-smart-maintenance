import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/app/StatusBadge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCalendarEvents } from "@/lib/data/queries";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";

const HOURS = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

export default function CalendarPage() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(today, { weekStartsOn: 1 }));
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const { data: calendarEvents = [], isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: getCalendarEvents,
  });

  const goToPrevWeek = () => setWeekStart(prev => addDays(prev, -7));
  const goToNextWeek = () => setWeekStart(prev => addDays(prev, 7));
  const goToToday = () => setWeekStart(startOfWeek(today, { weekStartsOn: 1 }));

  const rangeLabel = `${format(days[0], "MMMM d")}–${format(days[4], "d, yyyy")}`;

  const eventsByDay = days.map(day => {
    const dayStr = format(day, "yyyy-MM-dd");
    return calendarEvents
      .filter(e => e.date === dayStr)
      .sort((a, b) => {
        const toHour = (t: string) => {
          const m = t.match(/^(\d+)\s*(AM|PM)$/i);
          if (!m) return 0;
          let h = parseInt(m[1]);
          if (m[2].toUpperCase() === "PM" && h !== 12) h += 12;
          if (m[2].toUpperCase() === "AM" && h === 12) h = 0;
          return h;
        };
        return toHour(a.time) - toHour(b.time);
      });
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={goToPrevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <button onClick={goToToday} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors px-2">
            Today
          </button>
          <span className="text-sm font-medium text-foreground px-1 min-w-[160px] text-center">{rangeLabel}</span>
          <Button variant="outline" size="icon" className="w-8 h-8" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
        {/* Day headers */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 divide-x divide-border border-b border-border">
            {days.map((day, i) => {
              const isToday = isSameDay(day, today);
              const dayEvents = eventsByDay[i];
              const hasUrgent = dayEvents.some(e => e.priority === "urgent");
              const hasHigh = dayEvents.some(e => e.priority === "high");
              return (
                <div key={i} className={`px-3 py-3 text-center ${isToday ? "bg-primary/5" : "bg-muted/30"}`}>
                  <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className={`text-lg font-semibold tabular-nums ${isToday ? "text-primary" : "text-foreground"}`}>
                      {format(day, "d")}
                    </div>
                    {hasUrgent && <div className="w-2 h-2 rounded-full bg-status-urgent" title="Urgent job this day" />}
                    {hasHigh && !hasUrgent && <div className="w-2 h-2 rounded-full bg-orange-500" title="High priority job this day" />}
                  </div>
                  {isToday && <div className="text-[10px] text-primary font-medium">Today</div>}
                </div>
            );
          })}
          </div>
        </div>

        {/* Day columns */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 divide-x divide-border">
            {days.map((day, i) => {
              const dayEvents = eventsByDay[i];
              return (
                <div key={i} className="min-h-[400px]">
                  <div className="p-2 space-y-2">
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg border border-border bg-card">
                          <Skeleton className="h-3 w-12 mb-1" />
                          <Skeleton className="h-3 w-28 mb-1" />
                          <Skeleton className="h-2 w-20 mb-1.5" />
                          <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                      </div>
                    ) : dayEvents.length === 0 ? (
                      <div className="text-center py-8 text-xs text-muted-foreground/50">No jobs</div>
                    ) : (
                      dayEvents.map((event) => (
                        <Link
                          key={event.id}
                          to={`/app/tickets/${event.id}`}
                          className={`block p-2.5 rounded-lg border text-left transition-colors ${
                            event.priority === "urgent"
                              ? "border-status-urgent/30 bg-status-urgent/5 hover:bg-status-urgent/10"
                              : event.priority === "high"
                              ? "border-status-in-progress/30 bg-status-in-progress/5 hover:bg-status-in-progress/10"
                              : "border-border bg-card hover:bg-muted/30"
                          }`}
                        >
                          <div className="text-xs font-medium text-primary tabular-nums mb-1">{event.time}</div>
                          <div className="text-xs font-medium text-foreground mb-0.5 leading-snug">{event.title}</div>
                          <div className="text-[10px] text-muted-foreground">{event.property_name}{event.unit ? ` · ${event.unit}` : ""}</div>
                          <div className="text-[10px] text-muted-foreground mb-1.5">{event.contractor_name}</div>
                          <StatusBadge status={event.status} className="text-[10px]" />
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
