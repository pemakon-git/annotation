import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type EnvEnvironment = 'dev' | 'staging' | 'prod';

export interface EnvVar {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export interface DocPage {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  tags: string[];
}

export interface Column {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dueDate?: string;
  members: string[];
  columnOrder: string[];
  columns: Record<string, Column>;
  envSets?: Partial<Record<EnvEnvironment, EnvVar[]>>;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar?: string;
  action: string;
  target: string;
  targetColor?: string;
  time: string;
}

interface DevFlowState {
  projects: Record<string, Project>;
  tasks: Record<string, Task>;
  projectOrder: string[];
  activity: ActivityItem[];
  docs: DocPage[];

  // Lifecycle
  loaded: boolean;
  hydrate: () => Promise<void>;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'columnOrder' | 'columns'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, sourceColId: string, destColId: string, sourceIndex: number, destIndex: number, projectId: string) => void;

  // Column actions
  addColumn: (projectId: string, title: string, color: string) => void;
  deleteColumn: (projectId: string, columnId: string) => void;

  // Env var actions
  addEnvVar: (projectId: string, env: EnvEnvironment, variable: Omit<EnvVar, 'id'>) => void;
  updateEnvVar: (projectId: string, env: EnvEnvironment, id: string, updates: Partial<Omit<EnvVar, 'id'>>) => void;
  deleteEnvVar: (projectId: string, env: EnvEnvironment, id: string) => void;

  // Doc actions
  addDocPage: (title: string) => string;
  updateDocPage: (id: string, updates: Partial<Pick<DocPage, 'title' | 'content'>>) => void;
  deleteDocPage: (id: string) => void;
}

const DEFAULT_COLUMNS: Omit<Column, 'taskIds'>[] = [
  { id: 'todo', title: 'To Do', color: '#6B7FFF' },
  { id: 'in_progress', title: 'In Progress', color: '#e1c562' },
  { id: 'in_review', title: 'In Review', color: '#9B6FD4' },
  { id: 'done', title: 'Done', color: '#4ade80' },
];

// Display-only demo feed. There is no activity table yet (no events generate
// activity), so this stays in memory rather than in Supabase.
const DEMO_ACTIVITY: ActivityItem[] = [
  { id: 'a1', user: 'Alex Rivera', action: 'pushed 3 commits to', target: 'dev-flow/api-core', targetColor: '#bfc2ff', time: '24 minutes ago' },
  { id: 'a2', user: 'Sarah Chen', action: 'commented on', target: 'Issue #142: Auth Refactor', targetColor: '#e1c562', time: '2 hours ago' },
  { id: 'a3', user: 'Jordan Lee', action: 'closed pull request', target: '#89: Update Documentation', targetColor: '#8b8fd4', time: '5 hours ago' },
  { id: 'a4', user: 'Sam Kim', action: 'moved task to Done in', target: 'Cloud Infrastructure', targetColor: '#4ade80', time: 'Yesterday' },
];

function generateId() {
  return crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Supabase client (lazy singleton — only created in the browser)
// ---------------------------------------------------------------------------
let _supabase: ReturnType<typeof createClient> | null = null;
function db() {
  if (!_supabase) _supabase = createClient();
  return _supabase;
}

// ---------------------------------------------------------------------------
// Row <-> store mappers
// ---------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProject(row: any): Project {
  const envSets = row.env_sets ?? {};
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    icon: row.icon ?? 'folder',
    color: row.color ?? '#8B8FD4',
    dueDate: row.due_date ?? undefined,
    members: row.members ?? [],
    columnOrder: row.column_order ?? [],
    columns: row.columns ?? {},
    envSets: Object.keys(envSets).length ? envSets : undefined,
    createdAt: row.created_at,
  };
}

function projectToRow(p: Project) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    icon: p.icon,
    color: p.color,
    due_date: p.dueDate ?? null,
    members: p.members,
    column_order: p.columnOrder,
    columns: p.columns,
    env_sets: p.envSets ?? {},
    created_at: p.createdAt,
  };
}

function rowToTask(row: any): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    columnId: row.column_id,
    title: row.title,
    description: row.description ?? '',
    priority: row.priority ?? 'medium',
    assignee: row.assignee ?? undefined,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
    tags: row.tags ?? [],
  };
}

function taskToRow(t: Task) {
  return {
    id: t.id,
    project_id: t.projectId,
    column_id: t.columnId,
    title: t.title,
    description: t.description,
    priority: t.priority,
    assignee: t.assignee ?? null,
    due_date: t.dueDate ?? null,
    tags: t.tags,
    created_at: t.createdAt,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Persistence helpers (fire-and-forget; log on failure)
// ---------------------------------------------------------------------------
function logError(context: string, error: unknown) {
  if (!error) return;
  // Supabase/PostgREST errors expose message/code/details/hint as
  // non-enumerable-ish fields, so spell them out for a readable log.
  const e = error as { message?: string; code?: string; details?: string; hint?: string };
  console.error(`[store] ${context}: ${e.message ?? 'error'}${e.code ? ` (${e.code})` : ''}`, e.details ?? '', e.hint ?? '');
}

function saveProject(project: Project) {
  db().from('projects').upsert(projectToRow(project)).then(({ error }) => logError('saveProject', error));
}
function removeProject(id: string) {
  db().from('projects').delete().eq('id', id).then(({ error }) => logError('removeProject', error));
}
function saveTask(task: Task) {
  db().from('tasks').upsert(taskToRow(task)).then(({ error }) => logError('saveTask', error));
}
function removeTask(id: string) {
  db().from('tasks').delete().eq('id', id).then(({ error }) => logError('removeTask', error));
}
function saveDoc(doc: DocPage) {
  db()
    .from('docs')
    .upsert({ id: doc.id, title: doc.title, content: doc.content, updated_at: doc.updatedAt })
    .then(({ error }) => logError('saveDoc', error));
}
function removeDoc(id: string) {
  db().from('docs').delete().eq('id', id).then(({ error }) => logError('removeDoc', error));
}

export const useStore = create<DevFlowState>()((set, get) => ({
  projects: {},
  tasks: {},
  projectOrder: [],
  activity: DEMO_ACTIVITY,
  docs: [],
  loaded: false,

  hydrate: async () => {
    const supabase = db();
    const [projectsRes, tasksRes, docsRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: true }),
      supabase.from('tasks').select('*'),
      supabase.from('docs').select('*').order('updated_at', { ascending: true }),
    ]);

    logError('hydrate.projects', projectsRes.error);
    logError('hydrate.tasks', tasksRes.error);
    logError('hydrate.docs', docsRes.error);

    const projects: Record<string, Project> = {};
    const projectOrder: string[] = [];
    (projectsRes.data ?? []).forEach((row) => {
      const p = rowToProject(row);
      projects[p.id] = p;
      projectOrder.push(p.id);
    });

    const tasks: Record<string, Task> = {};
    (tasksRes.data ?? []).forEach((row) => {
      const t = rowToTask(row);
      tasks[t.id] = t;
    });

    const docs: DocPage[] = (docsRes.data ?? []).map(rowToDoc);

    set({ projects, projectOrder, tasks, docs, loaded: true });
  },

  addProject: (data) => {
    const id = generateId();
    const columns: Record<string, Column> = {};
    const columnOrder = DEFAULT_COLUMNS.map((c) => c.id);
    DEFAULT_COLUMNS.forEach((c) => {
      columns[c.id] = { ...c, taskIds: [] };
    });

    const project: Project = { ...data, id, createdAt: new Date().toISOString(), columnOrder, columns };

    set((state) => ({
      projects: { ...state.projects, [id]: project },
      projectOrder: [...state.projectOrder, id],
    }));
    saveProject(project);
    return id;
  },

  updateProject: (id, updates) => {
    const current = get().projects[id];
    if (!current) return;
    const updated = { ...current, ...updates };
    set((state) => ({ projects: { ...state.projects, [id]: updated } }));
    saveProject(updated);
  },

  deleteProject: (id) => {
    const project = get().projects[id];
    if (!project) return;
    const taskIdsToDelete = new Set(Object.values(project.columns).flatMap((c) => c.taskIds));

    set((state) => {
      const newTasks = { ...state.tasks };
      taskIdsToDelete.forEach((tid) => delete newTasks[tid]);
      const newProjects = { ...state.projects };
      delete newProjects[id];
      return {
        projects: newProjects,
        tasks: newTasks,
        projectOrder: state.projectOrder.filter((pid) => pid !== id),
      };
    });
    // Tasks are removed automatically by the ON DELETE CASCADE foreign key.
    removeProject(id);
  },

  addTask: (data) => {
    const id = generateId();
    const task: Task = { ...data, id, createdAt: new Date().toISOString() };
    const project = get().projects[data.projectId];
    if (!project) return;
    const col = project.columns[data.columnId];
    if (!col) return;

    const updatedProject: Project = {
      ...project,
      columns: {
        ...project.columns,
        [data.columnId]: { ...col, taskIds: [...col.taskIds, id] },
      },
    };

    set((state) => ({
      tasks: { ...state.tasks, [id]: task },
      projects: { ...state.projects, [data.projectId]: updatedProject },
    }));
    saveTask(task);
    saveProject(updatedProject);
  },

  updateTask: (id, updates) => {
    const current = get().tasks[id];
    if (!current) return;
    const updated = { ...current, ...updates };
    set((state) => ({ tasks: { ...state.tasks, [id]: updated } }));
    saveTask(updated);
  },

  deleteTask: (id) => {
    const task = get().tasks[id];
    if (!task) return;
    const project = get().projects[task.projectId];
    const col = project?.columns[task.columnId];
    if (!project || !col) return;

    const updatedProject: Project = {
      ...project,
      columns: {
        ...project.columns,
        [task.columnId]: { ...col, taskIds: col.taskIds.filter((tid) => tid !== id) },
      },
    };

    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[id];
      return {
        tasks: newTasks,
        projects: { ...state.projects, [task.projectId]: updatedProject },
      };
    });
    removeTask(id);
    saveProject(updatedProject);
  },

  moveTask: (taskId, sourceColId, destColId, sourceIndex, destIndex, projectId) => {
    const project = get().projects[projectId];
    if (!project) return;
    const sourceCol = project.columns[sourceColId];
    const destCol = project.columns[destColId];
    if (!sourceCol || !destCol) return;

    if (sourceColId === destColId) {
      const newTaskIds = [...sourceCol.taskIds];
      newTaskIds.splice(sourceIndex, 1);
      newTaskIds.splice(destIndex, 0, taskId);
      const updatedProject: Project = {
        ...project,
        columns: { ...project.columns, [sourceColId]: { ...sourceCol, taskIds: newTaskIds } },
      };
      set((state) => ({ projects: { ...state.projects, [projectId]: updatedProject } }));
      saveProject(updatedProject);
      return;
    }

    const newSourceIds = [...sourceCol.taskIds];
    newSourceIds.splice(sourceIndex, 1);
    const newDestIds = [...destCol.taskIds];
    newDestIds.splice(destIndex, 0, taskId);

    const updatedProject: Project = {
      ...project,
      columns: {
        ...project.columns,
        [sourceColId]: { ...sourceCol, taskIds: newSourceIds },
        [destColId]: { ...destCol, taskIds: newDestIds },
      },
    };
    const movedTask = get().tasks[taskId];
    const updatedTask = movedTask ? { ...movedTask, columnId: destColId } : undefined;

    set((state) => ({
      tasks: updatedTask ? { ...state.tasks, [taskId]: updatedTask } : state.tasks,
      projects: { ...state.projects, [projectId]: updatedProject },
    }));
    saveProject(updatedProject);
    if (updatedTask) saveTask(updatedTask);
  },

  addColumn: (projectId, title, color) => {
    const project = get().projects[projectId];
    if (!project) return;
    const id = generateId();
    const updatedProject: Project = {
      ...project,
      columnOrder: [...project.columnOrder, id],
      columns: { ...project.columns, [id]: { id, title, color, taskIds: [] } },
    };
    set((state) => ({ projects: { ...state.projects, [projectId]: updatedProject } }));
    saveProject(updatedProject);
  },

  deleteColumn: (projectId, columnId) => {
    const project = get().projects[projectId];
    if (!project) return;
    const col = project.columns[columnId];
    const removedTaskIds = col?.taskIds ?? [];

    const newColumns = { ...project.columns };
    delete newColumns[columnId];
    const updatedProject: Project = {
      ...project,
      columnOrder: project.columnOrder.filter((id) => id !== columnId),
      columns: newColumns,
    };

    set((state) => {
      const newTasks = { ...state.tasks };
      removedTaskIds.forEach((tid) => delete newTasks[tid]);
      return {
        tasks: newTasks,
        projects: { ...state.projects, [projectId]: updatedProject },
      };
    });
    removedTaskIds.forEach(removeTask);
    saveProject(updatedProject);
  },

  addEnvVar: (projectId, env, variable) => {
    const project = get().projects[projectId];
    if (!project) return;
    const envSets = project.envSets ?? {};
    const current = envSets[env] ?? [];
    const updatedProject: Project = {
      ...project,
      envSets: { ...envSets, [env]: [...current, { ...variable, id: generateId() }] },
    };
    set((state) => ({ projects: { ...state.projects, [projectId]: updatedProject } }));
    saveProject(updatedProject);
  },

  updateEnvVar: (projectId, env, id, updates) => {
    const project = get().projects[projectId];
    if (!project) return;
    const envSets = project.envSets ?? {};
    const current = envSets[env] ?? [];
    const updatedProject: Project = {
      ...project,
      envSets: { ...envSets, [env]: current.map((v) => (v.id === id ? { ...v, ...updates } : v)) },
    };
    set((state) => ({ projects: { ...state.projects, [projectId]: updatedProject } }));
    saveProject(updatedProject);
  },

  deleteEnvVar: (projectId, env, id) => {
    const project = get().projects[projectId];
    if (!project) return;
    const envSets = project.envSets ?? {};
    const current = envSets[env] ?? [];
    const updatedProject: Project = {
      ...project,
      envSets: { ...envSets, [env]: current.filter((v) => v.id !== id) },
    };
    set((state) => ({ projects: { ...state.projects, [projectId]: updatedProject } }));
    saveProject(updatedProject);
  },

  addDocPage: (title) => {
    const id = generateId();
    const doc: DocPage = { id, title, content: '', updatedAt: new Date().toISOString() };
    set((state) => ({ docs: [...state.docs, doc] }));
    saveDoc(doc);
    return id;
  },

  updateDocPage: (id, updates) => {
    const current = get().docs.find((d) => d.id === id);
    if (!current) return;
    const updated: DocPage = { ...current, ...updates, updatedAt: new Date().toISOString() };
    set((state) => ({ docs: state.docs.map((d) => (d.id === id ? updated : d)) }));
    saveDoc(updated);
  },

  deleteDocPage: (id) => {
    set((state) => ({ docs: state.docs.filter((d) => d.id !== id) }));
    removeDoc(id);
  },
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToDoc(row: any): DocPage {
  return { id: row.id, title: row.title, content: row.content ?? '', updatedAt: row.updated_at };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Derived selectors
export function getProjectProgress(project: Project, tasks: Record<string, Task>) {
  const allTaskIds = Object.values(project.columns).flatMap((c) => c.taskIds);
  if (allTaskIds.length === 0) return 0;
  const doneCol = project.columns['done'];
  const doneCount = doneCol?.taskIds.length ?? 0;
  return Math.round((doneCount / allTaskIds.length) * 100);
}

export function getProjectDeadlines(projects: Record<string, Project>) {
  return Object.values(projects)
    .filter((p) => p.dueDate)
    .map((p) => ({ projectId: p.id, name: p.name, dueDate: p.dueDate!, color: p.color }));
}
