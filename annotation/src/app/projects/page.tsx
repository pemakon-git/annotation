'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore, getProjectProgress } from '@/lib/store';

const ICON_OPTIONS = ['cloud', 'security', 'auto_awesome', 'analytics', 'brush', 'code', 'database', 'api', 'phone_android', 'rocket_launch', 'architecture', 'terminal'];
const COLOR_OPTIONS = ['#8B8FD4', '#FB7185', '#2DD4BF', '#60A5FA', '#F59E0B', '#4ade80', '#e1c562', '#9B6FD4', '#E8825A'];

interface CreateProjectModal {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; icon: string; color: string; dueDate: string }) => void;
}

function CreateProjectModal({ onClose, onSubmit }: CreateProjectModal) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('code');
  const [color, setColor] = useState('#8B8FD4');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), icon, color, dueDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-surface border border-[rgba(139,143,212,0.35)] rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-semibold text-text-primary">New Project</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-elevated rounded-xl">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '25' }}>
              <span className="material-symbols-outlined text-[24px]" style={{ color }}>{icon}</span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-text-primary">{name || 'Project Name'}</p>
              <p className="text-[12px] text-text-secondary">{description || 'Project description'}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Cloud Migration"
              className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief project description..."
              rows={2}
              className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`p-2 rounded-lg transition-all ${icon === ic ? 'bg-primary-container/30 border border-primary' : 'bg-elevated hover:bg-surface-container border border-transparent'}`}
                >
                  <span className="material-symbols-outlined text-[18px] text-text-secondary">{ic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-surface ring-white scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Due Date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[rgba(139,143,212,0.35)] text-text-secondary hover:text-text-primary text-[14px] font-medium transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container text-[14px] font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface border border-[rgba(139,143,212,0.35)] rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-[18px] font-semibold text-text-primary">Delete Project</h2>
        <p className="text-[14px] text-text-secondary">Are you sure you want to delete <span className="text-text-primary font-medium">&quot;{name}&quot;</span>? This will remove all tasks. This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[rgba(139,143,212,0.35)] text-text-secondary hover:text-text-primary text-[14px] font-medium transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-error-container text-on-error-container text-[14px] font-medium transition-all hover:opacity-90">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects, tasks, projectOrder, addProject, deleteProject } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = (data: { name: string; description: string; icon: string; color: string; dueDate: string }) => {
    addProject({ name: data.name, description: data.description, icon: data.icon, color: data.color, dueDate: data.dueDate || undefined, members: [] });
    setShowCreate(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProject(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-[32px] font-bold leading-10 tracking-tight text-text-primary">Projects</h1>
          <p className="text-[14px] text-text-secondary flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {projectOrder.length} active project{projectOrder.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(139,143,212,0.35)] text-primary text-[12px] font-medium hover:bg-elevated transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Project
        </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectOrder.map(pid => {
          const project = projects[pid];
          if (!project) return null;
          const progress = getProjectProgress(project, tasks);
          const isOverdue = project.dueDate && new Date(project.dueDate) < new Date() && progress < 100;
          const totalTasks = Object.values(project.columns).reduce((sum, col) => sum + col.taskIds.length, 0);

          return (
            <div key={pid} className="group bg-surface p-4 rounded-xl border border-[rgba(139,143,212,0.15)] hover:bg-elevated hover:border-[rgba(139,143,212,0.35)] transition-all duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: project.color + '20', border: `1px solid ${project.color}40` }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: project.color }}>{project.icon}</span>
                </div>
                <button
                  onClick={() => setDeleteId(pid)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error-container/20 text-text-tertiary hover:text-error transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              <Link href={`/projects/${pid}`} className="flex-1 flex flex-col">
                <h3 className="text-[18px] font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-[13px] text-text-secondary mb-4 flex-1">{project.description || 'No description'}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-tertiary">Progress — {totalTasks} task{totalTasks !== 1 ? 's' : ''}</span>
                    <span className="text-text-secondary font-medium">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full signature-gradient rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex gap-2 text-[11px]">
                      {project.members.slice(0, 3).map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px]">{m}</span>
                      ))}
                      {project.members.length === 0 && (
                        <span className="text-text-tertiary">No members</span>
                      )}
                    </div>
                    <span className={`text-[11px] font-medium ${isOverdue ? 'text-error' : 'text-text-tertiary'}`}>
                      {isOverdue
                        ? 'Overdue'
                        : project.dueDate
                          ? `Due ${new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : ''}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Create card */}
        <button
          onClick={() => setShowCreate(true)}
          className="group bg-transparent p-4 rounded-xl border-2 border-dashed border-[rgba(139,143,212,0.2)] hover:border-[rgba(139,143,212,0.4)] transition-all duration-300 flex flex-col items-center justify-center min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-full bg-elevated flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-primary text-[32px]">add</span>
          </div>
          <span className="text-[18px] font-semibold text-text-primary">New Project</span>
          <p className="text-[13px] text-text-tertiary mt-1">Start a fresh development cycle</p>
        </button>
      </div>

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />}
      {deleteId && (
        <DeleteConfirmModal
          name={projects[deleteId]?.name ?? ''}
          onConfirm={handleDelete}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
