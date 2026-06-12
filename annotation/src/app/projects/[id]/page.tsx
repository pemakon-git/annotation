'use client';

import { useState, use, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore, Task, Column, Priority } from '@/lib/store';
import EnvPanel from '@/components/project/EnvPanel';

const PRIORITY_STYLES: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  medium: { label: 'Medium', color: 'text-tertiary', bg: 'bg-tertiary/10' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  critical: { label: 'Critical', color: 'text-error', bg: 'bg-error/10' },
};

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard = memo(function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const ps = PRIORITY_STYLES[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.columnId !== 'done';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-surface border rounded-xl p-3 mb-2 cursor-grab active:cursor-grabbing transition-[background-color,border-color,box-shadow] duration-150 ${
            snapshot.isDragging
              ? 'border-[rgba(139,143,212,0.5)] shadow-xl shadow-black/40 bg-elevated'
              : 'border-[rgba(139,143,212,0.15)] hover:border-[rgba(139,143,212,0.35)] hover:bg-elevated'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] font-medium text-text-primary leading-5 flex-1 mr-2">{task.title}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-surface-container text-text-tertiary hover:text-text-primary transition-colors">
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </button>
              <button onClick={() => onDelete(task.id)} className="p-1 rounded hover:bg-error/10 text-text-tertiary hover:text-error transition-colors">
                <span className="material-symbols-outlined text-[14px]">delete</span>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-[12px] text-text-tertiary mb-2 line-clamp-2">{task.description}</p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-container/20 text-primary">{tag}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${ps.bg} ${ps.color}`}>{ps.label}</span>
            <div className="flex items-center gap-2">
              {task.dueDate && (
                <span className={`text-[10px] flex items-center gap-0.5 ${isOverdue ? 'text-error' : 'text-text-tertiary'}`}>
                  <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
              {task.assignee && (
                <div className="w-5 h-5 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-[9px] font-semibold">
                  {task.assignee.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

interface TaskModalProps {
  projectId: string;
  columnId: string;
  task?: Task;
  onClose: () => void;
  columns: Column[];
}

function TaskModal({ projectId, columnId, task, onClose, columns }: TaskModalProps) {
  const { addTask, updateTask } = useStore();
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium');
  const [assignee, setAssignee] = useState(task?.assignee ?? '');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');
  const [tagsInput, setTagsInput] = useState(task?.tags.join(', ') ?? '');
  const [selectedColumnId, setSelectedColumnId] = useState(task?.columnId ?? columnId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (task) {
      updateTask(task.id, { title: title.trim(), description: description.trim(), priority, assignee: assignee.trim() || undefined, dueDate: dueDate || undefined, tags });
    } else {
      addTask({ projectId, columnId: selectedColumnId, title: title.trim(), description: description.trim(), priority, assignee: assignee.trim() || undefined, dueDate: dueDate || undefined, tags });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface border border-[rgba(139,143,212,0.35)] rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-semibold text-text-primary">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Task details..."
              rows={3}
              className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Column</label>
              <select
                value={selectedColumnId}
                onChange={e => setSelectedColumnId(e.target.value)}
                className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Assignee</label>
              <input
                type="text"
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                placeholder="e.g. Alex R."
                className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. frontend, api, bug"
              className="w-full bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[14px] text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-[rgba(139,143,212,0.35)] text-text-secondary hover:text-text-primary text-[14px] font-medium transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container text-[14px] font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            >
              {task ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function KanbanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects, tasks, moveTask, deleteTask } = useStore();
  const project = projects[id];

  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEnvPanel, setShowEnvPanel] = useState(false);

  // All hooks before early return (Rules of Hooks)
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || !project) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    moveTask(draggableId, source.droppableId, destination.droppableId, source.index, destination.index, project.id);
  }, [moveTask, project]);

  const handleEdit = useCallback((task: Task) => setEditingTask(task), []);
  const handleDelete = useCallback((tid: string) => deleteTask(tid), [deleteTask]);

  // Pre-compute column→tasks so TaskCard memo can benefit from stable references
  const columnTasksMap = useMemo(() => {
    if (!project) return {} as Record<string, Task[]>;
    return Object.fromEntries(
      project.columnOrder.map(colId => {
        const col = project.columns[colId];
        return [colId, (col?.taskIds ?? []).map(tid => tasks[tid]).filter(Boolean) as Task[]];
      })
    );
  }, [project, tasks]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <span className="material-symbols-outlined text-[64px] text-text-tertiary">folder_off</span>
        <p className="text-[18px] text-text-secondary">Project not found</p>
        <Link href="/projects" className="text-primary hover:underline text-[14px]">Back to Projects</Link>
      </div>
    );
  }

  const totalTasks = Object.values(project.columns).reduce((sum, col) => sum + col.taskIds.length, 0);
  const doneTasks = project.columns['done']?.taskIds.length ?? 0;

  return (
    <div className="flex flex-col h-[calc(100vh-52px)]">
      {/* Project header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(139,143,212,0.15)] bg-surface flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-text-tertiary hover:text-text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: project.color + '25' }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: project.color }}>{project.icon}</span>
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-text-primary">{project.name}</h1>
            <p className="text-[12px] text-text-secondary">{doneTasks}/{totalTasks} tasks done</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {project.dueDate && (
            <span className="text-[12px] text-text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">flag</span>
              {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          <button
            onClick={() => setShowEnvPanel(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(139,143,212,0.25)] text-text-secondary hover:text-text-primary hover:border-[rgba(139,143,212,0.45)] text-[12px] font-medium transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px]">vpn_key</span>
            Env
          </button>
          <button
            onClick={() => setAddingToColumn(project.columnOrder[0])}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-[12px] font-medium hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 p-6 h-full min-w-max">
            {project.columnOrder.map(colId => {
              const column = project.columns[colId];
              if (!column) return null;
              const columnTasks = columnTasksMap[colId] ?? [];

              return (
                <div key={colId} className="flex flex-col w-72 flex-shrink-0">
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
                      <h3 className="text-[12px] font-semibold text-text-primary uppercase tracking-widest">{column.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-text-secondary text-[10px] font-medium">{columnTasks.length}</span>
                    </div>
                    <button
                      onClick={() => setAddingToColumn(colId)}
                      className="p-1 rounded hover:bg-elevated text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={colId}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`rounded-xl p-2 transition-colors min-h-[120px] ${
                          snapshot.isDraggingOver
                            ? 'bg-primary-container/10 border border-dashed border-primary/30'
                            : 'bg-surface-container-low'
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                        {provided.placeholder}

                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                          <button
                            onClick={() => setAddingToColumn(colId)}
                            className="w-full py-6 text-[12px] text-text-tertiary hover:text-text-secondary border border-dashed border-[rgba(139,143,212,0.15)] hover:border-[rgba(139,143,212,0.3)] rounded-lg transition-colors flex flex-col items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Add task
                          </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Add task modal */}
      {addingToColumn && (
        <TaskModal
          projectId={project.id}
          columnId={addingToColumn}
          columns={project.columnOrder.map(cid => project.columns[cid]).filter(Boolean) as Column[]}
          onClose={() => setAddingToColumn(null)}
        />
      )}

      {/* Edit task modal */}
      {editingTask && (
        <TaskModal
          projectId={project.id}
          columnId={editingTask.columnId}
          task={editingTask}
          columns={project.columnOrder.map(cid => project.columns[cid]).filter(Boolean) as Column[]}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Env panel */}
      {showEnvPanel && (
        <EnvPanel projectId={project.id} onClose={() => setShowEnvPanel(false)} />
      )}
    </div>
  );
}
