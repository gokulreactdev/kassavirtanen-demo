import type {
  Priority,
  Severity,
  Status,
  Task,
  TaskPayload,
  TaskType,
} from "./types";

export interface FormValues {
  title: string;
  type: TaskType;
  priority: Priority;
  status: Status;
  projectId: string;
  assigneeId: string;
  description: string;
  dueDate: string;
  // bug
  severity: Severity;
  stepsToReproduce: string;
  subtasks: { title: string; completed: boolean }[];
  // feature
  acceptanceCriteria: { text: string }[];
}

export const emptyValues: FormValues = {
  title: "",
  type: "bug",
  priority: "medium",
  status: "todo",
  projectId: "",
  assigneeId: "",
  description: "",
  dueDate: "",
  severity: "medium",
  stepsToReproduce: "",
  subtasks: [],
  acceptanceCriteria: [],
};

export const toFormValues = (task: Task | null): FormValues => {
  if (!task) return emptyValues;
  return {
    ...emptyValues,
    title: task.title,
    type: task.type,
    priority: task.priority,
    status: task.status,
    projectId: task.projectId ?? "",
    assigneeId: task.assigneeId ?? "",
    description: task.description,
    dueDate: task.dueDate ?? "",
    severity: task.severity ?? "medium",
    stepsToReproduce: task.stepsToReproduce ?? "",
    subtasks: task.subtasks ?? [],
    // useFieldArray needs objects, the API stores plain strings
    acceptanceCriteria: (task.acceptanceCriteria ?? []).map((text) => ({
      text,
    })),
  };
};

export const toPayload = (v: FormValues): TaskPayload => {
  const base: TaskPayload = {
    title: v.title.trim(),
    type: v.type,
    priority: v.priority,
    status: v.status,
    projectId: v.projectId || null,
    assigneeId: v.assigneeId || null,
    description: v.description.trim(),
    dueDate: v.dueDate || null,
  };

  // Only send fields that belong to the selected task type
  if (v.type === "bug") {
    return {
      ...base,
      severity: v.severity,
      stepsToReproduce: v.stepsToReproduce.trim(),
      subtasks: v.subtasks
        .map((s) => ({
          title: s.title.trim(),
          completed: Boolean(s.completed),
        }))
        .filter((s) => s.title),
    };
  }

  if (v.type === "feature") {
    return {
      ...base,
      acceptanceCriteria: v.acceptanceCriteria
        .map((c) => c.text.trim())
        .filter(Boolean),
    };
  }

  return base;
};
