import type { Project, Task, TaskPayload, User } from '../features/tasks/types';
import { request } from './client';

export const tasksApi = {
  getAll: () => request<Task[]>('/tasks'),
  create: (data: TaskPayload) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: TaskPayload) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};

export const metaApi = {
  getProjects: () => request<Project[]>('/projects'),
  getUsers: () => request<User[]>('/users'),
};