import { useAppSelector } from "../../store/hooks";
import {
  PRIORITIES,
  SEVERITIES,
  STATUSES,
  TASK_TYPES,
  label,
} from "./constants";
import { selectUsers } from "./selectors";
import type { Task } from "./types";

const todayISO = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (local)
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { timeZone: "UTC" });

export default function TaskCard({ task }: { task: Task }) {
  const users = useAppSelector(selectUsers);
  const assignee = users.find((u) => u.id === task.assigneeId);

  const isOverdue =
    task.dueDate && task.status !== "done" && task.dueDate < todayISO();
  const subtasks = task.subtasks ?? [];
  const doneCount = subtasks.filter((s) => s.completed).length;
  const criteriaCount = task.acceptanceCriteria?.length ?? 0;

  return (
    <article className={`task-card type-${task.type}`}>
      <div className="task-card-top">
        <span className={`badge badge-${task.type}`}>
          {label(TASK_TYPES, task.type)}
        </span>
        <span className={`status status-${task.status}`}>
          {label(STATUSES, task.status)}
        </span>
        <div className="task-card-actions">
          {/* edit / delete added in a later commit */}
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-desc">{task.description}</p>}

      {task.type === "bug" && (
        <>
          {task.severity && (
            <div className="task-meta">
              Severity:{" "}
              <span className={`severity-${task.severity}`}>
                {label(SEVERITIES, task.severity)}
              </span>
            </div>
          )}
          {subtasks.length > 0 && (
            <div className="task-meta">
              Subtasks: {doneCount}/{subtasks.length}
            </div>
          )}
        </>
      )}

      {task.type === "feature" && criteriaCount > 0 && (
        <div className="task-meta">{criteriaCount} acceptance criteria</div>
      )}

      <div className="task-footer">
        <span>Assigned to: {assignee?.name ?? "Unassigned"}</span>
        {task.dueDate && (
          <span className={isOverdue ? "overdue" : ""}>
            Due: {formatDate(task.dueDate)}
          </span>
        )}
        <span>
          Priority:{" "}
          <span className={`priority-${task.priority}`}>
            {label(PRIORITIES, task.priority)}
          </span>
        </span>
      </div>
    </article>
  );
}
