import type { Priority, Status, Task, TaskPayload, TaskType } from './types';

export interface FormValues {
  title: string;
  type: TaskType;
  priority: Priority;
  status: Status;
  projectId: string;
  assigneeId: string;
  description: string;
  dueDate: string;
}

export const emptyValues: FormValues = {
  title: '',
  type: 'bug',
  priority: 'medium',
  status: 'todo',
  projectId: '',
  assigneeId: '',
  description: '',
  dueDate: '',
};

export const toFormValues = (task: Task | null): FormValues =>
  !task
    ? emptyValues
    : {
        title: task.title,
        type: task.type,
        priority: task.priority,
        status: task.status,
        projectId: task.projectId ?? '',
        assigneeId: task.assigneeId ?? '',
        description: task.description,
        dueDate: task.dueDate ?? '',
      };

export const toPayload = (v: FormValues): TaskPayload => ({
  title: v.title.trim(),
  type: v.type,
  priority: v.priority,
  status: v.status,
  projectId: v.projectId || null,
  assigneeId: v.assigneeId || null,
  description: v.description.trim(),
  dueDate: v.dueDate || null,
});