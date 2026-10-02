import { http, HttpResponse, delay } from 'msw';

let tasks = [
  {
    id: '1',
    title: 'Sample task',
    description: 'This comes from the mock API',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-12-31',
    assignee: 'Gokul',
    createdAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get('/api/tasks', async () => {
    await delay(400);
    return HttpResponse.json(tasks);
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json();
    await delay(600);

    if (!body.title?.trim()) {
      return HttpResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const task = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    };
    tasks = [task, ...tasks];
    return HttpResponse.json(task, { status: 201 });
  }),
];