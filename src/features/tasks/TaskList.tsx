import { useAppSelector } from "../../store/hooks";
import TaskCard from "./TaskCard";
import { selectFilteredTasks } from "./selectors";

export default function TaskList() {
  const tasks = useAppSelector(selectFilteredTasks);
  const listStatus = useAppSelector((s) => s.tasks.listStatus);
  const error = useAppSelector((s) => s.tasks.error);

  return (
    <section className="panel task-list">
      <h2>Tasks ({tasks.length})</h2>
      {error && <div className="banner-error">{error}</div>}

      {listStatus === "loading" && tasks.length === 0 ? (
        <p className="loading">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">No tasks found.</p>
      ) : (
        <div className="task-grid">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </section>
  );
}
