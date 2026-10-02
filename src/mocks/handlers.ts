import { http, HttpResponse, delay } from "msw";
import type { Project, Task, TaskPayload, User } from "../features/tasks/types";

const STORAGE_KEY = "task-dashboard:tasks";

const projects: Project[] = [
  { id: "p1", name: "E-commerce Platform" },
  { id: "p2", name: "Mobile App" },
  { id: "p3", name: "Analytics Dashboard" },
];

const users: User[] = [
  { id: "u1", name: "User 1" },
  { id: "u2", name: "User 2" },
  { id: "u3", name: "John Doe" },
  { id: "u4", name: "Jane Smith" },
];

const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Fix login bug",
    type: "bug",
    status: "in-progress",
    priority: "high",
    projectId: "p1",
    assigneeId: "u1",
    description: "Users cannot login with special characters in password",
    dueDate: "2024-02-15",
    severity: "medium",
    stepsToReproduce:
      "1. Enter password with @ symbol\n2. Click login\n3. Error appears",
    subtasks: [
      { title: "Investigate password validation", completed: true },
      { title: "Update validation regex", completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Add dark mode",
    type: "feature",
    status: "todo",
    priority: "medium",
    projectId: "p2",
    assigneeId: "u2",
    description: "Implement dark theme toggle",
    dueDate: null,
    acceptanceCriteria: [
      "Toggle is visible in settings",
      "Theme persists after reload",
      "All screens support dark colors",
    ],
    createdAt: new Date().toISOString(),
  },
];

// Persist in localStorage so tasks survive a page reload (acts like a real backend)
const load = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : seedTasks;
  } catch {
    return seedTasks;
  }
};

let tasks: Task[] = load();

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* ignore */
  }
};

function validateTask(body: Partial<TaskPayload>): string | null {
  if (!body.title || !body.title.trim()) return "Title is required";
  if (!body.type || !["bug", "feature", "task"].includes(body.type)) {
    return "Task type is invalid";
  }
  if (!body.priority || !["low", "medium", "high"].includes(body.priority)) {
    return "Priority is invalid";
  }
  if (body.type === "bug" && !body.severity)
    return "Severity is required for bugs";
  return null;
}

export const handlers = [
  http.get("/api/projects", async () => {
    await delay(200);
    return HttpResponse.json(projects);
  }),

  http.get("/api/users", async () => {
    await delay(200);
    return HttpResponse.json(users);
  }),

  http.get("/api/tasks", async () => {
    await delay(400);
    return HttpResponse.json(tasks);
  }),

  http.post("/api/tasks", async ({ request }) => {
    const body = (await request.json()) as TaskPayload;
    await delay(600);

    const error = validateTask(body);
    if (error) return HttpResponse.json({ message: error }, { status: 400 });

    const task: Task = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    tasks = [...tasks, task];
    persist();
    return HttpResponse.json(task, { status: 201 });
  }),

  http.put("/api/tasks/:id", async ({ request, params }) => {
    const body = (await request.json()) as TaskPayload;
    const id = String(params.id);
    await delay(600);

    const existing = tasks.find((t) => t.id === id);
    if (!existing) {
      return HttpResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const error = validateTask(body);
    if (error) return HttpResponse.json({ message: error }, { status: 400 });

    // Replace (not merge) so fields from a previous task type disappear
    const updated: Task = {
      ...body,
      id: existing.id,
      createdAt: existing.createdAt,
    };
    tasks = tasks.map((t) => (t.id === existing.id ? updated : t));
    persist();
    return HttpResponse.json(updated);
  }),

  http.delete("/api/tasks/:id", async ({ params }) => {
    const id = String(params.id);
    await delay(400);

    const exists = tasks.some((t) => t.id === id);
    if (!exists) {
      return HttpResponse.json({ message: "Task not found" }, { status: 404 });
    }

    tasks = tasks.filter((t) => t.id !== id);
    persist();
    return new HttpResponse(null, { status: 204 });
  }),
];
