import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  PRIORITIES,
  SEVERITIES,
  STATUSES,
  TASK_TYPES,
  label,
} from "./constants";
import { selectUsers } from "./selectors";
import { deleteTaskRequest } from "./tasksSlice";
import type { Task } from "./types";
import { openEditModal } from "./uiSlice";

const todayISO = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (local)
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { timeZone: "UTC" });

export default function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const assignee = users.find((u) => u.id === task.assigneeId);

  const isOverdue =
    task.dueDate && task.status !== "done" && task.dueDate < todayISO();
  const subtasks = task.subtasks ?? [];
  const doneCount = subtasks.filter((s) => s.completed).length;
  const criteriaCount = task.acceptanceCriteria?.length ?? 0;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTaskRequest(task.id));
    }
  };

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
          <button
            className="btn-icon"
            title="Edit task"
            aria-label="Edit task"
            onClick={() => dispatch(openEditModal(task.id))}
          >
            ✏️
          </button>
          <button
            className="btn-icon"
            title="Delete task"
            aria-label="Delete task"
            onClick={handleDelete}
          >
            🗑️
          </button>
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
