'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore, getProjectDeadlines } from '@/lib/store';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DeadlineEvent {
  projectId: string;
  name: string;
  dueDate: string;
  color: string;
}

interface CalendarDayProps {
  day: number | null;
  isToday: boolean;
  events: DeadlineEvent[];
  tasks: { title: string; priority: string; projectName: string; projectColor: string }[];
}

function CalendarDay({ day, isToday, events, tasks }: CalendarDayProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const allItems = [...events.map(e => ({ label: `📌 ${e.name} deadline`, color: e.color, type: 'deadline' as const })), ...tasks.map(t => ({ label: `⚡ ${t.title}`, color: t.projectColor, type: 'task' as const }))];

  if (!day) return <div className="min-h-[100px] border-r border-b border-[rgba(139,143,212,0.08)]" />;

  return (
    <div
      className="min-h-[100px] border-r border-b border-[rgba(139,143,212,0.08)] p-1.5 relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`w-7 h-7 flex items-center justify-center rounded-full mb-1 text-[13px] font-medium ${isToday ? 'bg-primary-container text-on-primary-container' : 'text-text-secondary hover:bg-elevated'}`}>
        {day}
      </div>

      <div className="space-y-0.5">
        {allItems.slice(0, 2).map((item, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px] rounded px-1 py-0.5 truncate" style={{ backgroundColor: item.color + '20', color: item.color }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
        {allItems.length > 2 && (
          <p className="text-[10px] text-text-tertiary px-1">+{allItems.length - 2} more</p>
        )}
      </div>

      {/* Tooltip on hover */}
      {showTooltip && allItems.length > 0 && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-elevated border border-[rgba(139,143,212,0.35)] rounded-lg p-2 min-w-[180px] shadow-xl space-y-1">
          {allItems.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-primary">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const { projects, tasks } = useStore();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays = new Date(currentYear, currentMonth, 0).getDate();

  const deadlines = getProjectDeadlines(projects);
  const allTasks = Object.values(tasks);

  // Build deadline map: day → list of deadline events this month
  const deadlineMap = new Map<number, DeadlineEvent[]>();
  deadlines.forEach(d => {
    const dt = new Date(d.dueDate);
    if (dt.getFullYear() === currentYear && dt.getMonth() === currentMonth) {
      const day = dt.getDate();
      if (!deadlineMap.has(day)) deadlineMap.set(day, []);
      deadlineMap.get(day)!.push(d);
    }
  });

  // Build task map: day → list of tasks due this month
  const taskMap = new Map<number, typeof allTasks>();
  allTasks.forEach(t => {
    if (!t.dueDate) return;
    const dt = new Date(t.dueDate);
    if (dt.getFullYear() === currentYear && dt.getMonth() === currentMonth) {
      const day = dt.getDate();
      if (!taskMap.has(day)) taskMap.set(day, []);
      taskMap.get(day)!.push(t);
    }
  });

  // Build calendar grid: mix of prev month tail, current month, next month head
  const cells: Array<{ day: number; type: 'prev' | 'current' | 'next' }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: prevDays - firstDay + 1 + i, type: 'prev' });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: 'current' });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, type: 'next' });

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // Upcoming deadlines list (all future)
  const upcoming = deadlines
    .filter(d => new Date(d.dueDate) >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 8);

  const overdue = deadlines.filter(d => new Date(d.dueDate) < new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold leading-10 tracking-tight text-text-primary">Calendar</h1>
          <p className="text-[14px] text-text-secondary mt-1">Project deadlines and task due dates overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-elevated border border-[rgba(139,143,212,0.15)] text-text-secondary hover:text-text-primary transition-all">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="text-[18px] font-semibold text-text-primary w-44 text-center">{MONTHS[currentMonth]} {currentYear}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-elevated border border-[rgba(139,143,212,0.15)] text-text-secondary hover:text-text-primary transition-all">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main calendar */}
        <div className="xl:col-span-3 bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[rgba(139,143,212,0.15)]">
            {WEEKDAYS.map(d => (
              <div key={d} className="py-3 text-center text-[11px] font-medium text-text-tertiary uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              if (cell.type !== 'current') {
                return (
                  <div key={i} className="min-h-[100px] border-r border-b border-[rgba(139,143,212,0.08)] p-1.5">
                    <div className="w-7 h-7 flex items-center justify-center text-[13px] text-text-tertiary/30">{cell.day}</div>
                  </div>
                );
              }

              const day = cell.day;
              const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
              const events = deadlineMap.get(day) ?? [];
              const dayTasks = (taskMap.get(day) ?? []).map(t => ({
                title: t.title,
                priority: t.priority,
                projectName: projects[t.projectId]?.name ?? '',
                projectColor: projects[t.projectId]?.color ?? '#8B8FD4',
              }));

              return (
                <CalendarDay key={i} day={day} isToday={isToday} events={events} tasks={dayTasks} />
              );
            })}
          </div>
        </div>

        {/* Sidebar: upcoming + overdue */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4">
            <h3 className="text-[12px] font-semibold text-text-primary uppercase tracking-widest mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                <div className="w-3 h-3 rounded-full bg-primary-container" />
                Today
              </div>
              <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                <div className="w-3 h-3 rounded-full bg-primary" />
                Project deadline
              </div>
              <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                <div className="w-3 h-3 rounded-full bg-tertiary" />
                Task due date
              </div>
            </div>

            {/* Project color guide */}
            <div className="mt-4 space-y-1.5">
              {Object.values(projects).map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <Link href={`/projects/${p.id}`} className="text-[11px] text-text-secondary hover:text-text-primary truncate transition-colors">{p.name}</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue */}
          {overdue.length > 0 && (
            <div className="bg-surface rounded-xl border border-error/20 p-4">
              <h3 className="text-[12px] font-semibold text-error uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Overdue ({overdue.length})
              </h3>
              <div className="space-y-2">
                {overdue.map(d => (
                  <Link key={d.projectId} href={`/projects/${d.projectId}`} className="flex items-center gap-2 group">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-text-primary group-hover:text-primary transition-colors truncate">{d.name}</p>
                      <p className="text-[10px] text-error">
                        {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4">
            <h3 className="text-[12px] font-semibold text-text-primary uppercase tracking-widest mb-3">Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-[12px] text-text-tertiary">No upcoming deadlines</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(d => {
                  const daysLeft = Math.ceil((new Date(d.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <Link key={d.projectId} href={`/projects/${d.projectId}`} className="flex items-center gap-2 group">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-text-primary group-hover:text-primary transition-colors truncate">{d.name}</p>
                        <p className="text-[10px] text-text-secondary">
                          {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' '}· {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d left`}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
