'use client';

import Link from 'next/link';
import { useStore, getProjectProgress, getProjectDeadlines } from '@/lib/store';

function CalendarWidget() {
  const { projects } = useStore();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleString('en-US', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const deadlines = getProjectDeadlines(projects);
  const deadlineMap = new Map(
    deadlines
      .filter(d => {
        const dt = new Date(d.dueDate);
        return dt.getFullYear() === year && dt.getMonth() === month;
      })
      .map(d => [new Date(d.dueDate).getDate(), d])
  );

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const todayDate = today.getDate();

  return (
    <div className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-semibold text-text-primary">{monthName} {year}</h3>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-elevated rounded transition-colors text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button className="p-1 hover:bg-elevated rounded transition-colors text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-3 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[11px] font-medium tracking-widest text-text-tertiary uppercase">{d}</div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={i} />;
          const isToday = day === todayDate;
          const dl = deadlineMap.get(day);
          return (
            <div key={i} className="relative flex justify-center items-center py-1">
              {isToday && (
                <div className="absolute w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container" />
              )}
              {dl && !isToday && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dl.color }} />
              )}
              <span className={`z-10 text-[13px] ${isToday ? 'text-primary font-semibold' : dl ? 'text-text-primary' : 'text-text-secondary'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {deadlines.length === 0 ? (
          <p className="text-[13px] text-text-tertiary text-center py-2">No upcoming deadlines</p>
        ) : (
          deadlines.slice(0, 2).map(d => (
            <div key={d.projectId} className="p-2.5 bg-surface-container rounded-lg border-l-4 flex justify-between items-center" style={{ borderColor: d.color }}>
              <div>
                <p className="text-[12px] font-medium text-text-primary">{d.name}</p>
                <p className="text-[10px] text-text-secondary">
                  Due {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <span className="material-symbols-outlined text-[16px] text-text-tertiary">flag</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityFeed() {
  const { activity } = useStore();
  return (
    <div className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-semibold text-text-primary">Recent Activity</h3>
        <button className="text-[12px] font-medium text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-5">
        {activity.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[11px] font-semibold">
              {item.user.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="space-y-0.5">
              <p className="text-[13px] text-text-primary">
                <span className="font-semibold">{item.user}</span>
                {' '}{item.action}{' '}
                <span style={{ color: item.targetColor ?? '#bfc2ff' }}>{item.target}</span>
              </p>
              <p className="text-[10px] text-text-tertiary">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { projects, tasks, projectOrder } = useStore();

  const allTasks = Object.values(tasks);
  const activeProjects = projectOrder.length;
  const inProgressCount = allTasks.filter(t => t.columnId === 'in_progress').length;
  const doneCount = allTasks.filter(t => t.columnId === 'done').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = allTasks.filter(t => t.dueDate && t.dueDate < todayStr && t.columnId !== 'done').length;

  const METRICS = [
    { icon: 'rocket_launch', label: 'Active Projects', value: activeProjects, color: 'text-primary-container', bg: 'bg-primary-container/20', badge: 'Live' },
    { icon: 'pending', label: 'Tasks In Progress', value: inProgressCount, color: 'text-tertiary', bg: 'bg-tertiary/10', badge: '+2 today' },
    { icon: 'check_circle', label: 'Completed', value: doneCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'This week' },
    { icon: 'warning', label: 'Overdue', value: overdueCount, color: 'text-error', bg: 'bg-error/10', badge: overdueCount > 0 ? 'Urgent' : 'Clear' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-6 space-y-8">
      {/* Greeting */}
      <header>
        <h1 className="text-[32px] font-bold leading-10 tracking-tight text-text-primary">Good morning, Dev Team 👋</h1>
        <p className="text-[14px] text-text-secondary mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map(m => (
          <div key={m.label} className="bg-surface p-4 rounded-xl border border-[rgba(139,143,212,0.15)] hover:bg-elevated hover:border-[rgba(139,143,212,0.35)] transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <span className={`p-2 rounded ${m.bg} ${m.color}`}>
                <span className="material-symbols-outlined">{m.icon}</span>
              </span>
              <span className="text-[10px] font-medium text-text-tertiary">{m.badge}</span>
            </div>
            <p className={`text-[22px] font-semibold ${m.color}`}>{m.value}</p>
            <p className="text-[11px] font-medium tracking-widest text-text-secondary uppercase mt-1">{m.label}</p>
          </div>
        ))}
      </section>

      {/* Calendar + Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarWidget />
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </section>

      {/* Project Progress */}
      <section className="bg-surface rounded-xl border border-[rgba(139,143,212,0.15)] p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-semibold text-text-primary">Project Progress</h3>
          <Link href="/projects" className="text-[12px] font-medium text-primary hover:underline">View All</Link>
        </div>
        <div className="space-y-6">
          {projectOrder.length === 0 ? (
            <p className="text-text-tertiary text-[13px] text-center py-4">
              No projects yet.{' '}
              <Link href="/projects" className="text-primary hover:underline">Create one!</Link>
            </p>
          ) : (
            projectOrder.map(pid => {
              const project = projects[pid];
              if (!project) return null;
              const progress = getProjectProgress(project, tasks);
              const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && progress < 100;
              return (
                <Link key={pid} href={`/projects/${pid}`} className="block group">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: project.color + '25' }}>
                          <span className="material-symbols-outlined text-[20px]" style={{ color: project.color }}>{project.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-[12px] font-medium text-text-primary group-hover:text-primary transition-colors">{project.name}</h4>
                          <p className="text-[11px] text-text-secondary">
                            {isOverdue
                              ? <span className="text-error font-medium">Overdue</span>
                              : project.dueDate
                                ? `Due ${new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                                : 'No deadline'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-text-primary">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-elevated rounded-full overflow-hidden">
                      <div className="h-full signature-gradient rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
