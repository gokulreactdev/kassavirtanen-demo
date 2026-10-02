import type { Priority, Severity, Status, TaskType } from './types';

interface Option<T extends string> {
  value: T;
  label: string;
}

export const TASK_TYPES: Option<TaskType>[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'task', label: 'Task' },
];

export const PRIORITIES: Option<Priority>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const SEVERITIES: Option<Severity>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const STATUSES: Option<Status>[] = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const label = <T extends string>(options: Option<T>[], value: T): string =>
  options.find((o) => o.value === value)?.label ?? value;