export type TaskType = 'bug' | 'feature' | 'task';
export type Priority = 'low' | 'medium' | 'high';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: Status;
  priority: Priority;
  projectId: string | null;
  assigneeId: string | null;
  description: string;
  dueDate: string | null; // YYYY-MM-DD
  createdAt: string;
  // bug only
  severity?: Severity;
  stepsToReproduce?: string;
  subtasks?: Subtask[];
  // feature only
  acceptanceCriteria?: string[];
}

export type TaskPayload = Omit<Task, 'id' | 'createdAt'>;

export interface Project {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
}

export interface Filters {
  search: string;
  projectId: string;
  assigneeId: string;
  status: string;
  type: string;
}