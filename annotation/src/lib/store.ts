import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

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
}

const DEFAULT_COLUMNS: Omit<Column, 'taskIds'>[] = [
  { id: 'todo', title: 'To Do', color: '#6B7FFF' },
  { id: 'in_progress', title: 'In Progress', color: '#e1c562' },
  { id: 'in_review', title: 'In Review', color: '#9B6FD4' },
  { id: 'done', title: 'Done', color: '#4ade80' },
];

const SEED_TASKS: Task[] = [
  {
    id: 't1', projectId: 'p1', columnId: 'in_progress',
    title: 'Setup AWS VPC and subnets', description: 'Configure VPC, public/private subnets, NAT gateway',
    priority: 'high', assignee: 'Alex R.', dueDate: '2026-06-20', createdAt: new Date().toISOString(), tags: ['infrastructure'],
  },
  {
    id: 't2', projectId: 'p1', columnId: 'done',
    title: 'Terraform state backend', description: 'S3 bucket + DynamoDB lock table',
    priority: 'high', assignee: 'Jordan L.', createdAt: new Date().toISOString(), tags: ['terraform'],
  },
  {
    id: 't3', projectId: 'p1', columnId: 'todo',
    title: 'Load balancer configuration', description: 'ALB setup with health checks and SSL termination',
    priority: 'medium', dueDate: '2026-06-25', createdAt: new Date().toISOString(), tags: ['networking'],
  },
  {
    id: 't4', projectId: 'p2', columnId: 'in_progress',
    title: 'Implement WebAuthn flow', description: 'Biometric authentication using platform authenticators',
    priority: 'critical', assignee: 'Sarah C.', dueDate: '2026-06-15', createdAt: new Date().toISOString(), tags: ['auth', 'security'],
  },
  {
    id: 't5', projectId: 'p2', columnId: 'in_review',
    title: 'Multi-tenant session isolation', description: 'Ensure sessions are scoped per workspace',
    priority: 'high', assignee: 'Alex R.', createdAt: new Date().toISOString(), tags: ['security'],
  },
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'p1', name: 'Cloud Infrastructure', description: 'Scalable AWS architecture for high-traffic microservices with automated failover.',
    icon: 'cloud', color: '#8B8FD4', dueDate: '2026-06-28',
    members: ['Alex R.', 'Jordan L.', 'Sam K.'],
    columnOrder: ['todo', 'in_progress', 'in_review', 'done'],
    columns: {
      todo: { id: 'todo', title: 'To Do', color: '#6B7FFF', taskIds: ['t3'] },
      in_progress: { id: 'in_progress', title: 'In Progress', color: '#e1c562', taskIds: ['t1'] },
      in_review: { id: 'in_review', title: 'In Review', color: '#9B6FD4', taskIds: [] },
      done: { id: 'done', title: 'Done', color: '#4ade80', taskIds: ['t2'] },
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2', name: 'Auth Overhaul', description: 'Migrating to biometric-first WebAuthn with multi-tenant support.',
    icon: 'security', color: '#FB7185', dueDate: '2026-06-10',
    members: ['Sarah C.', 'Alex R.'],
    columnOrder: ['todo', 'in_progress', 'in_review', 'done'],
    columns: {
      todo: { id: 'todo', title: 'To Do', color: '#6B7FFF', taskIds: [] },
      in_progress: { id: 'in_progress', title: 'In Progress', color: '#e1c562', taskIds: ['t4'] },
      in_review: { id: 'in_review', title: 'In Review', color: '#9B6FD4', taskIds: ['t5'] },
      done: { id: 'done', title: 'Done', color: '#4ade80', taskIds: [] },
    },
    createdAt: new Date().toISOString(),
  },
];

const SEED_ACTIVITY: ActivityItem[] = [
  { id: 'a1', user: 'Alex Rivera', action: 'pushed 3 commits to', target: 'dev-flow/api-core', targetColor: '#bfc2ff', time: '24 minutes ago' },
  { id: 'a2', user: 'Sarah Chen', action: 'commented on', target: 'Issue #142: Auth Refactor', targetColor: '#e1c562', time: '2 hours ago' },
  { id: 'a3', user: 'Jordan Lee', action: 'closed pull request', target: '#89: Update Documentation', targetColor: '#8b8fd4', time: '5 hours ago' },
  { id: 'a4', user: 'Sam Kim', action: 'moved task to Done in', target: 'Cloud Infrastructure', targetColor: '#4ade80', time: 'Yesterday' },
];

function buildInitialState() {
  const projectsMap: Record<string, Project> = {};
  const tasksMap: Record<string, Task> = {};

  SEED_PROJECTS.forEach(p => { projectsMap[p.id] = p; });
  SEED_TASKS.forEach(t => { tasksMap[t.id] = t; });

  return { projectsMap, tasksMap };
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const { projectsMap, tasksMap } = buildInitialState();

export const useStore = create<DevFlowState>()(
  persist(
    (set) => ({
      projects: projectsMap,
      tasks: tasksMap,
      projectOrder: SEED_PROJECTS.map(p => p.id),
      activity: SEED_ACTIVITY,

      addProject: (data) => {
        const id = generateId();
        const columns: Record<string, Column> = {};
        const columnOrder = DEFAULT_COLUMNS.map(c => c.id);
        DEFAULT_COLUMNS.forEach(c => { columns[c.id] = { ...c, taskIds: [] }; });

        set(state => ({
          projects: { ...state.projects, [id]: { ...data, id, createdAt: new Date().toISOString(), columnOrder, columns } },
          projectOrder: [...state.projectOrder, id],
        }));
        return id;
      },

      updateProject: (id, updates) =>
        set(state => ({
          projects: { ...state.projects, [id]: { ...state.projects[id], ...updates } },
        })),

      deleteProject: (id) =>
        set(state => {
          const project = state.projects[id];
          if (!project) return state;
          const taskIdsToDelete = new Set(
            Object.values(project.columns).flatMap(c => c.taskIds)
          );
          const newTasks = { ...state.tasks };
          taskIdsToDelete.forEach(tid => delete newTasks[tid]);
          const newProjects = { ...state.projects };
          delete newProjects[id];
          return {
            projects: newProjects,
            tasks: newTasks,
            projectOrder: state.projectOrder.filter(pid => pid !== id),
          };
        }),

      addTask: (data) => {
        const id = generateId();
        const task: Task = { ...data, id, createdAt: new Date().toISOString() };
        set(state => {
          const project = state.projects[data.projectId];
          if (!project) return state;
          const col = project.columns[data.columnId];
          if (!col) return state;
          return {
            tasks: { ...state.tasks, [id]: task },
            projects: {
              ...state.projects,
              [data.projectId]: {
                ...project,
                columns: {
                  ...project.columns,
                  [data.columnId]: { ...col, taskIds: [...col.taskIds, id] },
                },
              },
            },
          };
        });
      },

      updateTask: (id, updates) =>
        set(state => ({
          tasks: { ...state.tasks, [id]: { ...state.tasks[id], ...updates } },
        })),

      deleteTask: (id) =>
        set(state => {
          const task = state.tasks[id];
          if (!task) return state;
          const project = state.projects[task.projectId];
          const col = project?.columns[task.columnId];
          if (!col) return state;
          const newTasks = { ...state.tasks };
          delete newTasks[id];
          return {
            tasks: newTasks,
            projects: {
              ...state.projects,
              [task.projectId]: {
                ...project,
                columns: {
                  ...project.columns,
                  [task.columnId]: { ...col, taskIds: col.taskIds.filter(tid => tid !== id) },
                },
              },
            },
          };
        }),

      moveTask: (taskId, sourceColId, destColId, sourceIndex, destIndex, projectId) =>
        set(state => {
          const project = state.projects[projectId];
          if (!project) return state;
          const sourceCol = project.columns[sourceColId];
          const destCol = project.columns[destColId];
          if (!sourceCol || !destCol) return state;

          if (sourceColId === destColId) {
            const newTaskIds = [...sourceCol.taskIds];
            newTaskIds.splice(sourceIndex, 1);
            newTaskIds.splice(destIndex, 0, taskId);
            return {
              projects: {
                ...state.projects,
                [projectId]: {
                  ...project,
                  columns: { ...project.columns, [sourceColId]: { ...sourceCol, taskIds: newTaskIds } },
                },
              },
            };
          }

          const newSourceIds = [...sourceCol.taskIds];
          newSourceIds.splice(sourceIndex, 1);
          const newDestIds = [...destCol.taskIds];
          newDestIds.splice(destIndex, 0, taskId);

          return {
            tasks: { ...state.tasks, [taskId]: { ...state.tasks[taskId], columnId: destColId } },
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                columns: {
                  ...project.columns,
                  [sourceColId]: { ...sourceCol, taskIds: newSourceIds },
                  [destColId]: { ...destCol, taskIds: newDestIds },
                },
              },
            },
          };
        }),

      addColumn: (projectId, title, color) =>
        set(state => {
          const project = state.projects[projectId];
          if (!project) return state;
          const id = generateId();
          return {
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                columnOrder: [...project.columnOrder, id],
                columns: { ...project.columns, [id]: { id, title, color, taskIds: [] } },
              },
            },
          };
        }),

      deleteColumn: (projectId, columnId) =>
        set(state => {
          const project = state.projects[projectId];
          if (!project) return state;
          const col = project.columns[columnId];
          const newTasks = { ...state.tasks };
          col?.taskIds.forEach(tid => delete newTasks[tid]);
          const newColumns = { ...project.columns };
          delete newColumns[columnId];
          return {
            tasks: newTasks,
            projects: {
              ...state.projects,
              [projectId]: {
                ...project,
                columnOrder: project.columnOrder.filter(id => id !== columnId),
                columns: newColumns,
              },
            },
          };
        }),
    }),
    { name: 'devflow-storage' }
  )
);

// Derived selectors
export function getProjectProgress(project: Project, tasks: Record<string, Task>) {
  const allTaskIds = Object.values(project.columns).flatMap(c => c.taskIds);
  if (allTaskIds.length === 0) return 0;
  const doneCol = project.columns['done'];
  const doneCount = doneCol?.taskIds.length ?? 0;
  return Math.round((doneCount / allTaskIds.length) * 100);
}

export function getProjectDeadlines(projects: Record<string, Project>) {
  return Object.values(projects)
    .filter(p => p.dueDate)
    .map(p => ({ projectId: p.id, name: p.name, dueDate: p.dueDate!, color: p.color }));
}
